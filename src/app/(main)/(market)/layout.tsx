import { MarketHeader } from '@/components/sp-ui/Menus/marketHeader';

export default function MarketLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <section className="sticky top-0 z-50 w-full">
        <MarketHeader />
      </section>
      <section className="w-full">
        <main className="overflow-x-hidden">{children}</main>
      </section>
    </section>
  );
}
