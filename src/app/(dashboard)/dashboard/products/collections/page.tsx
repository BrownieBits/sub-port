import { DataTable } from '@/components/sp-ui/DataTable';
import { Button } from '@/components/ui/button';
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
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { columns } from './dataColums';
import NewCollectionButton from './newCollectionButton';
import { NoCollections } from './noCollections';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`/sign-in?redirect=/dashboard/products`);
  }
  const collectionsRef: CollectionReference = collection(
    db,
    `stores/${slug.value}/collections`
  );
  const q = query(collectionsRef);
  const collectionsData: QuerySnapshot<DocumentData, DocumentData> =
    await getDocs(q);

  const data = collectionsData.docs.map((item) => {
    return {
      id: item.id,
      products: item.data().products,
      status: item.data().status,
      name: item.data().name,
      type: item.data().type,
      owner_id: item.data().owner_id,
      tags: item.data().tags,
      store_id: item.data().store_id,
    };
  });

  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Collections`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/collections/`,
      title: `Collections`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      title: `Collections`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Collections() {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data = await getData(default_store);
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Collections</h1>
          <NewCollectionButton />
        </section>
        <section className="flex w-full justify-start gap-8 px-4">
          <Button
            asChild
            variant="link"
            className="text-md rounded-none border-b-[2px] border-transparent px-0 text-foreground hover:no-underline"
          >
            <Link href={`/dashboard/products`} aria-label="Products">
              Products
            </Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="text-md rounded-none border-b-[2px] px-0 text-foreground hover:no-underline"
          >
            <Link
              href={`/dashboard/products/collections`}
              aria-label="Collections"
            >
              Collections
            </Link>
          </Button>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        {data.length! > 0 ? (
          <DataTable columns={columns} data={data!} />
        ) : (
          <NoCollections />
        )}
      </section>
    </section>
  );
}
