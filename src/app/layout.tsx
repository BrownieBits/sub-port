import AuthState from '@/components/sp-ui/AuthState';
import CartState from '@/components/sp-ui/CartState';
import CookieConsent from '@/components/sp-ui/CookieConsent';
import { ThemeProvider } from '@/components/sp-ui/ThemeProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { analytics } from '@/lib/firebase';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
config.autoAddCss = false;

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: '%s - SubPort Creator Platform',
      default: `SubPort Creator Platform`, // a default is required when creating a template
    },
    description:
      'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
    openGraph: {
      type: 'website',
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/`,
      title: {
        template: '%s - SubPort Creator Platform',
        default: `SubPort Creator Platform`, // a default is required when creating a template
      },
      siteName: 'SubPort Creator Platform',
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
    },
    twitter: {
      card: 'summary_large_image',
      creator: 'SubPort',
      images: [`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/og_image`],
      title: {
        template: '%s - SubPort Creator Platform',
        default: `SubPort Creator Platform`, // a default is required when creating a template
      },
      description:
        'Enjoy the products you love, and share it all with friends, family, and the world on SubPort.',
      site: 'SubPort Creator Platform',
    },
    keywords: 'e-commerce, shopping, creators, social, products',
    referrer: 'origin',
    publisher: 'SubPort',
    creator: 'SubPort',
    robots: 'index, follow',
    icons: ['/favicon.svg'],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  analytics;
  return (
    <html suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <CookieConsent />
            <Toaster />
            <AuthState />
            <CartState />
            <Script
              src="https://kit.fontawesome.com/fd72af6caf.js"
              crossOrigin="anonymous"
            ></Script>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
