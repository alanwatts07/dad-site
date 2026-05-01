// Back-fill mainImage for posts that have none. Uses the same dedup logic as
// dedupe-blog-images.js: fetches Unsplash candidates, skips IDs already in
// use, and after each upload verifies the resulting Sanity asset ID isn't
// already referenced by another post (Sanity content-hash dedup can map
// different Unsplash photos to the same asset if the bytes match).

import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
    projectId: 'y1pdy8w6',
    dataset: 'production',
    apiVersion: '2025-01-01',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
})

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchUnsplash(query) {
    const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
    if (!res.ok) return []
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

async function getUsedAssetIds() {
    const refs = await client.fetch(
        `*[_type == "post" && defined(mainImage.asset._ref)].mainImage.asset._ref`
    )
    return new Set(refs || [])
}

async function pickAndAttach(post, usedUnsplashIds, usedAssetIds) {
    const queries = [post.focusKeyword, post.title].filter(Boolean)
    const candidates = []
    for (const q of queries) {
        const results = await fetchUnsplash(q)
        for (const r of results) {
            if (r?.id && r?.urls?.regular && !candidates.some(c => c.id === r.id)) {
                candidates.push(r)
            }
        }
        await sleep(200)
        if (candidates.length >= 30) break
    }

    for (const cand of candidates) {
        if (usedUnsplashIds.has(cand.id)) continue
        let buf, contentType, ext
        try {
            const imgRes = await fetch(cand.urls.regular)
            if (!imgRes.ok) continue
            buf = Buffer.from(await imgRes.arrayBuffer())
            contentType = imgRes.headers.get('content-type') || 'image/jpeg'
            ext = (contentType.split('/')[1] || 'jpg').split(';')[0]
        } catch {
            continue
        }

        let asset
        try {
            asset = await client.assets.upload('image', buf, {
                filename: `${post.slug}-ux-${cand.id}.${ext}`,
                contentType,
            })
        } catch {
            continue
        }

        if (usedAssetIds.has(asset._id)) {
            usedUnsplashIds.add(cand.id)
            continue
        }

        await client.patch(post._id).set({
            mainImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
        }).commit()

        usedUnsplashIds.add(cand.id)
        usedAssetIds.add(asset._id)
        console.log(`  [ok] -> ${cand.id} (asset ${asset._id})`)
        return true
    }
    console.warn(`  [skip] exhausted ${candidates.length} candidates`)
    return false
}

async function main() {
    const posts = await client.fetch(
        `*[_type == "post" && !defined(mainImage.asset._ref)]{_id, title, "slug": slug.current, focusKeyword}`
    )
    console.log(`Posts missing image: ${posts.length}`)
    const usedUnsplashIds = await getUsedUnsplashIds()
    const usedAssetIds = await getUsedAssetIds()
    console.log(`Avoiding ${usedUnsplashIds.size} Unsplash IDs and ${usedAssetIds.size} asset IDs`)

    for (const p of posts) {
        console.log(`\n${p.title}`)
        try {
            await pickAndAttach(p, usedUnsplashIds, usedAssetIds)
        } catch (err) {
            console.error(`  [error] ${err.message}`)
        }
        await sleep(300)
    }
}

main().catch(err => { console.error(err); process.exit(1) })
