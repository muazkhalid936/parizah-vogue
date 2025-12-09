/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://parizah-vogue.muazdev.site', // Replace with your actual domain
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  sitemapPath: 'sitemap.xml',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  // Exclude certain paths if needed
  exclude: ['/admin/*', '/api/*'],
  // Additional paths
  additionalPaths: async (config) => {
    const result = [];
    // You can add dynamic paths here if needed
    // For example, fetch product IDs and add /product/[id]
    return result;
  },
  // Transform function for dynamic entries
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};