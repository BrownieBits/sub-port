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
import { RemovedProduct } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function RemovedItemsDialogue(props: {
  removedItems: RemovedProduct[];
}) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [removedItems, setRemovedItems] = React.useState<RemovedProduct[]>([]);

  React.useEffect(() => {
    if (props.removedItems !== undefined) {
      setRemovedItems(props.removedItems);
    }
  }, [props.removedItems]);
  React.useEffect(() => {
    if (removedItems.length > 0) {
      setOpen(true);
    }
  }, [removedItems]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>We adjusted your cart...</AlertDialogTitle>
          <AlertDialogDescription>
            <section className="flex w-full flex-col gap-4 pt-4">
              {removedItems.map((item) => {
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
            <Link href="/" title="Continue Shopping">
              Continue Shopping
            </Link>
          </Button>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
