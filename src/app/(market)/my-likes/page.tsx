import ProductCard from '@/components/sp-ui/ProductCard';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { GridProduct } from '@/lib/types';
import {
  DocumentData,
  QuerySnapshot,
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NoLikes } from './noLikes';

type Data = {
  products?: QuerySnapshot<DocumentData, DocumentData>;
  error?: string;
};

async function getData(id: { [key: string]: string } | undefined) {
  if (id === undefined) {
    redirect(`sign-in?redirect=/my-likes`);
  }
  const userSubsRef = collection(db, 'users', id.value, 'likes');
  const data: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(userSubsRef);

  if (data.docs.length === 0) {
    return {
      error: 'No Likes',
    };
  }
  const ids = data.docs.map((doc) => doc.id);
  const productsRef = collection(db, 'products');
  const productsQuery = query(
    productsRef,
    where('__name__', 'in', ids),
    where('status', '==', 'Public')
  );

  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(productsQuery);

  return {
    products: productData,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `My Likes`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/my-likes/`,
      title: `My Likes`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `My Likes`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function LikedItems() {
  const cookieStore = await cookies();
  const user_id = cookieStore.get('user_id');
  const data: Data = await getData(user_id);
  if (data.error === 'No Likes') {
    return <NoLikes />;
  }
  let products: GridProduct[] = [];
  if (data.products) {
    products = data.products?.docs.map((product): GridProduct => {
      return {
        name: product.data().name as string,
        images: product.data().images as string[],
        product_type: product.data().product_type as string,
        price: product.data().price as number,
        compare_at: product.data().compare_at as number,
        currency: product.data().currency as string,
        like_count: product.data().like_count as number,
        store_id: product.data().store_id as string,
        created_at: product.data().created_at as Timestamp,
        id: product.id as string,
      };
    });
  }

  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>My Likes</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6">
          {products?.map((doc) => (
            <ProductCard product={doc} show_creator={true} key={doc.id} />
          ))}
        </section>
      </section>
    </section>
  );
}
