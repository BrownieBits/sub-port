import { db } from '@/lib/firebase';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import ProductDetailPage from './productDetailPage';
import ProductLoading from './productLoading';
import TrackProductViews from './trackProductView';
import { options, variants } from './typedef';

type Params = Promise<{ productId: string }>;
type Data = {
  store?: DocumentData;
  product?: DocumentData;
  options?: QuerySnapshot<DocumentData, DocumentData>;
  variants?: QuerySnapshot<DocumentData, DocumentData>;
  error?: string;
};

async function getData(productId: string) {
  const productRef: DocumentReference = doc(db, 'products', productId);
  const productData: DocumentData = await getDoc(productRef);

  if (productData.exists()) {
    const storeRef: DocumentReference = doc(
      db,
      'stores',
      productData.data().store_id
    );
    const storeData: DocumentData = await getDoc(storeRef);

    const optionsRef: CollectionReference = collection(
      db,
      'products',
      productId,
      'options'
    );
    const optionsQuery = query(
      optionsRef,
      where('index', '!=', null),
      orderBy('index')
    );
    const optionsData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(optionsQuery);

    const variantsRef: CollectionReference = collection(
      db,
      'products',
      productId,
      'variants'
    );
    const variantsQuery = query(
      variantsRef,
      where('index', '!=', null),
      orderBy('index')
    );
    const variantsData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(variantsQuery);

    return {
      store: storeData,
      product: productData,
      options: optionsData,
      variants: variantsData,
    };
  }
  return {
    error: 'No Product',
  };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { productId } = await params;
  const data: Data = await getData(productId);
  if (data.error === 'No Product') {
    return {
      title: 'No Store',
    };
  }
  const description =
    data.product?.data().description === ''
      ? `This is a ${data.product?.data().product_type} product.`
      : data.product?.data().description;
  const openGraphImages: string[] = [];

  if (data.product?.data().images.length > 0) {
    openGraphImages.push(data.product?.data().images[0]);
  }
  return {
    title: `${data.product?.data().name} - ${data.store?.data().name} - Product`,
    description: description,
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/product/${productId}`,
      title: `${data.product?.data().name} - ${data.store?.data().name}`,
      siteName: 'SubPort Creator Platform',
      description: description,
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      creator: data.store?.data().name,
      images: openGraphImages,
      title: `${data.product?.data().name} - ${data.store?.data().name}`,
      description: description,
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { productId } = await params;
  const data: Data = await getData(productId);
  const country = (await headers()).get('x-geo-country') as string;
  const city = (await headers()).get('x-geo-city') as string;
  const region = (await headers()).get('x-geo-region') as string;
  const ip = (await headers()).get('x-ip') as string;

  let options: options[] = [];
  let variants: variants[] = [];
  if (data.error === 'No Product') {
    return (
      <section>
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>No Such Product</h1>
        </section>
      </section>
    );
  }

  if (data.options !== undefined) {
    options = data.options?.docs.map((option) => {
      return {
        name: option.data().name,
        options: option.data().options,
      };
    });
  }
  if (data.variants !== undefined) {
    variants = data.variants?.docs.map((variant) => {
      return {
        compare_at: variant.data().compare_at as number,
        inventory: variant.data().inventory as number,
        name: variant.data().name as string,
        price: variant.data().price as number,
      };
    });
  }
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductDetailPage
        store_id={data.store?.id}
        avatar={data.store?.data().avatar_url}
        store_name={data.store?.data().name}
        subscription_count={data.store?.data().subscription_count}
        images={data.product?.data().images}
        product_name={data.product?.data().name}
        product_type={data.product?.data().product_type}
        price={data.product?.data().price}
        compare_at={data.product?.data().compare_at}
        currency={data.product?.data().currency}
        product_id={data.product?.id}
        product_description={data.product?.data().description}
        like_count={data.product?.data().like_count}
        tags={data.product?.data().tags}
        created_at_seconds={data.product?.data().created_at.seconds}
        created_at_nanoseconds={data.product?.data().created_at.nanoseconds}
        options={options}
        variants={variants}
        view_count={data.product?.data().view_count}
        track_inventory={data.product?.data().track_inventory}
        inventory={data.product?.data().inventory}
        country={country}
        city={city}
        region={region}
        ip={ip}
      />
      <TrackProductViews
        country={country}
        city={city}
        region={region}
        ip={ip}
        product_id={productId}
        product_name={data.product?.data().name}
        store_name={data.store?.data().name}
        store_id={data.store?.id}
      />
    </Suspense>
  );
}
