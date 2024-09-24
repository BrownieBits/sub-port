import StoreCard from '@/components/sp-ui/StoreCard';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NoSubscriptions } from './noSubscriptions';

type Props = {
  params: {};
};

async function getData(id: { [key: string]: string } | undefined) {
  if (id === undefined) {
    redirect(`/sign-in?redirect=/subscriptions`);
  }
  const userSubsRef = collection(db, 'users', id.value, 'subscribes');
  const data: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(userSubsRef);
  return data;
}

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
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  const data = await getData(user_id);
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>My Subscriptions</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        {data.docs.length === 0 ? (
          <NoSubscriptions />
        ) : (
          <section className="grid grid-cols-2 gap-x-8 gap-y-[60px] px-4 py-8 md:grid-cols-4 xl:grid-cols-6">
            {data.docs.map((doc) => {
              return <StoreCard id={doc.id} key={doc.id} />;
            })}
          </section>
        )}
      </section>
    </section>
  );
}
