import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import PrintfulIntegration from './printfulIntegration';
import StripeIntegration from './stripeIntegration';

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

export default async function Integrations() {
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Integrations</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto grid w-full max-w-[2428px] grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6">
        <PrintfulIntegration />
        <StripeIntegration />
      </section>
    </section>
  );
}
