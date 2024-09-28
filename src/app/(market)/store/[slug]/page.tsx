import ProductCard from '@/components/sp-ui/ProductCard';
import { ShowAvatar } from '@/components/sp-ui/ShowAvatar';
import { SubsciberButton } from '@/components/sp-ui/SubscribeButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { analytics, db } from '@/lib/firebase';
import { GridProduct } from '@/lib/types';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';
import { StorePasswordForm } from './password-protection';
import { ShowMoreText } from './showMoreText';
import StoreLoading from './storeLoading';
import TrackStoreViews from './trackStoreViews';

type Props = {
  params: { slug: string };
};
type Data = {
  store: DocumentData;
  products: QuerySnapshot<DocumentData, DocumentData>;
  collections: QuerySnapshot<DocumentData, DocumentData>;
};

async function getData(store: string) {
  analytics;
  const storeRef: DocumentReference = doc(db, 'stores', store);
  const storeData: DocumentData = await getDoc(storeRef);

  const productsRef: CollectionReference = collection(db, 'products');
  const q = query(
    productsRef,
    where('store_id', '==', store),
    where('status', '==', 'Public')
  );
  const productData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  const collectionsRef: CollectionReference = collection(
    db,
    `stores/${store}/collections`
  );
  const colQuery = query(collectionsRef, where('status', '==', 'Public'));
  const collectionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(colQuery);

  if (!storeData.exists()) {
    return 'No Store';
  }
  return {
    store: storeData,
    products: productData,
    collections: collectionsData,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: Data | 'No Store' = await getData(params.slug);
  if (data === 'No Store') {
    return {
      title: 'No Store',
    };
  }
  const description =
    data.store.data().description === ''
      ? 'This is a store'
      : data.store.data().description;
  const openGraphImages: string[] = [];

  if (data.store.data().avatar_url !== '') {
    const url = encodeURIComponent(data.store.data().avatar_url);
    const storeName = encodeURIComponent(data.store.data().name);
    openGraphImages.push(
      `https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image/${params.slug}?shop=${storeName}&image=${url}`
    );
  } else {
    openGraphImages.push(
      `https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`
    );
  }
  return {
    title: `${data.store.data().name} Store`,
    description: description,
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/store/${params.slug}`,
      title: `${data.store.data().name} Store`,
      siteName: 'SubPort Creator Platform',
      description: description,
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      creator: data.store.data().name,
      images: openGraphImages,
      title: `${data.store.data().name} Store`,
      description: description,
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Store({ params }: Props) {
  const cookieStore = cookies();
  const store_pw = cookieStore.get(`${params.slug}-pw`);
  const data: Data | 'No Store' = await getData(params.slug);
  const country = headers().get('x-geo-country') as string;
  const city = headers().get('x-geo-city') as string;
  const region = headers().get('x-geo-region') as string;
  const ip = headers().get('x-ip') as string;

  async function revalidate() {
    'use server';
    revalidatePath(`/store/${params.slug}`);
  }

  if (data === 'No Store') {
    return (
      <section>
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>No Such Store</h1>
        </section>
      </section>
    );
  }
  if (
    data.store.data().password_protected &&
    data.store.data().password !== null &&
    data.store.data().password !== store_pw?.value!
  ) {
    return (
      <section>
        <section className="align-center flex h-[calc(100vh-56px)] w-full flex-col items-center justify-center gap-4 px-4 py-8">
          <section className="flex flex-col rounded border bg-layer-one p-8">
            <p className="pb-4">
              <b>{data.store.data().name} is password protected</b>
            </p>
            <StorePasswordForm
              revalidate={revalidate}
              pw={data.store.data().password}
              cookieSlug={`${params.slug}-pw`}
            />
          </section>
        </section>
      </section>
    );
  }
  const products: GridProduct[] = data.products.docs.map((product) => {
    return {
      name: product.data().name,
      images: product.data().images,
      product_type: product.data().product_type,
      price: product.data().price,
      compare_at: product.data().compare_at,
      currency: product.data().currency,
      like_count: product.data().like_count,
      store_id: product.data().store_id,
      created_at: product.data().created_at,
      id: product.id,
    };
  });
  return (
    <Suspense fallback={<StoreLoading />}>
      <>
        <section className="mx-auto w-full max-w-[2428px]">
          {data.store.data().banner_url === '' ? (
            <></>
          ) : (
            <section
              className="flex aspect-[6/1] items-center justify-start overflow-hidden rounded md:aspect-[128/15]"
              style={{
                background: `url(${data.store.data().banner_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></section>
          )}
          <section className="flex w-full flex-col items-start justify-between gap-4 px-4 py-4 md:flex-row md:items-center">
            <section className="flex items-center gap-4">
              <Link href={`/store/${params.slug}`} className="">
                <ShowAvatar store_id={data.store.id} size="lg" />
              </Link>
              <div className="flex flex-col gap-1">
                <h1 className="text-xl">{data.store.data().name}</h1>
                <section className="flex w-full flex-wrap gap-1 md:w-auto">
                  <p className="w-auto text-sm text-muted-foreground">
                    @{params.slug}
                  </p>
                  <span className="text-sm text-muted-foreground">&bull;</span>
                  <p className="w-auto text-sm text-muted-foreground">
                    {data.store.data().subscription_count} subscriber
                    {data.store.data().subscription_count > 1 ? 's' : ''}
                  </p>
                  <span className="text-sm text-muted-foreground">&bull;</span>
                  <p className="block w-auto text-sm text-muted-foreground">
                    {data.products.docs.length} product
                    {data.products.docs.length > 1 ? 's' : ''}
                  </p>
                </section>
                <section className="hidden md:flex">
                  <ShowMoreText
                    text={data.store.data().description}
                    howManyToShow={50}
                    store_name={params.slug}
                    location={data.store.data().country}
                    created_at={data.store.data().created_at}
                    view_count={data.store.data().view_count}
                    product_count={data.products.docs.length}
                    subscription_count={data.store.data().subscription_count}
                  />
                </section>
              </div>
            </section>
            <section className="flex md:hidden">
              <ShowMoreText
                text={data.store.data().description}
                howManyToShow={50}
                store_name={params.slug}
                location={data.store.data().country}
                created_at={data.store.data().created_at}
                view_count={data.store.data().view_count}
                product_count={data.products.docs.length}
                subscription_count={data.store.data().subscription_count}
              />
            </section>
            <section className="flex w-full md:w-auto">
              <SubsciberButton
                store_id={params.slug}
                full_width={true}
                country={country}
                city={city}
                region={region}
                ip={ip}
              />
            </section>
          </section>

          {data.collections.docs.length === 0 ? (
            <></>
          ) : (
            <section className="flex w-full justify-start gap-8 border-transparent px-4">
              <Button
                asChild
                variant="link"
                className="text-md rounded-none border-b-[2px] px-0 text-foreground hover:no-underline"
              >
                <Link
                  href={`/store/${params.slug}`}
                  aria-label={`${params.slug} Store`}
                >
                  Home
                </Link>
              </Button>
              {data.collections?.docs?.map((doc) => (
                <Button
                  asChild
                  variant="link"
                  className="text-md rounded-none border-b-[2px] border-transparent px-0 text-foreground hover:no-underline"
                  key={doc.id}
                >
                  <Link
                    href={`/store/${params.slug}/collection/${doc.id}`}
                    aria-label="Products"
                  >
                    {doc.data().name}
                  </Link>
                </Button>
              ))}
            </section>
          )}
        </section>
        <Separator />
        <section className="mx-auto w-full max-w-[2428px]">
          {products?.length! > 0 ? (
            <section className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6">
              {products?.map((doc) => (
                <ProductCard
                  product={doc}
                  show_creator={false}
                  key={doc.id}
                  avatar={data.store.data().avatar_url}
                />
              ))}
            </section>
          ) : (
            <p>This store has no products at this time.</p>
          )}
        </section>
        <TrackStoreViews
          country={country}
          city={city}
          region={region}
          ip={ip}
          store_id={params.slug}
          store_name={data.store.data().name}
        />
      </>
    </Suspense>
  );
}
