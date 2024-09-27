'use client';

import { cn } from '@/lib/utils';
import cartStore from '@/stores/cartStore';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Button } from '../../ui/button';

export const CartIcon = () => {
  const item_count = cartStore((state) => state.item_count);

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="bg-layer-one hover:bg-layer-two"
    >
      <Link href="/cart" aria-label="Cart" title="Cart">
        <FontAwesomeIcon
          icon={faCartShopping}
          className={cn('h-4 w-4', {
            'mr-4': item_count > 0,
          })}
        />
        {item_count > 0 && <p>{item_count}</p>}
      </Link>
    </Button>
  );
};
