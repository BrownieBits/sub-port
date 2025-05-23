import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import HelpCenterPage from './helpCenterPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Help`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/help/`,
      title: `Help`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Help`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default function Help() {
  return (
    <section>
      <section className="mx-auto w-full max-w-[1200px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Help Center</h1>
        </section>
      </section>
      <Separator />
      <HelpCenterPage />
    </section>
  );
}
