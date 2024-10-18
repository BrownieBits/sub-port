'use client';
import { Skeleton } from '@/components/ui/skeleton';
import ProductComments from './comments/productComments';

export default function ProductLoading() {
  return (
    <section className="mx-auto flex max-w-[1754px] flex-col gap-8 p-4">
      <section key="productInfo" className="flex flex-col gap-8 md:flex-row">
        <section className="flex w-full flex-1 flex-col gap-4">
          <Skeleton className="flex aspect-square w-full" />
          <ProductComments />
        </section>
        <section className="flex w-full flex-col md:w-[350px] xl:w-[400px]">
          <section className="flex justify-between">
            <section className="flex flex-col items-start gap-1 pb-8">
              <Skeleton className="flex aspect-[6/1] items-center justify-start overflow-hidden rounded md:aspect-[128/15]" />
              <Skeleton className="h-[28px] w-[200px]" />
              <section className="flex items-center gap-4">
                <Skeleton className="h-[20px] w-[100px]" />
              </section>
              <Skeleton className="h-[20px] w-[75px]" />
            </section>
            <section className="flex flex-col items-end gap-1">
              <Skeleton className="h-[28px] w-[75px]" />
            </section>
          </section>

          <Skeleton className="h-[40px] w-full rounded-full" />

          <div className="flex justify-between gap-2 pt-8">
            <Skeleton className="h-[40px] w-[100px] rounded-full" />
            <Skeleton className="h-[40px] w-[100px] rounded-full" />
            <Skeleton className="h-[40px] w-[100px] rounded-full" />
          </div>
        </section>
      </section>
    </section>
  );
}
