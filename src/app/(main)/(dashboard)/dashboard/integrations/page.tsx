import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
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
  const cookieStore = await cookies();
  const user_id = cookieStore.get('user_id');
  // TODO: remove cookie lookup
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Integrations</h1>
          {/* <Button asChild variant="outline">
          <Link
            href="/dashboard/products/baseProducts"
            aria-label="Create Product"
            className="bg-layer hover: hover:no-underline"
          >
            <i className="mr-2 h-4 w-4 fa-solid fa-circle-plus"></i>
            Create Payout
          </Link>
        </Button> */}
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        <Button asChild>
          <Link
            href={`https://www.printful.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_PRINTFUL_CLIENT_ID}&state=${user_id?.value!}&redirect_url=https://${process.env.NEXT_PUBLIC_BASE_URL}/printful`}
          >
            Link to Printful
          </Link>
        </Button>

        <StripeIntegration />
      </section>
    </section>
  );
}
