import { AdminHeader } from '@/components/sp-ui/Menus/adminHeader';
import { AdminNav } from '@/components/sp-ui/Menus/adminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative w-full overflow-hidden">
      <section className="w-full">
        <AdminHeader />
      </section>
      <section className="grid w-full grid-cols-[0_auto] xl:grid-cols-[250px_auto]">
        <nav
          className={`bg-red flex h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] border-r-[1px] border-r-border`}
        >
          <AdminNav inSheet={false} />
        </nav>
        <main className="relative h-[calc(100vh-56px)] overflow-x-hidden pb-12">
          {children}
        </main>
      </section>
    </section>
  );
}
