import { AppSidebar } from '@/components/sp-ui/AppSidebar';

export default function NoUserLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar />
      <section className="h-full min-h-screen w-full">{children}</section>
    </>
  );
}
