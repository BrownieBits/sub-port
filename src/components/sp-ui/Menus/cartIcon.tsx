'use client';

import cartStore from '@/stores/cartStore';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Button } from '../../ui/button';

export const CartIcon = () => {
  const item_count = cartStore((state) => state.item_count);

  return (
    <Button asChild variant="ghost" size="sm" className="relative">
      <Link href="/cart" aria-label="Cart" title="Cart">
        <FontAwesomeIcon icon={faCartShopping} className="h-4 w-4" />
        {item_count > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[11px]">
            {item_count}
          </span>
        )}
      </Link>
    </Button>
  );
};
