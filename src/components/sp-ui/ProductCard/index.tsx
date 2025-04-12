'use client';
import { ShowAvatar } from '@/components/sp-ui/ShowAvatar';
import { _GridProduct } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({
  product,
  show_creator,
}: {
  product: _GridProduct;
  show_creator: boolean;
}) {
  const today = Timestamp.fromDate(new Date());
  const created = Timestamp.fromDate(product.created_at);
  function timeDifference() {
    const difference = today.seconds - created.seconds;
    const yearDifference = Math.floor(difference / 60 / 60 / 24 / 365);
    const monthDifference = Math.floor(difference / 60 / 60 / 24 / 30);
    const daysDifference = Math.floor(difference / 60 / 60 / 24);
    const hoursDifference = Math.floor(difference / 60 / 60);
    const minutesDifference = Math.floor(difference / 60);
    if (yearDifference > 0) {
      return `${yearDifference} Year${yearDifference > 1 ? 's' : ''}`;
    }
    if (monthDifference > 0) {
      return `${monthDifference} Month${monthDifference > 1 ? 's' : ''}`;
    }
    if (daysDifference > 0) {
      return `${daysDifference} Day${daysDifference > 1 ? 's' : ''}`;
    }
    if (hoursDifference > 0) {
      return `${hoursDifference} Hour${hoursDifference > 1 ? 's' : ''}`;
    }
    if (minutesDifference > 10) {
      return `${minutesDifference} Minutes`;
    }
    return `Just Now`;
  }
  return (
    <section className="flex w-full flex-col gap-2">
      <Link
        href={`/product/${product.id}`}
        className="group flex aspect-square items-center justify-center overflow-hidden rounded border"
      >
        <Image
          src={product.images[0]}
          width="300"
          height="300"
          alt={product.name}
          priority
          className="flex w-full"
        />
      </Link>
      <section className="flex w-full gap-4">
        {show_creator ? (
          <Link href={`/store/${product.store_id}`}>
            <ShowAvatar store_id={product.store_id} size="sm" />
          </Link>
        ) : (
          <></>
        )}
        <aside className="flex flex-1 justify-between">
          <section className="flex flex-col">
            <Link href={`/product/${product.id}`}>
              <p className="font-bold">{product.name}</p>
            </Link>
            {/* TODO: switch link to go to search page */}
            <Link href={`/product/${product.id}`} className="pb-1">
              <p className="text-muted-foreground">{product.product_type}</p>
            </Link>

            {show_creator ? (
              <Link
                href={`/store/${product.store_id}`}
                className="text-muted-foreground"
              >
                {product.store_id}
              </Link>
            ) : (
              <></>
            )}
            <p className="text-muted-foreground">
              {product.like_count} Likes{' '}
              <span className="ttext-muted-foreground">&bull;</span>{' '}
              {timeDifference()}
            </p>
          </section>
          <section>
            <Link
              href={`/product/${product.id}`}
              className="flex w-full flex-col items-end gap-1"
            >
              {product.compare_at > 0 && product.price > product.compare_at ? (
                <>
                  <p className="text-destructive line-through">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency,
                    }).format(product.price / 100)}
                  </p>
                  <p>
                    <b>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: product.currency,
                      }).format(product.compare_at / 100)}
                    </b>
                  </p>
                </>
              ) : (
                <p>
                  <b>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency,
                    }).format(product.price / 100)}
                  </b>
                </p>
              )}
            </Link>
          </section>
        </aside>
      </section>
    </section>
  );
}
