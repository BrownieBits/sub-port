import { AdminHeader } from '@/components/sp-ui/Menus/adminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      <section className="sticky top-0 z-50 w-full">
        <AdminHeader />
      </section>
      <section className="min-h-screen w-full">
        <main className="min-h-screen overflow-x-hidden">{children}</main>
      </section>
    </section>
  );
}
