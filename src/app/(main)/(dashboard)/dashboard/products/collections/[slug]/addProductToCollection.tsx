'use client';

import { AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  search: z.string(),
});

export default function AddProductsToCollectionForm(props: {
  closeModal: (updatedProducts: string[]) => void;
  preselected: string[];
  products: QuerySnapshot<DocumentData, DocumentData>;
  loading: boolean;
}) {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [searchedTerm, setSearchedTerm] = React.useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchedTerm(values.search || '');
  }
  async function checkChange(event: any) {
    if (event.target.checked) {
      setSelectedProducts([...selectedProducts, event.target.id]);
    } else {
      setSelectedProducts(
        selectedProducts.filter((a) => a !== event.target.id)
      );
    }
  }

  React.useEffect(() => {
    setSelectedProducts(props.preselected || []);
  }, [props.preselected]);

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
          id="new-collection"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Search" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {props.loading ? (
        <div>Loading</div>
      ) : (
        <ScrollArea className="flex max-h-[300px] flex-col">
          {props.products?.docs?.length! > 0 ? (
            <>
              {props.products?.docs.map((doc) => {
                if (
                  searchedTerm !== '' &&
                  !doc
                    .data()
                    .title.toLowerCase()
                    .includes(searchedTerm.toLowerCase()) &&
                  !doc
                    .data()
                    .description.toLowerCase()
                    .includes(searchedTerm.toLowerCase())
                ) {
                  return <></>;
                }
                return (
                  <section
                    className="my-4 flex items-center gap-4"
                    key={doc.id}
                  >
                    <input
                      type="checkbox"
                      id={doc.id}
                      onChange={checkChange}
                      checked={selectedProducts.includes(doc.id)}
                    />
                    <div className="flex aspect-square w-[50px] items-center justify-center overflow-hidden border">
                      <Image
                        alt={doc.data().name}
                        src={doc.data().images[0]}
                        width="50"
                        height="50"
                      />
                    </div>
                    <span className="flex-1">{doc.data().name}</span>
                    <span className="flex-1">{doc.data().product_type}</span>
                    {doc.data().status === 'Public' ? (
                      <span className="bg-success text-success-foreground mr-2 rounded px-2.5 py-0.5 text-xs font-medium">
                        {doc.data().status}
                      </span>
                    ) : (
                      <span className="bg-destructive text-destructive-foreground mr-2 rounded px-2.5 py-0.5 text-xs font-medium">
                        {doc.data().status}
                      </span>
                    )}
                  </section>
                );
              })}
            </>
          ) : (
            <div>No Data</div>
          )}
        </ScrollArea>
      )}

      <section className="flex items-center justify-between gap-4 pt-4">
        <span>
          {selectedProducts?.length} Product
          {selectedProducts?.length === 1 ? '' : 's'} Selected
        </span>
        <section className="flex gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={() => props.closeModal(selectedProducts)}>
            Save
          </Button>
        </section>
      </section>
    </section>
  );
}
