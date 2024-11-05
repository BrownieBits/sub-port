'use client';

import { Button } from '@/components/ui/button';
// import RichText from '@/components/sb-ui/RichText';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Post = {
  id: string;
  name: string;
  summary: string;
  banner_url: string;
};

export const LatestBlog = (props: {}) => {
  const [blog, setBlog] = React.useState<Post | null>(null);

  React.useEffect(() => {
    const getLatest = async () => {
      const blogsRef: CollectionReference = collection(db, 'blog');
      const q = query(
        blogsRef,
        where('status', '==', 'Public'),
        orderBy('created_at', 'desc'),
        limit(1)
      );
      const blogsData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(q);
      if (!blogsData.empty) {
        setBlog({
          id: blogsData.docs[0].id,
          name: blogsData.docs[0].data().name,
          summary: blogsData.docs[0].data().summary,
          banner_url: blogsData.docs[0].data().banner_url,
        });
      }
    };
    getLatest();
  }, []);

  if (blog === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SubPort News</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="aspect-video w-full rounded" />
          <Skeleton className="h-5 w-[150px]" />
          <section className="flex w-full flex-col gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[50px]" />
          </section>
        </CardContent>
        <Separator />
        <CardFooter>
          <section className="flex w-full gap-4">
            <Skeleton className="h-[40px] w-[100px]" />
          </section>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SubPort News</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        {blog.banner_url && (
          <section className="mb-[5px] flex w-full overflow-hidden rounded">
            <Image
              alt={blog.name}
              src={blog.banner_url}
              width={300}
              height={200}
            />
          </section>
        )}
        <p>
          <b>{blog.name}</b>
        </p>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {blog.summary}
        </p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href={`/blog/${blog.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
