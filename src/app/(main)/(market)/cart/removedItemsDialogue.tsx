'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import cartStore from '@/stores/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function RemovedItemsDialogue() {
  const cart_loaded = cartStore((state) => state.cart_loaded);
  const removed_items = cartStore((state) => state.removed_items);
  const setRemovedItems = cartStore((state) => state.setRemovedItems);
  const [open, setOpen] = React.useState<boolean>(false);

  async function closeModal() {
    setOpen(false);
    setRemovedItems([]);
  }
  React.useEffect(() => {
    if (removed_items.length > 0) {
      setOpen(true);
    }
  }, [removed_items]);

  if (!cart_loaded || removed_items.length === 0) {
    return <></>;
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>We adjusted your cart...</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <section className="flex w-full flex-col gap-4 pt-4">
              {removed_items.map((item) => {
                return (
                  <section
                    className="flex w-full items-center gap-4"
                    key={`removed-item-${item.name}`}
                  >
                    <Image
                      src={item.image_url}
                      alt={`Removed Item-${item.name}`}
                      width={50}
                      height={50}
                      className="w-[50px]"
                    />
                    <section className="w-full flex-1">
                      <p className="text-foreground">{item.name}</p>
                      <p className="text-xs text-destructive">{item.reason}</p>
                    </section>
                  </section>
                );
              })}
            </section>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/" title="Continue Shopping" onClick={closeModal}>
              Continue Shopping
            </Link>
          </Button>
          <AlertDialogAction asChild>
            <Button onClick={closeModal}>Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
