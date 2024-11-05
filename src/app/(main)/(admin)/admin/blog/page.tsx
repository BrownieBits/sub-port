import { DataTable } from '@/components/sp-ui/DataTable';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import BlogsLoading from './blogsLoading';
import { columns } from './dataColumns';
import { NoBlogs } from './noBlogs';

async function getData() {
  const blogsRef: CollectionReference = collection(db, 'blog');
  const q = query(
    blogsRef,
    where('status', '!=', 'archived'),
    orderBy('created_at', 'desc')
  );
  const blogsData: QuerySnapshot<DocumentData, DocumentData> = await getDocs(q);

  const data = blogsData.docs.map((item) => {
    return {
      id: item.id,
      banner_url: item.data().banner_url,
      body: item.data().body,
      created_at: new Date(item.data().created_at.seconds * 1000),
      updated_at: new Date(item.data().updated_at.seconds * 1000),
      name: item.data().name,
      status: item.data().status,
      filter: `${item.data().name}`,
    };
  });

  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Admin - Blogs`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/admin/blog`,
      title: `Admin - Blogs`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Admin - Blogs`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function BlogArticlePage() {
  const data = await getData();
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Blog Posts</h1>
          {/* <AddProductButton copy="Add Product" variant="outline" /> */}
          <Button size="sm" asChild>
            <Link href="/admin/blog/new" title="Create Post">
              Create Post
            </Link>
          </Button>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        <Suspense fallback={<BlogsLoading />}>
          {data.length! > 0 ? (
            <DataTable columns={columns} data={data!} />
          ) : (
            <NoBlogs />
          )}
        </Suspense>
      </section>
    </section>
  );
}
