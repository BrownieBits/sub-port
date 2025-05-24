import { DataTable } from '@/components/sp-ui/DataTable';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  query,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { columns } from './dataColumns';
import { NewPromotionButton } from './newPromotionButton';
import { NoPromotions } from './noPromotions';

async function getData(store_id: string) {
  const promotionsRef: CollectionReference = collection(
    db,
    'stores',
    store_id,
    'promotions'
  );
  const q = query(promotionsRef);
  const promotionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  const data = promotionsData.docs.map((item) => {
    return {
      id: item.id,
      amount: item.data().amount,
      name: item.data().name,
      minimum_order_value: item.data().minimum_order_value,
      number_of_uses: item.data().number_of_used,
      times_used: item.data().times_used,
      type: item.data().type,
      expiration_date: item.data().expiration_date
        ? new Date(item.data().expiration_date.seconds * 1000)
        : undefined,
      user_id: item.data().user_id,
      status: item.data().status,
      store_id: store_id,
      show_in_banner: item.data().show_in_banner,
      filter: `${item.id}_${item.data().type}`,
    };
  });

  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Promotions`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/promotions/`,
      title: `Promotions`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Promotions`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Promotions() {
  const cookieStore = await cookies();
  const user_id = cookieStore.get('user_id');
  const default_store = cookieStore.get('default_store');
  const data = await getData(default_store?.value!);
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Promotions</h1>
          <NewPromotionButton text="Add Promotion" />
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        {data?.length! > 0 ? (
          <DataTable columns={columns} data={data!} />
        ) : (
          <NoPromotions />
        )}
      </section>
    </section>
  );
}
