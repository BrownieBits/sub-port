import { Metadata } from 'next';
import StripeIntegration from './stripeIntegration';

type Params = Promise<{ accountID: string }>;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Integrations`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/integrations/`,
      title: `Integrations`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Integrations`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function StripeConnectReturn({
  params,
}: {
  params: Params;
}) {
  const { accountID } = await params;
  return <StripeIntegration accountID={accountID} />;
}
