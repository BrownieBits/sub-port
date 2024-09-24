import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Commissions`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/commissions/`,
      title: `Commissions`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Commissions`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default function Commisions() {
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Commissions</h1>
          <Button asChild variant="outline">
            <Link
              href="/dashboard/products/baseProducts"
              aria-label="Create Product"
              className="bg-layer hover:bg-layer-one hover:no-underline"
            >
              <i className="fa-solid fa-circle-plus mr-2 h-4 w-4"></i>
              New Payout
            </Link>
          </Button>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]"></section>
    </section>
  );
}
