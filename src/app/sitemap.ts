import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `https://${process.env.NEXT_PUBLIC_BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/my-likes`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/send-feedback`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/help`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.1,
        },
        {
            url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.1,
        },
    ];
}
