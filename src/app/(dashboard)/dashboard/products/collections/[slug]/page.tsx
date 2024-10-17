import { db } from '@/lib/firebase';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Edit from './editCollection';

type Params = Promise<{ slug: string }>;

async function getData(slug: string, default_store: string) {
  const docRef: DocumentReference = doc(
    db,
    `stores/${default_store}/collections`,
    slug
  );
  const data: DocumentData = await getDoc(docRef);
  if (!data.exists()) {
    redirect(`/dashboard/products/collections`);
  }
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(slug, default_store?.value!);
  return {
    title: `${data.data().name} Collection`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products/collections/${slug}/`,
      title: `${data.data().name} Collection`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      title: `${data.data().name} Collection`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function EditCollection({ params }: { params: Params }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(slug, default_store?.value!);
  return (
    <Edit
      name={data.data().name}
      description={data.data().description}
      type={data.data().type}
      tags={data.data().tags}
      products={data.data().products}
      status={data.data().status}
      id={slug}
      store_id={default_store?.value!}
    />
  );
}
