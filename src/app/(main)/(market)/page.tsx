import { analytics, db } from '@/lib/firebase';
import { _GridProduct } from '@/lib/types';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { ProductFeed } from '../productFeed';

type Data = {
  products: QuerySnapshot<DocumentData, DocumentData>;
  collections: QuerySnapshot<DocumentData, DocumentData>;
};

async function getData() {
  analytics;
  const productsRef: CollectionReference = collection(db, 'products');
  const q = query(
    productsRef,
    where('status', '==', 'Public'),
    where('created_at', '!=', null),
    orderBy('created_at', 'desc')
  );
  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  return productData;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/`,
      title: `SubPort Creator Platform`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      title: `SubPort Creator Platform`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Home() {
  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getData();
  let products: _GridProduct[] = productData.docs.map(
    (product): _GridProduct => {
      return {
        name: product.data().name as string,
        images: product.data().images as string[],
        product_type: product.data().product_type as string,
        price: product.data().price as number,
        compare_at: product.data().compare_at as number,
        currency: product.data().currency as string,
        like_count: product.data().like_count as number,
        store_id: product.data().store_id as string,
        created_at: new Date(product.data().created_at.seconds * 1000),
        id: product.id as string,
      };
    }
  );

  return (
    <main>
      <section className="mx-auto w-full max-w-[2428px]">
        <ProductFeed />
      </section>
    </main>
  );
}
