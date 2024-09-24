import { Logo } from '@/components/sp-ui/Logo';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { SignInForm } from './signInForm';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Sign In`,
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/sign-in/`,
      title: `Sign In`,
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      title: `Sign In`,
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      site: 'SubPort Creator Platform',
    },
  };
}

export default function SignIn({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const country = headers().get('x-geo-country') as string;
  const city = headers().get('x-geo-city') as string;
  const region = headers().get('x-geo-region') as string;
  const ip = headers().get('x-ip') as string;
  let redirectLink = '';
  if (searchParams && Object.keys(searchParams).length > 0) {
    redirectLink = '?';
    Object.keys(searchParams).map((key, index) => {
      redirectLink += `${key}=${searchParams?.redirect as string}`;
      if (index !== Object.keys(searchParams).length - 1) {
        redirectLink += `&`;
      }
    });
  }

  return (
    <section className="flex w-full flex-col justify-between">
      <section className="flex w-full items-center justify-between">
        <section className="w-[45px] md:w-[150px]">
          <Logo url="/" />
        </section>
        <section className="">
          <section className="">
            Need an account?{' '}
            <Link href={`/sign-up${redirectLink}`} className="font-bold">
              Sign Up
            </Link>
          </section>
        </section>
      </section>
      <section className="flex w-full flex-col items-center justify-center">
        <h1 className="mb-4">Sign In</h1>
        <SignInForm country={country} city={city} region={region} ip={ip} />
      </section>
      <section className="h-[53px] w-full md:h-[61px]"></section>
    </section>
  );
}
