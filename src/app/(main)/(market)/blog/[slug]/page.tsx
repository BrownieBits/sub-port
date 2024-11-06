// import RichText from '@/components/sb-ui/RichText';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import { Metadata } from 'next';
import Image from 'next/image';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';

type Params = Promise<{ slug: string }>;
type Data = {
  error?: string;
  name: string;
  banner: string;
  body: string;
  summary: string;
  created_at: Date;
  tags: string[];
};

async function getData(slug: string) {
  const articleRef: DocumentReference = doc(db, 'blog', slug);
  const articleData: DocumentData = await getDoc(articleRef);

  if (articleData.exists() && articleData.data().status === 'Public') {
    const text = articleData.data().body;
    const processedContent = await remark()
      // .use(remarkRehype)
      .use(remarkGfm)
      .use(html)
      .process(text);
    const contentHtml = processedContent.toString();

    return {
      name: articleData.data().name,
      banner: articleData.data().banner_url,
      body: contentHtml,
      summary: articleData.data().summary,
      created_at: new Date(articleData.data().created_at.seconds * 1000),
      tags: articleData.data().tags,
    };
  } else if (articleData.exists() && articleData.data().status === 'Private') {
    return {
      error: 'This article is no longer available',
      name: '',
      banner: '',
      body: '',
      tags: [],
      summary: '',
      created_at: new Date(),
    };
  }
  return {
    name: '',
    banner: '',
    body: '',
    tags: [],
    summary: '',
    created_at: new Date(),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const data: Data = await getData(slug);

  const openGraphImages: string[] = [];
  if (data.banner !== undefined && data.banner !== '') {
    openGraphImages.push(`https:${data.banner}`);
  }
  return {
    title: `${data.name} - Blog`,
    description: data.summary, // TODO FIX THIS TO DISPLAY Caption of article
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/store/${slug}`,
      title: `${data.name} - Blog`,
      siteName: 'SubPort Creator Platform',
      description: data.summary, // TODO FIX THIS TO DISPLAY Caption of article
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      creator: data.name,
      images: openGraphImages,
      title: `${data.name} - Blog`,
      description: data.summary, // TODO FIX THIS TO DISPLAY Caption of article
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function BlogPost({ params }: { params: Params }) {
  const { slug } = await params;
  const data: Data = await getData(slug);

  return (
    <section>
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full flex-col items-start gap-4 p-4">
          {data.banner !== '' ? (
            <section className="w-full overflow-hidden rounded">
              <Image
                src={data.banner}
                width={1754}
                height={986}
                alt={`${data.name} blog post banner`}
                priority
              />
            </section>
          ) : (
            <></>
          )}
          <h1>{data.name}</h1>
          <section className="flex gap-4">
            <p className="text-sm text-muted-foreground">
              {format(data.created_at, 'LLL dd, yyyy')}
            </p>
            {data.tags !== undefined && data.tags.length > 0 && (
              <>
                {data.tags.map((tag) => {
                  return (
                    <Badge variant="secondary" key={`post-tag-${tag}`}>
                      {tag}
                    </Badge>
                  );
                })}
              </>
            )}
          </section>
          <div dangerouslySetInnerHTML={{ __html: data.body }} />
        </section>
      </section>
    </section>
  );
}
