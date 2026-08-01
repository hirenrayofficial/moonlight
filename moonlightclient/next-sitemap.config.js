/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.moonlightmachinery.com',
  generateRobotsTxt: true, // (optional) Generates a robots.txt file for you
  exclude: ['/protected-page', '/admin/*'], // Pages you want to exclude
  // ...other options (sitemapSize, changefreq, etc.)
}