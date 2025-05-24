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
import Link from 'next/link';
import React from 'react';

type Post = {
  id: string;
  name: string;
  summary: string;
  banner_url: string;
};

export const LatestFeatures = (props: {}) => {
  const [posts, setPosts] = React.useState<Post[] | null>(null);

  React.useEffect(() => {
    const getLatest = async () => {
      const blogsRef: CollectionReference = collection(db, 'features');
      const q = query(
        blogsRef,
        where('status', '==', 'Public'),
        orderBy('created_at', 'desc'),
        limit(5)
      );
      const featuresData: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(q);
      if (!featuresData.empty) {
        const newPosts: Post[] = [];
        featuresData.docs.forEach((doc) => {
          newPosts.push({
            id: doc.id,
            name: doc.data().name,
            summary: doc.data().summary,
            banner_url: doc.data().banner_url,
          });
        });
        setPosts(newPosts);
      } else {
        setPosts([]);
      }
    };
    getLatest();
  }, []);

  if (posts === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>New Features</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
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
        <CardTitle>New Features</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <section className="flex w-full flex-col gap-2">
            <p>No new features available.</p>
          </section>
        ) : (
          <section className="flex w-full flex-col gap-2">
            {posts.map((post) => (
              <Link href={`/features/${post.id}`} key={post.id}>
                {post.name}
              </Link>
            ))}
          </section>
        )}
      </CardContent>
      <Separator />
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href={`/whats-new`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
