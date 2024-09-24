import { db } from '@/lib/firebase';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditForm from './editForm';

async function getData(slug: { [key: string]: string } | undefined) {
  if (slug === undefined) {
    redirect(`sign-in`);
  }
  const docRef: DocumentReference = doc(db, 'stores', slug?.value);
  const data: DocumentData = await getDoc(docRef);
  if (!data.exists()) {
    redirect(`/dashboard`);
  }
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(default_store);
  return {
    title: `${data.data().name} - Preferences`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/preferences/`,
      title: `${data.data().name} - Preferences`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `${data.data().name} - Preferences`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Preferences() {
  const cookieStore = cookies();
  const user_id = cookieStore.get('user_id');
  const default_store = cookieStore.get('default_store');
  const data: DocumentData = await getData(default_store);

  return (
    <EditForm
      data={data.data()}
      storeID={default_store?.value!}
      userID={user_id!.value}
    />
  );
}
