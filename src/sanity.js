import { createClient } from '@sanity/client'

export const client = createClient({
    projectId: 'YOUR_PROJECT_ID', // We'll set this up next
    dataset: 'production',
    useCdn: true, // Use CDN for faster reads
    apiVersion: '2024-01-01',
})

// Helper function to fetch blog posts
export async function getBlogPosts() {
    return await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    "author": author->name,
    mainImage,
    body
  }`)
}

// Helper function to fetch page content
export async function getPageContent(pageId) {
    return await client.fetch(`*[_type == "page" && slug.current == $pageId][0]`, { pageId })
}

// Helper function to fetch all affiliate links
export async function getAffiliateLinks() {
    return await client.fetch(`*[_type == "affiliateLink"] {
    _id,
    name,
    url,
    description,
    category
  }`)
}
