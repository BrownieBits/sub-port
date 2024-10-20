// import RichText from '@/components/sb-ui/RichText';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  Timestamp,
} from 'firebase/firestore';

import { Metadata } from 'next';
import { remark } from 'remark';
import html from 'remark-html';

type Params = Promise<{ slug: string }>;
type Data = {
  error?: string;
  title: string;
  banner: any;
  body: any;
  created_at: any;
};

async function getData(slug: string) {
  const articleRef: DocumentReference = doc(db, 'blog', slug);
  const articleData: DocumentData = await getDoc(articleRef);

  if (articleData.exists() && articleData.data().status === 'Public') {
    const processedContent = await remark()
      .use(html)
      .process(articleData.data().body);
    const contentHtml = processedContent.toString();

    return {
      title: articleData.data().name,
      banner: articleData.data().banner_url,
      body: contentHtml,
      created_at: Timestamp.fromDate(new Date()),
    };
  } else if (articleData.exists() && articleData.data().status === 'Private') {
    return {
      error: 'This article is no longer available',
      title: '',
      banner: '',
      body: '',
      created_at: Timestamp.fromDate(new Date()),
    };
  }
  // const currentClient = client;

  // fetch data
  // const data = await currentClient.getEntries({
  //   content_type: 'blogPost',
  //   'fields.slug': slug,
  // });
  // if (data.total === 0) {
  //   redirect('/blog');
  // }
  // return {
  //   title: data.items[0].fields.title,
  //   banner: data.items[0].fields.banner,
  //   body: data.items[0].fields.body,
  //   created_at: data.items[0].sys.createdAt,
  // };
  return {
    title: '',
    banner: '',
    body: '',
    created_at: Timestamp.fromDate(new Date()),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const data: Data = await getData(slug);
  // const strings = data.body.content.map((item: any) => {
  //   if (item.nodeType === 'embedded-asset-block') {
  //     return;
  //   }
  //   return item.content[0].value;
  // });
  const openGraphImages: string[] = [];
  // if (data.banner !== undefined) {
  //   openGraphImages.push(`https:${data.banner.fields.file.url}`);
  // }
  return {
    title: `${data.title} - Blog`,
    description: "strings.join(' ')", // TODO FIX THIS TO DISPLAY Caption of article
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/store/${slug}`,
      title: `${data.title} - Blog`,
      siteName: 'SubPort Creator Platform',
      description: "strings.join(' ')", // TODO FIX THIS TO DISPLAY Caption of article
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      creator: data.title,
      images: openGraphImages,
      title: `${data.title} - Blog`,
      description: "strings.join(' ')", // TODO FIX THIS TO DISPLAY Caption of article
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function BlogPost({ params }: { params: Params }) {
  const { slug } = await params;
  const data: Data = await getData(slug);

  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 pt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>{data.title}</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex flex-col gap-2 px-4 py-8">
          {/* <RichText content={data.body} /> */}
          <div dangerouslySetInnerHTML={{ __html: data.body }} />
        </section>
      </section>
    </section>
  );
}
