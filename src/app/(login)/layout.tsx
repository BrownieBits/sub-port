export default async function NoUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full overflow-y-auto overflow-x-hidden">
      <main className="flex min-h-svh w-full">
        <aside className="hidden flex-1 bg-primary md:flex"></aside>
        <aside className="flex flex-1 p-8">{children}</aside>
      </main>
    </section>
  );
}
