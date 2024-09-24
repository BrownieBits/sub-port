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
import { Timestamp } from 'firebase/firestore';
// import { client } from '@/lib/contentful';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};
type Data = {
  title: string;
  banner: any;
  body: any;
  created_at: any;
};

async function getData(slug: string) {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: Data = await getData(params.slug);
  const strings = data.body.content.map((item: any) => {
    if (item.nodeType === 'embedded-asset-block') {
      return;
    }
    return item.content[0].value;
  });
  const openGraphImages: string[] = [];
  if (data.banner !== undefined) {
    openGraphImages.push(`https:${data.banner.fields.file.url}`);
  }
  return {
    title: `${data.title} - Blog`,
    description: strings.join(' '),
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/store/${params.slug}`,
      title: `${data.title} - Blog`,
      siteName: 'SubPort Creator Platform',
      description: strings.join(' '),
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      creator: data.title,
      images: openGraphImages,
      title: `${data.title} - Blog`,
      description: strings.join(' '),
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const data: Data = await getData(params.slug);

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
        </section>
      </section>
    </section>
  );
}
