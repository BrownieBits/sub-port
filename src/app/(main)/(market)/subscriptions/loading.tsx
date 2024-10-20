'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 py-4">
          <h1>My Subscriptions</h1>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[2428px]">
        <section className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3 xl:grid-cols-6">
          <section className="group flex w-full flex-col items-center justify-center gap-4">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full">
              <Skeleton className="aspect-square h-full w-full rounded-full" />
            </div>
            <section className="flex w-full flex-col items-center justify-center gap-1">
              <Skeleton className="h-[28px] w-[200px] rounded" />
              <Skeleton className="h-[24px] w-[150px] rounded" />
            </section>
          </section>
          <section className="group flex w-full flex-col items-center justify-center gap-4">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full">
              <Skeleton className="aspect-square h-full w-full rounded-full" />
            </div>
            <section className="flex w-full flex-col items-center justify-center gap-1">
              <Skeleton className="h-[28px] w-[200px] rounded" />
              <Skeleton className="h-[24px] w-[150px] rounded" />
            </section>
          </section>
          <section className="group flex w-full flex-col items-center justify-center gap-4">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full">
              <Skeleton className="aspect-square h-full w-full rounded-full" />
            </div>
            <section className="flex w-full flex-col items-center justify-center gap-1">
              <Skeleton className="h-[28px] w-[200px] rounded" />
              <Skeleton className="h-[24px] w-[150px] rounded" />
            </section>
          </section>
        </section>
      </section>
    </>
  );
}
