'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { NoBlogs } from './noBlogs';

type Post = {
  id: string;
  name: string;
  summary: string;
  created_at: Date;
  banner_url: string;
  tags: string[];
};
export default function BlogListPage() {
  const [posts, setPosts] = React.useState<Post[] | null>(null);
  const [lastBlog, setLastBlog] = React.useState<DocumentData | undefined>(
    undefined
  );
  const { ref, inView } = useInView();

  async function GetPosts() {
    const postsRef: CollectionReference = collection(db, 'blog');
    let postsQuery = query(
      postsRef,
      where('status', '==', 'Public'),
      orderBy('created_at', 'desc')
    );
    if (lastBlog !== undefined) {
      postsQuery = query(postsQuery, startAfter(lastBlog));
    }
    postsQuery = query(postsQuery, limit(30));
    const poststData: QuerySnapshot<DocumentData, DocumentData> =
      await getDocs(postsQuery);

    if (poststData.size === 30) {
      setLastBlog(poststData.docs[poststData.size - 1]);
    } else {
      setLastBlog(undefined);
    }

    const newPosts: Post[] = [];
    if (poststData.empty) {
      if (posts === undefined) {
        setPosts([]);
      }
    } else {
      poststData.docs.map((post) => {
        newPosts.push({
          name: post.data().name,
          banner_url: post.data().banner_url,
          summary: post.data().summary,
          created_at: new Date(post.data().created_at.seconds * 1000),
          id: post.id as string,
          tags: post.data().tags,
        });
      });
      if (posts === null) {
        setPosts([...newPosts]);
      } else {
        setPosts([...posts, ...newPosts]);
      }
    }
  }
  React.useEffect(() => {
    GetPosts();
  }, []);
  React.useEffect(() => {
    if (inView) {
      //   GetPosts();
    }
  }, [inView]);
  if (posts === null) {
    return (
      <>
        <section className="mx-auto w-full max-w-[1754px] p-4">
          <section className="flex flex-col gap-8">
            <section className="flex w-full flex-col items-start gap-4">
              <Skeleton className="h-[32px] w-[250px]" />
              <Skeleton className="h-[20px] w-[100px]" />
              <Skeleton className="aspect-video w-full" />
              <section className="flex w-full flex-col gap-2">
                <Skeleton className="h-[24px] w-full" />
                <Skeleton className="h-[24px] w-full" />
                <Skeleton className="h-[24px] w-6/12" />
              </section>
              <Skeleton className="h-[40px] w-[100px] rounded-full" />
            </section>
            <Separator />
            <section className="flex w-full flex-col justify-start gap-4 md:flex-row">
              <Skeleton className="aspect-video w-[300px]" />
              <section className="flex w-full flex-col gap-4">
                <section className="flex gap-4">
                  <Skeleton className="h-[20px] w-[100px]" />
                  <Skeleton className="h-[20px] w-[100px]" />
                </section>
                <Skeleton className="h-[28px] w-[250px]" />
                <Skeleton className="h-[20px] w-[100px]" />
                <section className="flex w-full flex-col gap-2">
                  <Skeleton className="h-[24px] w-full" />
                  <Skeleton className="h-[24px] w-6/12" />
                </section>
                <Skeleton className="h-[40px] w-[100px] rounded-full" />
              </section>
            </section>
            <Separator />
            <section className="flex w-full flex-col justify-start gap-4 md:flex-row">
              <Skeleton className="aspect-video w-[300px]" />
              <section className="flex w-full flex-col gap-4">
                <section className="flex gap-4">
                  <Skeleton className="h-[20px] w-[100px]" />
                  <Skeleton className="h-[20px] w-[100px]" />
                </section>
                <Skeleton className="h-[28px] w-[250px]" />
                <Skeleton className="h-[20px] w-[100px]" />
                <section className="flex w-full flex-col gap-2">
                  <Skeleton className="h-[24px] w-full" />
                  <Skeleton className="h-[24px] w-6/12" />
                </section>
                <Skeleton className="h-[40px] w-[100px] rounded-full" />
              </section>
            </section>
            <Separator />
            <section className="flex w-full flex-col justify-start gap-4 md:flex-row">
              <Skeleton className="aspect-video w-[300px]" />
              <section className="flex w-full flex-col gap-4">
                <section className="flex gap-4">
                  <Skeleton className="h-[20px] w-[100px]" />
                  <Skeleton className="h-[20px] w-[100px]" />
                </section>
                <Skeleton className="h-[28px] w-[250px]" />
                <Skeleton className="h-[20px] w-[100px]" />
                <section className="flex w-full flex-col gap-2">
                  <Skeleton className="h-[24px] w-full" />
                  <Skeleton className="h-[24px] w-6/12" />
                </section>
                <Skeleton className="h-[40px] w-[100px] rounded-full" />
              </section>
            </section>
          </section>
        </section>
      </>
    );
  }
  if (posts.length === 0) {
    return <NoBlogs />;
  }
  return (
    <>
      <section className="mx-auto w-full max-w-[1754px] p-4">
        <section className="flex flex-col gap-8">
          <section className="flex w-full flex-col items-start gap-4">
            <h1>{posts[0].name}</h1>
            <p className="text-muted-foreground text-sm">
              {format(posts[0].created_at, 'LLL dd, yyyy')}
            </p>
            {posts[0].banner_url !== '' && (
              <section className="w-full overflow-hidden rounded">
                <Image
                  src={posts[0].banner_url}
                  width={1754}
                  height={986}
                  alt={`${posts[0].name} blog post banner`}
                />
              </section>
            )}
            <p className="line-clamp-3">{posts[0].summary}</p>
            <Button size="sm" asChild>
              <Link href={`/blog/${posts[0].id}`}>Read More</Link>
            </Button>
          </section>
          {posts.map((post, index) => {
            if (index !== 0) {
              return (
                <section
                  className="flex w-full flex-col gap-8"
                  key={`blog-post-${post.id}`}
                >
                  <Separator />
                  <section className="flex w-full flex-col items-start justify-center gap-4 md:flex-row">
                    {post.banner_url !== '' ? (
                      <section className="w-full overflow-hidden rounded md:w-[300px]">
                        <Image
                          src={post.banner_url}
                          width={1754}
                          height={986}
                          alt={`${post.name} blog post banner`}
                        />
                      </section>
                    ) : (
                      <section className="aspect-video w-full overflow-hidden rounded md:w-[300px]">
                        <Image
                          src="/images/SubPort.jpg"
                          width={1754}
                          height={986}
                          alt={`${post.name} blog post banner`}
                        />
                      </section>
                    )}
                    <section className="flex w-full flex-col items-start gap-2">
                      {post.tags !== undefined && post.tags.length > 0 && (
                        <section className="flex gap-4">
                          {post.tags.map((tag) => {
                            return (
                              <Badge
                                variant="secondary"
                                key={`post-tag-${post.id}-${tag}`}
                              >
                                {tag}
                              </Badge>
                            );
                          })}
                        </section>
                      )}

                      <p className="text-xl font-bold">{post.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {format(posts[0].created_at, 'LLL dd, yyyy')}
                      </p>
                      <p className="line-clamp-2">{post.summary}</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${post.id}`}>Read More</Link>
                      </Button>
                    </section>
                  </section>
                </section>
              );
            }
          })}
        </section>
      </section>
      {lastBlog !== undefined && (
        <>
          <Separator ref={ref} />
          <section className="flex w-full flex-col justify-start gap-4 md:flex-row">
            <Skeleton className="aspect-video w-[300px]" />
            <section className="flex w-full flex-col gap-4">
              <section className="flex gap-4">
                <Skeleton className="h-[20px] w-[100px]" />
                <Skeleton className="h-[20px] w-[100px]" />
              </section>
              <Skeleton className="h-[28px] w-[250px]" />
              <Skeleton className="h-[20px] w-[100px]" />
              <section className="flex w-full flex-col gap-2">
                <Skeleton className="h-[24px] w-full" />
                <Skeleton className="h-[24px] w-6/12" />
              </section>
              <Skeleton className="h-[40px] w-[100px] rounded-full" />
            </section>
          </section>
        </>
      )}
    </>
  );
}
