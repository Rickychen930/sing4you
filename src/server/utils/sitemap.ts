import { SectionModel } from '../models/SectionModel';
import { PerformanceModel } from '../models/PerformanceModel';
import { BlogPostModel } from '../models/BlogPostModel';
import { SEOSettingsModel } from '../models/SEOSettingsModel';

export class SitemapGenerator {
  public static async generate(): Promise<string> {
    const seoSettings = await SEOSettingsModel.getSettings();
    const baseUrl = seoSettings?.siteUrl || process.env.SITE_URL || 'https://christinasings4u.com.au';

    const sections = await SectionModel.findAll();
    const performances = await PerformanceModel.findAll();
    const blogPosts = await BlogPostModel.findPublished();

    const urls: string[] = [
      `${baseUrl}/`,
      `${baseUrl}/performances`,
      `${baseUrl}/blog`,
      `${baseUrl}/contact`,
    ];

    sections.forEach((section) => {
      urls.push(`${baseUrl}/sections/${section.slug}`);
    });

    performances.forEach((performance) => {
      urls.push(`${baseUrl}/performances/${performance._id}`);
    });

    blogPosts.forEach((post) => {
      urls.push(`${baseUrl}/blog/${post.slug}`);
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return xml;
  }
}