// Vercel Serverless Function - creates blog posts in Sanity CMS
// Designed for AI agents to publish SEO-optimized blog posts via API

import { createClient } from '@sanity/client'

function generateKey() {
    return Math.random().toString(36).slice(2, 10)
}

// Convert markdown text to Sanity portable text blocks
function markdownToPortableText(markdown) {
    const lines = markdown.split('\n')
    const blocks = []
    let i = 0

    while (i < lines.length) {
        const line = lines[i]

        // Skip empty lines
        if (line.trim() === '') {
            i++
            continue
        }

        // Headings
        const headingMatch = line.match(/^(#{1,4})\s+(.+)/)
        if (headingMatch) {
            const level = headingMatch[1].length
            const style = level === 1 ? 'h2' : `h${level}` // Demote h1 to h2 (page title is h1)
            blocks.push({
                _type: 'block',
                _key: generateKey(),
                style,
                children: parseInlineMarks(headingMatch[2]),
                markDefs: extractMarkDefs(headingMatch[2]),
            })
            i++
            continue
        }

        // Blockquote
        if (line.startsWith('> ')) {
            const text = line.slice(2)
            blocks.push({
                _type: 'block',
                _key: generateKey(),
                style: 'blockquote',
                children: parseInlineMarks(text),
                markDefs: extractMarkDefs(text),
            })
            i++
            continue
        }

        // Unordered list
        if (/^[-*]\s+/.test(line)) {
            while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
                const text = lines[i].replace(/^[-*]\s+/, '')
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    listItem: 'bullet',
                    level: 1,
                    children: parseInlineMarks(text),
                    markDefs: extractMarkDefs(text),
                })
                i++
            }
            continue
        }

        // Ordered list
        if (/^\d+\.\s+/.test(line)) {
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                const text = lines[i].replace(/^\d+\.\s+/, '')
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    listItem: 'number',
                    level: 1,
                    children: parseInlineMarks(text),
                    markDefs: extractMarkDefs(text),
                })
                i++
            }
            continue
        }

        // Regular paragraph
        blocks.push({
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: parseInlineMarks(line),
            markDefs: extractMarkDefs(line),
        })
        i++
    }

    return blocks
}

// Parse inline marks (bold, italic, links) into Sanity span format
function parseInlineMarks(text) {
    const spans = []
    // Regex to find **bold**, *italic*, and [text](url)
    const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\))/g
    let lastIndex = 0
    let match

    while ((match = pattern.exec(text)) !== null) {
        // Add plain text before this match
        if (match.index > lastIndex) {
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: text.slice(lastIndex, match.index),
                marks: [],
            })
        }

        if (match[2]) {
            // Bold
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: match[2],
                marks: ['strong'],
            })
        } else if (match[3]) {
            // Italic
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: match[3],
                marks: ['em'],
            })
        } else if (match[4] && match[5]) {
            // Link - use href as mark key
            const linkKey = generateKey()
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: match[4],
                marks: [linkKey],
            })
        }

        lastIndex = match.index + match[0].length
    }

    // Remaining text
    if (lastIndex < text.length) {
        spans.push({
            _type: 'span',
            _key: generateKey(),
            text: text.slice(lastIndex),
            marks: [],
        })
    }

    // If no spans were created, return the whole text as one span
    if (spans.length === 0) {
        spans.push({
            _type: 'span',
            _key: generateKey(),
            text,
            marks: [],
        })
    }

    return spans
}

// Extract link markDefs from text
function extractMarkDefs(text) {
    const defs = []
    const linkPattern = /\[(.+?)\]\((.+?)\)/g
    let match

    // We need to sync keys with parseInlineMarks - re-parse to find link keys
    // Since we use random keys, we need a deterministic approach
    // Instead, we'll rebuild with consistent keys using a seeded approach
    while ((match = linkPattern.exec(text)) !== null) {
        defs.push({
            _type: 'link',
            _key: 'will-be-set', // placeholder
            href: match[2],
        })
    }

    return defs
}

// Improved version that keeps markDefs and spans in sync
function markdownToBlocks(markdown) {
    const lines = markdown.split('\n')
    const blocks = []
    let i = 0

    while (i < lines.length) {
        const line = lines[i]

        if (line.trim() === '') {
            i++
            continue
        }

        const headingMatch = line.match(/^(#{1,4})\s+(.+)/)
        if (headingMatch) {
            const level = headingMatch[1].length
            const style = level === 1 ? 'h2' : `h${level}`
            const { spans, markDefs } = parseText(headingMatch[2])
            blocks.push({
                _type: 'block',
                _key: generateKey(),
                style,
                children: spans,
                markDefs,
            })
            i++
            continue
        }

        if (line.startsWith('> ')) {
            const text = line.slice(2)
            const { spans, markDefs } = parseText(text)
            blocks.push({
                _type: 'block',
                _key: generateKey(),
                style: 'blockquote',
                children: spans,
                markDefs,
            })
            i++
            continue
        }

        if (/^[-*]\s+/.test(line)) {
            while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
                const text = lines[i].replace(/^[-*]\s+/, '')
                const { spans, markDefs } = parseText(text)
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    listItem: 'bullet',
                    level: 1,
                    children: spans,
                    markDefs,
                })
                i++
            }
            continue
        }

        if (/^\d+\.\s+/.test(line)) {
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                const text = lines[i].replace(/^\d+\.\s+/, '')
                const { spans, markDefs } = parseText(text)
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    listItem: 'number',
                    level: 1,
                    children: spans,
                    markDefs,
                })
                i++
            }
            continue
        }

        const { spans, markDefs } = parseText(line)
        blocks.push({
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: spans,
            markDefs,
        })
        i++
    }

    return blocks
}

// Parse inline text into spans and markDefs with synced keys
function parseText(text) {
    const spans = []
    const markDefs = []
    const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\))/g
    let lastIndex = 0
    let match

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: text.slice(lastIndex, match.index),
                marks: [],
            })
        }

        if (match[2]) {
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: match[2],
                marks: ['strong'],
            })
        } else if (match[3]) {
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: match[3],
                marks: ['em'],
            })
        } else if (match[4] && match[5]) {
            const linkKey = generateKey()
            markDefs.push({
                _type: 'link',
                _key: linkKey,
                href: match[5],
            })
            spans.push({
                _type: 'span',
                _key: generateKey(),
                text: match[4],
                marks: [linkKey],
            })
        }

        lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
        spans.push({
            _type: 'span',
            _key: generateKey(),
            text: text.slice(lastIndex),
            marks: [],
        })
    }

    if (spans.length === 0) {
        spans.push({
            _type: 'span',
            _key: generateKey(),
            text,
            marks: [],
        })
    }

    return { spans, markDefs }
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .slice(0, 96)
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Auth check
    const authHeader = req.headers.authorization
    const expectedToken = process.env.BLOG_API_SECRET
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN
    if (!SANITY_WRITE_TOKEN) {
        console.error('Missing SANITY_WRITE_TOKEN')
        return res.status(500).json({ error: 'Server configuration error' })
    }

    const {
        title,
        body,           // Markdown string
        excerpt,        // Short summary for cards/previews
        author = 'New Energy Initiative',
        categories = [],
        metaDescription, // SEO meta description (falls back to excerpt)
        focusKeyword,   // Primary SEO keyword
        publishedAt,    // ISO datetime (defaults to now)
        slug,           // Optional custom slug (auto-generated from title if omitted)
        mainImageUrl,   // Optional URL of an image to reference
    } = req.body

    // Validate required fields
    if (!title || !body) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['title', 'body'],
            optional: ['excerpt', 'author', 'categories', 'metaDescription', 'focusKeyword', 'publishedAt', 'slug', 'mainImageUrl'],
        })
    }

    const sanityClient = createClient({
        projectId: 'y1pdy8w6',
        dataset: 'production',
        apiVersion: '2024-01-01',
        token: SANITY_WRITE_TOKEN,
        useCdn: false,
    })

    const postSlug = slug || slugify(title)

    // Check for duplicate slug
    const existing = await sanityClient.fetch(
        `*[_type == "post" && slug.current == $slug][0]._id`,
        { slug: postSlug }
    )
    if (existing) {
        return res.status(409).json({
            error: 'A post with this slug already exists',
            slug: postSlug,
            existingId: existing,
        })
    }

    // Convert markdown body to portable text
    const bodyBlocks = markdownToBlocks(body)

    // Build the document
    const doc = {
        _type: 'post',
        title,
        slug: { _type: 'slug', current: postSlug },
        author,
        publishedAt: publishedAt || new Date().toISOString(),
        excerpt: excerpt || '',
        body: bodyBlocks,
        categories: Array.isArray(categories) ? categories : [categories],
        metaDescription: metaDescription || excerpt || '',
        focusKeyword: focusKeyword || '',
    }

    // If a main image URL is provided, upload it to Sanity
    if (mainImageUrl) {
        try {
            const imageResponse = await fetch(mainImageUrl)
            if (imageResponse.ok) {
                const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
                const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
                const ext = contentType.split('/')[1] || 'jpg'
                const asset = await sanityClient.assets.upload('image', imageBuffer, {
                    filename: `${postSlug}.${ext}`,
                    contentType,
                })
                doc.mainImage = {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id },
                }
            }
        } catch (err) {
            console.error('Failed to upload main image:', err.message)
            // Continue without image - don't fail the whole post
        }
    }

    try {
        const result = await sanityClient.create(doc)

        return res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            post: {
                id: result._id,
                title: result.title,
                slug: postSlug,
                url: `/blog/${postSlug}`,
                publishedAt: result.publishedAt,
            },
        })
    } catch (error) {
        console.error('Sanity create error:', error)
        return res.status(500).json({
            error: 'Failed to create blog post',
            details: error.message,
        })
    }
}
