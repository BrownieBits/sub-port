import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LatestBlog } from './latestBlog';
import { LatestProduct } from './latestProduct';
import { StoreAnalytics } from './storeAnalytics';

async function getData(default_store: { [key: string]: string } | undefined) {
  if (default_store === undefined) {
    redirect(`sign-in`);
  }
  const docRef: DocumentReference = doc(db, 'stores', default_store?.value);
  const data: DocumentData = await getDoc(docRef);
  if (!data.exists()) {
    redirect(`/dashboard/products/collections`);
  }
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(default_store);
  return {
    title: `${data.data().name} - Dashboard`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/`,
      title: `${data.data().name} - Dashboard`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `${data.data().name} - Dashboard`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const user_id = cookieStore.get('user_id');
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(default_store);

  return (
    <>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Dashboard</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto flex w-full max-w-[2428px] flex-col gap-8 px-4 py-8 md:flex-row">
        <section className="flex-1">
          <LatestProduct user_id={user_id?.value!} />
        </section>
        <section className="flex-1">
          <StoreAnalytics />
        </section>
        <section className="flex-1">
          <LatestBlog />
        </section>
      </section>
    </>
  );
}
