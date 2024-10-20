import { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `About`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/about/`,
      title: `About`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `About`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default function About() {
  return (
    <section>
      <section className="mx-auto w-full max-w-[2428px]">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/creator-base-6c959.appspot.com/o/marketing%2FAboutUs.jpg?alt=media&token=17f1a4a6-f17f-4b04-a3a3-1a85ecf0b406"
          alt="About SubPort"
          width={3000}
          height={1373}
        />
        <section className="flex w-full flex-col gap-16 px-4 py-16">
          <h1 className="text-4xl md:text-6xl">About SubPort</h1>
          <p className="text-3xl font-thin md:text-5xl">
            Our mission is to empower artist, entreprenuers, & creators to
            monetize their passions by providing a seamless and supportive
            platform for fan-powered commerce.
          </p>
          <p className="text-3xl font-thin md:text-5xl">
            We believe that anyone with a passion should have the opportunity to
            share their creations with the world and connect directly with their
            fans through a simple, accessible, and supportive platform.
          </p>
        </section>
      </section>
      {/* <Separator />
      <p>Fan-Powered Commerce</p>
      <p>
        To empower artist, entreprenuers, & creators to monetize their passions
        by providing a seamless and supportive platform for fan-powered
        commerce.
      </p>
      <p>
        We believe that anyone with a passion should have the opportunity to
        share their creations with the world and connect directly with their
        fans through a simple, accessible, and supportive platform.
      </p> */}
    </section>
  );
}
