import { db } from '../firebase';
import {
    getArticlesByCategory, getCategories, getSiteByDomain
} from '~/functions/src/shared';

export default defineEventHandler(
    async event => {
        const protocol = event.req.headers['x-forwarded-proto'] || 'http';
        const domain = (event.req.headers['x-forwarded-host'] || 'localhost') as string;
        const baseUrl = `${protocol}://${domain}`;

        const siteRef = await getSiteByDomain(
            domain,
            db
        );
        const { locales } = siteRef!;

        const categories = await getCategories(
            siteRef!,
            db
        );

        const categoriesPages = categories.map(
            category => {
                return locales.map(
                    (
                        locale: string
                    ) => {
                        return {
                            url: `/${locale}/categoties/${category.slug[locale]}`,
                            lastmod: new Date().toISOString(),
                            changefreq: 'weekly',
                            priority: 0.8
                        };
                    }
                );
            }
        ).flat();

        const articlesPages = (await Promise.all(
            categories.map(
                async (
                    category
                ) => {
                    const articles = await getArticlesByCategory(
                        category
                    );

                    return locales.map(
                        (
                            locale: string
                        ) => {
                            return articles.map(
                                article => {
                                    return {
                                        url: `/${locale}/${category.slug[locale]}/${article.slug[locale]}`,
                                        lastmod: new Date().toISOString(),
                                        changefreq: 'weekly',
                                        priority: 0.8
                                    };
                                }
                            );
                        }
                    ).flat();
                }
            ).flat()
        )).flat();

        const allPages = [...categoriesPages,
        ...articlesPages];

        const sitemapContent = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allPages.map(
            page => `
          <url>
            <loc>${baseUrl}${page.url}</loc>
            <lastmod>${page.lastmod}</lastmod>
            <changefreq>${page.changefreq}</changefreq>
            <priority>${page.priority}</priority>
          </url>
        `
        ).join(
            ''
        )}
      </urlset>
    `.trim();

        event.res.setHeader(
            'Content-Type',
            'application/xml'
        );
        event.res.end(
            sitemapContent
        );
    }
);