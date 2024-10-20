import { Metadata } from 'next';
import { headers } from 'next/headers';
import { FeedbackForm } from './feedbackForm';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Send Feedback`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/send-feedback/`,
      title: `Send Feedback`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Send Feedback`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function SendFeedback() {
  const country = (await headers()).get('x-geo-country') as string;
  const city = (await headers()).get('x-geo-city') as string;
  const region = (await headers()).get('x-geo-region') as string;
  const ip = (await headers()).get('x-ip') as string;

  return <FeedbackForm country={country} city={city} region={region} ip={ip} />;
}
