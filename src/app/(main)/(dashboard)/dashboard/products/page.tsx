import { AddProductButton } from '@/components/sp-ui/AddProductButton';
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
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { columns } from './dataColumns';
import { NoProducts } from './noProducts';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`/sign-in`);
  }
  const productsRef: CollectionReference = collection(db, 'products');
  const q = query(
    productsRef,
    where('store_id', '==', slug.value),
    where('status', '!=', 'archived')
  );
  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  const data = productData.docs.map((item) => {
    return {
      id: item.id,
      colors: item.data().colors,
      price: item.data().price,
      compare_at: item.data().compare_at,
      currency: item.data().currency,
      inventory: item.data().inventory,
      track_inventory: item.data().track_inventory,
      is_featured: item.data().is_featured,
      like_count: item.data().like_count,
      name: item.data().name,
      revenue: item.data().revenue,
      tags: item.data().tags,
      product_type: item.data().product_type,
      units_sold: item.data().units_sold,
      owner_id: item.data().owner_id,
      view_count: item.data().view_count,
      status: item.data().status,
      store_id: item.data().store_id,
      images: item.data().images,
      filter: `${item.id}_${item.data().name}_${item.data().product_type}`,
    };
  });

  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `My Products`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/`,
      title: `My Products`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `My Products`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Products() {
  const cookieStore = await cookies();
  const default_store = cookieStore.get('default_store'); // TODO remove and switch to userStore
  const data = await getData(default_store);
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Products</h1>
          <AddProductButton copy="Add Product" />
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        {data.length! > 0 ? (
          <DataTable columns={columns} data={data!} />
        ) : (
          <NoProducts />
        )}
      </section>
    </section>
  );
}
