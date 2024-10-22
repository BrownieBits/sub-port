import { MarketHeader } from '@/components/sp-ui/Menus/marketHeader';

export default function MarketLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      <section className="sticky top-0 z-50 w-full">
        <MarketHeader />
      </section>
      <section className="min-h-screen w-full">
        <main className="min-h-screen overflow-x-hidden">{children}</main>
      </section>
    </section>
  );
}
