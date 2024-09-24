import ProductCard from '@/components/sp-ui/ProductCard';
import { Separator } from '@/components/ui/separator';

import { GridProduct } from '@/lib/types';
import { DocumentData, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { Metadata } from 'next';
import { NoProducts } from './noProducts';

type Props = {
  params: { group: string };
};
type Data = {
  error?: string;
  title?: string;
  products?: QuerySnapshot<DocumentData, DocumentData>;
};

async function getData(group: string) {
  // const data = await currentClient.getEntries({
  //   content_type: 'marketplacePage',
  //   'fields.slug': `${group}`,
  // });
  // if (data.items.length === 0) {
  //   return {
  //     error: 'No Page',
  //   };
  // } else {
  //   const productsColRef = collection(db, 'products');
  //   if (data.items[0].fields.type === 'Trending') {
  //     const q = query(
  //       productsColRef,
  //       where('revenue', '>=', data.items[0].fields.trendingOver),
  //       orderBy('revenue')
  //     );
  //     const productsData: QuerySnapshot<DocumentData, DocumentData> =
  //       await getDocs(q);

  //     return {
  //       title: data.items[0].fields.title,
  //       products: productsData,
  //     };
  //   } else if (data.items[0].fields.type === 'Manual') {
  //     const products = data.items[0].fields.productList.map((item: string) => {
  //       return item;
  //     });
  //     const q = query(productsColRef, where('__name__', 'in', products));
  //     const productsData: QuerySnapshot<DocumentData, DocumentData> =
  //       await getDocs(q);
  //     return {
  //       title: data.items[0].fields.title,
  //       products: productsData,
  //     };
  //   } else if (data.items[0].fields.type === 'Tags') {
  //     const q = query(
  //       productsColRef,
  //       or(
  //         where('tags', 'array-contains-any', data.items[0].fields.tags),
  //         where('admin_tags', 'array-contains-any', data.items[0].fields.tags)
  //       )
  //     );
  //     const productsData: QuerySnapshot<DocumentData, DocumentData> =
  //       await getDocs(q);
  //     return {
  //       title: data.items[0].fields.title,
  //       products: productsData,
  //     };
  //   }
  //   return {
  //     title: data.items[0].fields.title,
  //   };
  // }
  return {
    error: 'No Page',
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: Data = await getData(params.group);
  if (data.error === 'No Page') {
    return {
      title: 'Marketplace',
    };
  }
  const description = '';
  // const description = `Discover a vast selection of ${data.title} products at SubPort. Find everything from ${data.products?.docs[0].data().name} to ${data.products?.docs[1].data().name} and more. Compare prices, read reviews, and enjoy safe and secure shopping. Explore our diverse range of ${params.group} products today!`;
  return {
    title: `${data.title} Marketplace`,
    description: description,
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/market/${params.group}`,
      title: `${data.title} Marketplace`,
      siteName: 'SubPort Creator Platform',
      description: description,
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `${data.title} Marketplace`,
      description: description,
      site: 'SubPort Creator Platform',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
  };
}

export default async function MarketplacePage({ params }: Props) {
  const data: Data = await getData(params.group);

  if (data.error === 'No Page') {
    return <>No Marketplace Page</>;
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
          <h1>{data.title}</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        {products.length === 0 ? (
          <NoProducts />
        ) : (
          <section className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6">
            {products?.map((doc) => (
              <ProductCard product={doc} show_creator={true} key={doc.id} />
            ))}
          </section>
        )}
      </section>
    </section>
  );
}
