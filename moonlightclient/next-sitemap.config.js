/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.moonlightmachinery.com',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/api/*'],

  // Yeh function build ke waqt aapki API se saare products le aayega
  additionalPaths: async (config) => {
    const result = []

    try {
      // Apni API ko call karein (Production ya localhost URL)
      const response = await fetch('https://www.moonlightmachinery.com/api/home/product')
      const data = await response.json()
      
      // Aapke API response ke mutabiq products 'item' array mein hain
      const products = data.item || []

      products.forEach((product) => {
        if (product.slug) {
          result.push({
            loc: `/home/machines/${product.slug}`,
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: new Date().toISOString(),
          })
        }
      })
    } catch (error) {
      console.error('Error fetching products for sitemap:', error)
    }

    return result
  },
}