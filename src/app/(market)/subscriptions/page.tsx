import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import { StoreSubscriptions } from './subscriptionsPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Subscriptions`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions/`,
      title: `Subscriptions`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      title: `Subscriptions`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Subscriptions() {
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>My Subscriptions</h1>
        </section>
      </section>
      <Separator />
      <StoreSubscriptions />
    </section>
  );
}
