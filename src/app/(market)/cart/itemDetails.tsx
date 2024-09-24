'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { Item } from '@/lib/types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DocumentReference,
  Timestamp,
  doc,
  writeBatch,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { revalidate } from './actions';

type Props = {
  cart_id: string;
  item: Item;
  index: number;
  updateQuantity: (store: string, index: number, item: Item) => void;
  removeItem: (store: string, index: number) => void;
};
const formSchema = z.object({
  quantity: z.string(),
});

export default function ItemDetails(props: Props) {
  const [selectableQuantity, setSelectableQuantity] = React.useState<string[]>(
    []
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: props.item.quantity.toString(),
    },
  });

  async function onSubmit() {}
  async function deleteItem() {
    let cart_item_id = props.item.id;
    if (props.item.options.length > 0) {
      cart_item_id = `${props.item.id}_${props.item.options.join('_')}`;
    }
    const itemRef: DocumentReference = doc(
      db,
      'carts',
      props.cart_id,
      'items',
      cart_item_id
    );
    const cartRef: DocumentReference = doc(db, 'carts', props.cart_id);
    const batch = writeBatch(db);
    batch.delete(itemRef);
    batch.update(cartRef, {
      updated_at: Timestamp.fromDate(new Date()),
    });
    await batch.commit();
    props.removeItem(props.item.store_id, props.index);
    toast.success('Product Removed', {
      description: `You removed ${props.item.name} ${props.item.options.join(' ')}`,
    });
    revalidate();
  }

  async function onOptionChange(event: string) {
    let cart_item_id = props.item.id;
    if (props.item.options.length > 0) {
      cart_item_id = `${props.item.id}_${props.item.options.join('_')}`;
    }
    const itemRef: DocumentReference = doc(
      db,
      'carts',
      props.cart_id,
      'items',
      cart_item_id
    );
    const cartRef: DocumentReference = doc(db, 'carts', props.cart_id);
    const batch = writeBatch(db);
    batch.update(itemRef, {
      quantity: parseInt(event),
    });
    batch.update(cartRef, {
      updated_at: Timestamp.fromDate(new Date()),
    });
    await batch.commit();
    props.item.quantity = parseInt(event);
    props.updateQuantity(props.item.store_id, props.index, props.item);
    toast.success('Product Quantity Updated', {
      description: `You updated the quantity of ${props.item.name} ${props.item.options.join(' ')}`,
    });
    revalidate();
  }

  React.useEffect(() => {
    let selectable = Array.from({ length: props.item.inventory }, (_, i) =>
      (i + 1).toString()
    );
    if (!props.item.track_inventory) {
      selectable = Array.from({ length: 999 }, (_, i) => (i + 1).toString());
    }
    setSelectableQuantity(selectable);
  }, []);
  return (
    <section className="flex w-full flex-col gap-4 md:flex-row">
      <section className="flex w-full flex-1 gap-4">
        {props.item.images.length > 0 && (
          <section>
            <Link
              href={`/product/${props.item.id}`}
              className="group flex aspect-square w-[100px] items-center justify-center overflow-hidden rounded border bg-layer-one"
            >
              <Image
                src={props.item.images[0]}
                width="300"
                height="300"
                alt={props.item.name}
                className="flex w-full"
              />
            </Link>
          </section>
        )}
        <section className="flex w-full flex-1 flex-col">
          <p>
            <b>{props.item.name}</b>
          </p>
          <p className="pb-2 text-sm text-muted-foreground">
            {props.item.product_type}
          </p>
          <p>{props.item.options.join(', ')}</p>
        </section>
      </section>
      <section className="flex w-full flex-row-reverse items-end justify-between gap-4 md:w-auto md:flex-col">
        <section className="flex flex-col">
          {props.item.compare_at > 0 &&
          props.item.compare_at < props.item.price ? (
            <>
              <p className="text-destructive line-through">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: props.item.currency,
                }).format(props.item.price)}
              </p>
              <p>
                <b>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: props.item.currency,
                  }).format(props.item.compare_at)}
                </b>
              </p>
            </>
          ) : (
            <p>
              <b>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: props.item.currency,
                }).format(props.item.price)}
              </b>
            </p>
          )}
        </section>
        <section className="flex items-center gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name={`quantity`}
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <Select
                      onValueChange={(event) => onOptionChange(event)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select a quantity`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectableQuantity.map((item) => {
                          return (
                            <SelectItem value={item.toString()} key={item}>
                              {item.toString()}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Button variant="ghost" size="sm" onClick={deleteItem}>
            <FontAwesomeIcon className="icon h-4 w-4" icon={faTrash} />
          </Button>
        </section>
      </section>
    </section>
  );
}
