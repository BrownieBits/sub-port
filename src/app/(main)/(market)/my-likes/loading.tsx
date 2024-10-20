'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>My Likes</h1>
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
