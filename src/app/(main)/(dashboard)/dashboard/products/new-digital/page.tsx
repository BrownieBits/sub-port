import DigitalEditForm from '@/components/sp-ui/ProductEditForms/digitalEditForm';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `New Digital Product`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/new-digital`,
      title: `New Digital Product`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `New Digital Product`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function NewDigitalProduct() {
  const cookieStore = await cookies();
  const default_store = cookieStore.get('default_store');
  const user_id = cookieStore.get('user_id');
  return (
    <DigitalEditForm storeID={default_store?.value!} userID={user_id?.value!} />
  );
}
