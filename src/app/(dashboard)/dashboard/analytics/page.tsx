import { Metadata } from 'next';
import { cookies } from 'next/headers';
import AnalyticsPage from './analyticsPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Analytics`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/analytics/`,
      title: `Analytics`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Analytics`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default function Analytics() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  const default_store = cookieStore.get('default_store');
  // TODO: remove cookie lookup
  return (
    <AnalyticsPage
      user_id={user_id?.value!}
      default_store={default_store?.value!}
    />
  );
}
