import { ShowAvatar } from '@/components/sp-ui/ShowAvatar';
import { SubsciberButton } from '@/components/sp-ui/SubscribeButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { analytics, db } from '@/lib/firebase';
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
import { headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';
import { ProductFeed } from './productFeed';
import { ShowMoreText } from './showMoreText';
import StoreLoading from './storeLoading';
import TrackStoreViews from './trackStoreViews';

type Props = {
  params: { slug: string };
};
type Params = Promise<{ slug: string }>;
type Data = {
  store: DocumentData;
  collections: QuerySnapshot<DocumentData, DocumentData>;
};

async function getData(store: string) {
  analytics;
  const storeRef: DocumentReference = doc(db, 'stores', store);
  const storeData: DocumentData = await getDoc(storeRef);

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
    collections: collectionsData,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const data: Data | 'No Store' = await getData(slug);
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
      `https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image/${slug}?shop=${storeName}&image=${url}`
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
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/store/${slug}`,
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

export default async function Store({ params }: { params: Params }) {
  const { slug } = await params;
  const data: Data | 'No Store' = await getData(slug);
  const country = (await headers()).get('x-geo-country') as string;
  const city = (await headers()).get('x-geo-city') as string;
  const region = (await headers()).get('x-geo-region') as string;
  const ip = (await headers()).get('x-ip') as string;

  if (data === 'No Store') {
    return (
      <section>
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>No Such Store</h1>
        </section>
      </section>
    );
  }

  return (
    <Suspense fallback={<StoreLoading />}>
      <>
        <section className="mx-auto w-full max-w-[2428px]">
          {data.store.data().banner_url === '' ? (
            <></>
          ) : (
            <section
              className="flex aspect-[6/1] items-center justify-start overflow-hidden rounded"
              style={{
                background: `url(${data.store.data().banner_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></section>
          )}
          <section className="flex w-full flex-col items-start justify-between gap-4 px-4 py-4 md:flex-row md:items-center">
            <section className="flex items-center gap-4">
              <Link href={`/store/${slug}`} className="">
                <ShowAvatar store_id={data.store.id} size="lg" />
              </Link>
              <div className="flex flex-col gap-1">
                <h1 className="text-xl">{data.store.data().name}</h1>
                <section className="flex w-full flex-wrap gap-1 md:w-auto">
                  <p className="w-auto text-sm text-muted-foreground">
                    @{slug}
                  </p>
                  <span className="text-sm text-muted-foreground">&bull;</span>
                  <p className="w-auto text-sm text-muted-foreground">
                    {data.store.data().subscription_count} subscriber
                    {data.store.data().subscription_count > 1 ? 's' : ''}
                  </p>
                  <span className="text-sm text-muted-foreground">&bull;</span>
                  {/* <p className="block w-auto text-sm text-muted-foreground">
                    {data.products.docs.length} product
                    {data.products.docs.length > 1 ? 's' : ''}
                  </p> */}
                </section>
                <section className="hidden md:flex">
                  <ShowMoreText
                    text={data.store.data().description}
                    howManyToShow={50}
                    store_name={slug}
                    location={data.store.data().country}
                    created_at={data.store.data().created_at}
                    view_count={data.store.data().view_count}
                    // product_count={data.products.docs.length}
                    subscription_count={data.store.data().subscription_count}
                  />
                </section>
              </div>
            </section>
            <section className="flex md:hidden">
              <ShowMoreText
                text={data.store.data().description}
                howManyToShow={50}
                store_name={slug}
                location={data.store.data().country}
                created_at={data.store.data().created_at}
                view_count={data.store.data().view_count}
                // product_count={data.products.docs.length}
                subscription_count={data.store.data().subscription_count}
              />
            </section>
            <section className="flex w-full md:w-auto">
              <SubsciberButton
                store_id={slug}
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
                <Link href={`/store/${slug}`} aria-label={`${slug} Store`}>
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
                    href={`/store/${slug}/collection/${doc.id}`}
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
        <ProductFeed store_id={slug} />
        <TrackStoreViews
          country={country}
          city={city}
          region={region}
          ip={ip}
          store_id={slug}
          store_name={data.store.data().name}
        />
      </>
    </Suspense>
  );
}
