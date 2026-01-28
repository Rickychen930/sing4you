import { SectionModel } from '../models/SectionModel';
import { PerformanceModel } from '../models/PerformanceModel';
import { SEOSettingsModel } from '../models/SEOSettingsModel';
import { CategoryModel } from '../models/CategoryModel';
import { VariationModel } from '../models/VariationModel';

export class SitemapGenerator {
  public static async generate(): Promise<string> {
    const seoSettings = await SEOSettingsModel.getSettings();
    const baseUrl = seoSettings?.siteUrl || process.env.SITE_URL || 'https://christina-sings4you.com.au';

    const sections = await SectionModel.findAll();
    const performances = await PerformanceModel.findAll();
    const categories = await CategoryModel.findAll();
    const variations = await VariationModel.findAll();

    const urls: Array<{ loc: string; changefreq: string; priority: string; lastmod?: string }> = [
      { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
      { loc: `${baseUrl}/#hero`, changefreq: 'daily', priority: '0.9' },
      { loc: `${baseUrl}/#trust`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${baseUrl}/#services`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${baseUrl}/#booking-process`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${baseUrl}/#performances`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${baseUrl}/#testimonials`, changefreq: 'weekly', priority: '0.7' },
      { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.9' },
      { loc: `${baseUrl}/categories`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${baseUrl}/performances`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.8' },
    ];

    sections.forEach((section) => {
      urls.push({
        loc: `${baseUrl}/sections/${section.slug}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: section.updatedAt ? new Date(section.updatedAt).toISOString() : undefined,
      });
    });

    performances.forEach((performance) => {
      urls.push({
        loc: `${baseUrl}/performances/${performance._id}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: performance.updatedAt ? new Date(performance.updatedAt).toISOString() : undefined,
      });
    });

    categories.forEach((category) => {
      if (category._id) {
        urls.push({
          loc: `${baseUrl}/categories/${category._id}`,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: category.updatedAt ? new Date(category.updatedAt).toISOString() : undefined,
        });
      }
    });

    variations.forEach((variation) => {
      if (variation._id) {
        urls.push({
          loc: `${baseUrl}/variations/${variation._id}`,
          changefreq: 'weekly',
          priority: '0.7',
          lastmod: variation.updatedAt ? new Date(variation.updatedAt).toISOString() : undefined,
        });
      }
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

    return xml;
  }
}