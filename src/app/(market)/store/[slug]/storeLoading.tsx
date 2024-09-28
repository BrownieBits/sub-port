'use client';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default async function StoreLoading() {
  return (
    <>
      <section className="mx-auto w-full max-w-[2428px]">
        <Skeleton className="flex aspect-[6/1] items-center justify-start overflow-hidden rounded md:aspect-[128/15]" />

        <section className="flex w-full flex-col items-start justify-between gap-4 px-4 py-4 md:flex-row md:items-center">
          <section className="flex items-center gap-4">
            <Skeleton className="h-[75] w-[75] rounded-full md:h-[100px] md:w-[100px]" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-[28px] w-[200px]" />

              <section className="flex w-full flex-wrap gap-1 md:w-auto">
                <Skeleton className="h-[20px] w-[250px]" />
              </section>
              <section className="hidden md:flex">
                <Skeleton className="h-[20px] w-[150px]" />
              </section>
            </div>
          </section>
          <section className="flex md:hidden">
            <Skeleton className="h-[20px] w-[150px]" />
          </section>
          <section className="flex w-full md:w-auto">
            <Skeleton className="h-[40px] w-[110px] rounded-full" />
          </section>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6">
          <section className="flex w-full flex-col">
            <Skeleton className="aspect-square w-full" />
            <section className="flex w-full gap-4 pt-4">
              <aside className="flex flex-1 justify-between">
                <section className="flex flex-col gap-1">
                  <section className="flex flex-col gap-1">
                    <Skeleton className="h-[28px] w-[250px]" />
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                  <section className="text-sm text-muted-foreground">
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                </section>
                <section>
                  <section className="flex w-full flex-col items-end gap-1">
                    <Skeleton className="h-[28px] w-[75px]" />
                  </section>
                </section>
              </aside>
            </section>
          </section>
          <section className="flex w-full flex-col">
            <Skeleton className="aspect-square w-full" />
            <section className="flex w-full gap-4 pt-4">
              <aside className="flex flex-1 justify-between">
                <section className="flex flex-col gap-1">
                  <section className="flex flex-col gap-1">
                    <Skeleton className="h-[28px] w-[250px]" />
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                  <section className="text-sm text-muted-foreground">
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                </section>
                <section>
                  <section className="flex w-full flex-col items-end gap-1">
                    <Skeleton className="h-[28px] w-[75px]" />
                  </section>
                </section>
              </aside>
            </section>
          </section>
          <section className="flex w-full flex-col">
            <Skeleton className="aspect-square w-full" />
            <section className="flex w-full gap-4 pt-4">
              <aside className="flex flex-1 justify-between">
                <section className="flex flex-col gap-1">
                  <section className="flex flex-col gap-1">
                    <Skeleton className="h-[28px] w-[250px]" />
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                  <section className="text-sm text-muted-foreground">
                    <Skeleton className="h-[20px] w-[150px]" />
                  </section>
                </section>
                <section>
                  <section className="flex w-full flex-col items-end gap-1">
                    <Skeleton className="h-[28px] w-[75px]" />
                  </section>
                </section>
              </aside>
            </section>
          </section>
        </section>
      </section>
    </>
  );
}
