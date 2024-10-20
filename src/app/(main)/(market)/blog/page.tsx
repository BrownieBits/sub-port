import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';
import Image from 'next/image';
type Data = {
  title: string;
  banner: any;
  body: any;
  created_at: any;
};

async function getData() {
  // const currentClient = client;

  // fetch data
  // const data = await currentClient.getEntries({
  //   content_type: 'blogPost',
  //   order: '-sys.createdAt',
  // });
  // const blogs = data.items.map((item: any) => {
  //   return {
  //     title: item.fields.title,
  //     banner: item.fields.banner,
  //     body: item.fields.body,
  //     created_at: item.sys.createdAt,
  //   };
  // });
  return [];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Blog`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/blog/`,
      title: `Blog`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Blog`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default async function Blog() {
  const data: Data[] = await getData();

  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>Blog</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        {data.length! > 0 ? (
          <section className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6">
            {data.map((blog) => {
              const date = new Date(blog.created_at);
              return (
                <section
                  className="w-full overflow-hidden rounded border"
                  key={blog.title}
                >
                  <section className="flex aspect-square w-full items-center justify-center">
                    {blog.banner && (
                      <Image
                        alt={blog.title}
                        src={`https:${blog.banner.fields.file.url}`}
                        width={blog.banner.fields.file.details.image.width}
                        height={blog.banner.fields.file.details.image.height}
                        className="mb-[5px] flex w-full"
                      />
                    )}
                  </section>
                  <p className="w-full px-4 pb-2 pt-4">
                    <b>{blog.title}</b>
                  </p>
                  <p className="w-full px-4 pb-4 text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(date)}
                  </p>
                </section>
              );
            })}
          </section>
        ) : (
          <section className="p-4">
            <p>We haven&apos;t gotten around to posting blogs yet...</p>
          </section>
        )}
      </section>
    </section>
  );
}
