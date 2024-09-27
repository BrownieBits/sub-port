import { Metadata } from 'next';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import CartDetailPage from './cartDetailPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Cart`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/Cart/`,
      title: `Cart`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Cart`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Cart() {
  const country = headers().get('x-geo-country') as string;
  const city = headers().get('x-geo-city') as string;
  const region = headers().get('x-geo-region') as string;
  const ip = headers().get('x-ip') as string;

  return (
    <Suspense fallback={<></>}>
      <CartDetailPage country={country} city={city} region={region} ip={ip} />
    </Suspense>
  );
}
