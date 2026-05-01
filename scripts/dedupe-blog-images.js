// One-time script: find blog posts that share a main image asset with another
// post and replace their image with a fresh, unique Unsplash photo.
//
// - Groups posts by mainImage.asset._ref
// - Leaves the oldest post in each duplicate group alone (keeps the original)
// - For every other post in the group, fetches a fresh Unsplash photo whose ID
//   is not already in use across the dataset, uploads it, and patches
//   mainImage on the post
// - Image filenames are stamped with `-ux-<unsplashId>.<ext>` so future posts
//   (via api/create-post.js) can continue to dedup.
//
// Run from repo root: `node scripts/dedupe-blog-images.js`

import 'dotenv/config'
import { createClient } from '@sanity/client'

const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY

if (!SANITY_WRITE_TOKEN) {
    console.error('Missing SANITY_WRITE_TOKEN in env')
    process.exit(1)
}
if (!UNSPLASH_KEY) {
    console.error('Missing UNSPLASH_ACCESS_KEY in env')
    process.exit(1)
}

const client = createClient({
    projectId: 'y1pdy8w6',
    dataset: 'production',
    apiVersion: '2025-01-01',
    token: SANITY_WRITE_TOKEN,
    useCdn: false,
})

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
}

async function fetchUnsplashCandidates(query) {
    const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
    if (!res.ok) {
        console.warn(`  Unsplash error ${res.status} for "${query}"`)
        return []
    }
    const data = await res.json()
    return Array.isArray(data.results) ? data.results : []
}

async function getUsedUnsplashIds() {
    const filenames = await client.fetch(
        `*[_type == "sanity.imageAsset" && defined(originalFilename)].originalFilename`
    )
    const ids = new Set()
    for (const fn of filenames || []) {
        const m = typeof fn === 'string' ? fn.match(/-ux-([A-Za-z0-9_-]+)\./) : null
        if (m) ids.add(m[1])
    }
    return ids
}

async function replaceImage(post, usedUnsplashIds, usedAssetIds) {
    // Fetch a pool of candidates from Unsplash using available queries
    const queries = [post.focusKeyword, post.title].filter(Boolean)
    const candidates = []
    for (const q of queries) {
        const results = await fetchUnsplashCandidates(q)
        for (const r of results) {
            if (r?.id && r?.urls?.regular && !candidates.some(c => c.id === r.id)) {
                candidates.push(r)
            }
        }
        await sleep(200)
        if (candidates.length >= 30) break
    }

    // Try candidates in order, skipping used Unsplash IDs; after upload,
    // also reject if the returned Sanity asset ID is already in use
    // (Sanity dedups by content SHA, so the same image bytes always map to
    // the same asset — different Unsplash IDs can have identical bytes).
    for (const cand of candidates) {
        if (usedUnsplashIds.has(cand.id)) continue

        let buf, contentType, ext
        try {
            const imgRes = await fetch(cand.urls.regular)
            if (!imgRes.ok) continue
            buf = Buffer.from(await imgRes.arrayBuffer())
            contentType = imgRes.headers.get('content-type') || 'image/jpeg'
            ext = (contentType.split('/')[1] || 'jpg').split(';')[0]
        } catch (err) {
            console.warn(`  [try-next] download failed for ${cand.id}: ${err.message}`)
            continue
        }

        let asset
        try {
            asset = await client.assets.upload('image', buf, {
                filename: `${post.slug}-ux-${cand.id}.${ext}`,
                contentType,
            })
        } catch (err) {
            console.warn(`  [try-next] upload failed for ${cand.id}: ${err.message}`)
            continue
        }

        if (usedAssetIds.has(asset._id)) {
            console.log(`  [try-next] ${cand.id} mapped to already-used asset ${asset._id}`)
            usedUnsplashIds.add(cand.id) // mark so we don't try it again this run
            continue
        }

        await client
            .patch(post._id)
            .set({
                mainImage: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id },
                },
            })
            .commit()

        usedUnsplashIds.add(cand.id)
        usedAssetIds.add(asset._id)
        console.log(`  [ok] -> ${cand.id} (asset ${asset._id})`)
        return true
    }

    console.warn(`  [skip] Exhausted ${candidates.length} candidates for "${post.title}"`)
    return false
}

async function main() {
    const posts = await client.fetch(`*[_type == "post"] | order(publishedAt asc) {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        focusKeyword,
        "imageAssetId": mainImage.asset._ref
    }`)

    console.log(`Fetched ${posts.length} posts`)

    // Group by asset id
    const byAsset = new Map()
    for (const p of posts) {
        if (!p.imageAssetId) continue
        if (!byAsset.has(p.imageAssetId)) byAsset.set(p.imageAssetId, [])
        byAsset.get(p.imageAssetId).push(p)
    }

    // Collect posts that need a new image: every duplicate except the earliest
    const targets = []
    for (const [assetId, group] of byAsset.entries()) {
        if (group.length > 1) {
            // group is already sorted asc by publishedAt; keep group[0], replace the rest
            for (let i = 1; i < group.length; i++) {
                targets.push(group[i])
            }
        }
    }

    console.log(`Found ${targets.length} posts to re-image (across ${[...byAsset.values()].filter(g => g.length > 1).length} duplicate groups)`)

    const usedUnsplashIds = await getUsedUnsplashIds()
    const usedAssetIds = new Set(
        posts
            .map(p => p.imageAssetId)
            .filter(Boolean)
            // seed with every currently-referenced asset; as we replace, we'll
            // drop the asset the target was using (since it'll be re-pointed)
    )
    // Remove from usedAssetIds the assets that the targets currently use so
    // we don't block ourselves from using them via another path (we're
    // explicitly trying to move off them).
    for (const t of targets) {
        if (t.imageAssetId) usedAssetIds.delete(t.imageAssetId)
    }
    // But add them back after we decide to keep one: keep the oldest.
    for (const [assetId, group] of byAsset.entries()) {
        if (group.length > 1) usedAssetIds.add(assetId) // the kept post still uses it
    }
    console.log(`Loaded ${usedUnsplashIds.size} in-use Unsplash IDs and ${usedAssetIds.size} in-use asset IDs to avoid`)

    let ok = 0, skipped = 0
    for (const post of targets) {
        console.log(`\n[${ok + skipped + 1}/${targets.length}] ${post.title}`)
        try {
            const didReplace = await replaceImage(post, usedUnsplashIds, usedAssetIds)
            if (didReplace) ok++
            else skipped++
        } catch (err) {
            console.error(`  [error] ${err.message}`)
            skipped++
        }
        await sleep(300) // pacing
    }

    console.log(`\nDone. Replaced: ${ok}, Skipped: ${skipped}`)
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
