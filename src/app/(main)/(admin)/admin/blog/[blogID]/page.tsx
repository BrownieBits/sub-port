import { db } from '@/lib/firebase';
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogLoading from './blogLoading';
import EditPostForm from './editPostForm';

type Params = Promise<{ blogID: string }>;
type Data = {
  id?: string;
  name?: string;
  body?: string;
  summary?: string;
  banner_url?: string;
  tags?: string[];
  status?: string;
  error?: string;
};

async function getData(blogID: string) {
  const blogRef: DocumentReference = doc(db, 'blog', blogID);
  const blogData: DocumentData = await getDoc(blogRef);

  if (blogData.exists()) {
    return {
      id: blogData.id,
      name: blogData.data().name,
      body: blogData.data().body,
      summary: blogData.data().summary,
      banner_url: blogData.data().banner_url,
      tags: blogData.data().tags,
      status: blogData.data().status,
    };
  }
  return {
    error: 'No Blog',
  };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { blogID } = await params;
  const data: Data = await getData(blogID);
  if (data.error === 'No Blog') {
    return {
      title: 'No Blog Post',
    };
  }

  return {
    title: data.name!,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/admin/blog/${blogID}`,
      title: data.name!,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      title: data.name!,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Params }) {
  const { blogID } = await params;
  const data: Data = await getData(blogID);

  if (data.error === 'No Blog') {
    return (
      <section>
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>No Such Blog Post</h1>
        </section>
      </section>
    );
  }

  return (
    <Suspense fallback={<BlogLoading />}>
      <EditPostForm
        id={data.id!}
        name={data.name! || ''}
        body={data.body! || ''}
        summary={data.summary! || ''}
        banner_url={data.banner_url! || ''}
        tags={data.tags! || []}
        status={data.status! || 'Private'}
      />
    </Suspense>
  );
}
