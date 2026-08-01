// app/sitemap.js

export default async function sitemap() {
  const baseUrl = 'https://www.moonlightmachinery.com'

  // 1. Apne static pages ki list
  const staticPages = [
    '',
    '/home/about',
    '/home/contact',
    '/home/services',
    '/home/machines',
    '/home/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Database ya API se dynamic pages fetch karein
  const response = await fetch(baseUrl + '/api/home/product', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const pages = await response.json()

  // Admin pages ko filter karke baaki sabhi pages add karna
  const dynamicPages = pages.item
    .filter((page) => !page.slug.startsWith('admin')) // Yahan admin routes nikal jayenge
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  // Dono ko combine karke return kar dein
  return [...staticPages, ...dynamicPages]
}