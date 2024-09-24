import { DashboardHeader } from '@/components/sp-ui/Menus/dashboardHeader';
import { DashboardNav } from '@/components/sp-ui/Menus/dashboardNav';

export default function UserLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative w-full overflow-hidden">
      <section className="w-full">
        <DashboardHeader />
      </section>
      <section className="grid w-full grid-cols-[0_auto] xl:grid-cols-[250px_auto]">
        <nav
          className={`bg-layer-one flex h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] border-r-[1px] border-r-border`}
        >
          <DashboardNav inSheet={false} />
        </nav>
        <main className="relative h-[calc(100vh-56px)] overflow-x-hidden pb-12">
          {children}
        </main>
      </section>
    </section>
  );
}
