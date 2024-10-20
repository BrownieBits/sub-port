'use client';

// import RichText from '@/components/sb-ui/RichText';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const LatestBlog = (props: {}) => {
  const [blog, setBlog] = React.useState<any | null>(null);

  React.useEffect(() => {
    // const getLatest = async () => {
    //   const currentClient = client;
    //   const data = await currentClient.getEntries({
    //     content_type: 'blogPost',
    //     order: '-sys.createdAt',
    //     limit: 1,
    //   });
    //   setBlog(data.items[0]);
    // };
    // getLatest();
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
    <section className="flex w-full flex-col items-start justify-start gap-8 rounded border p-4">
      <h3>SubPort News</h3>
      {blog.fields.banner && (
        <Image
          alt={blog.fields.title}
          src={`https:${blog.fields.banner.fields.file.url}`}
          width={blog.fields.banner.fields.file.details.image.width}
          height={blog.fields.banner.fields.file.details.image.height}
          className="mb-[5px] flex w-full"
        />
      )}

      <section className="flex w-full flex-col gap-2">
        <p>
          <b>{blog.fields.title}</b>
        </p>
        <p className="text-sm text-muted-foreground">
          {/* <RichText content={blog.fields.body} summary /> */}
        </p>
      </section>
      <Button variant="outline" asChild>
        <Link href={`/blog/${blog.fields.slug}`}>Read More</Link>
      </Button>
    </section>
  );
};
