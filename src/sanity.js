import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'y1pdy8w6',
  dataset: 'production',
  useCdn: true, // Use CDN for faster reads
  apiVersion: '2024-01-01',
})

// Helper to generate image URLs
const builder = imageUrlBuilder(client)
export function urlFor(source) {
  return builder.image(source)
}

// Helper function to fetch blog posts
export async function getBlogPosts() {
  return await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    author,
    mainImage,
    body,
    categories
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
    category,
    icon,
    image
  }`)
}
