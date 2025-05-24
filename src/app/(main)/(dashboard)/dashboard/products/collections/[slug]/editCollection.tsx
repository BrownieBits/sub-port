'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { TagsInput } from '@/components/ui/tags-input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { db } from '@/lib/firebase';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import {
  faCaretLeft,
  faEllipsis,
  faEye,
  faPencil,
  faSave,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DocumentReference,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { revalidate } from './actions';
import AddProductsToCollectionForm from './addProductToCollection';
import { ProductList } from './productList';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Collection name must be 3 or more characters long' })
    .max(18, {
      message: 'Collection name must be no more than 18 characters long',
    }),
  type: z.enum(['Manual', 'Smart'], {
    required_error: 'You need to select a collection type.',
  }),
  description: z.string().optional(),
  tags: z.array(z.string()),
});

export default function Edit(props: {
  name: string;
  description: string;
  tags?: string[];
  type: 'Manual' | 'Smart';
  products: string[];
  status: string;
  id: string;
  store_id: string;
}) {
  const blogsRef = collection(db, 'products');
  const q = query(blogsRef, where('store_id', '==', props.store_id));
  const [blogSnapShots, loading1] = useCollection(q); // TODO Remove
  const { push } = useRouter();
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const { register, watch } = useForm();
  const tagField = watch('tags');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name || '',
      type: props.type || 'Manual',
      description: props.description || '',
      tags: props.tags || [],
    },
  });

  async function onSubmit() {
    setDisabled(true);
    const docRef: DocumentReference = doc(
      db,
      `stores/${props.store_id}/collections`,
      props.id
    );
    await updateDoc(docRef, {
      name: form.getValues('name'),
      type: form.getValues('type'),
      products: form.getValues('type') === 'Manual' ? selectedProducts : [],
      description: form.getValues('description'),
      tags: form.getValues('type') === 'Smart' ? form.getValues('tags') : [],
    });
    toast('Colletion Updated', {
      description: `The ${form.getValues('name')} was updated.`,
    });
    setDisabled(false);
    revalidate(props.id);
  }
  async function deleteCollection() {
    const docRef: DocumentReference = doc(
      db,
      `stores/${props.store_id}/collections`,
      props.id
    );
    await deleteDoc(docRef);
    push(`/dashboard/products/collections`);
  }
  async function collectionStatusUpdate(action: string) {
    const docRef: DocumentReference = doc(
      db,
      `stores/${props.store_id}/collections`,
      props.id
    );
    await updateDoc(docRef, {
      status: action,
      updated_at: Timestamp.fromDate(new Date()),
    });
    revalidate(props.id);
  }
  function closeModal(updatedProducts: string[]) {
    setOpen(false);
    setSelectedProducts(updatedProducts);
  }

  React.useEffect(() => {
    setSelectedProducts(props.products);
  }, [props.products]);
  React.useEffect(() => {
    if (props.tags) {
      setSelectedTags(props.tags);
    }
  }, [props.tags]);
  React.useEffect(() => {
    if (tagField && tagField !== '') {
      if (tagField!.charAt(tagField.length - 1) === ',') {
        let tags: string[] = tagField.split(',');
        tags = tags.filter((tag) => tag !== '');
        tags = tags.map((tag) => tag.trim());

        setSelectedTags([...tags]);
      }
    } else {
      setSelectedTags([]);
    }
  }, [tagField]);
  return (
    <section>
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 pt-[10px] pb-4">
          <section className="flex w-auto items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/products/collections">
                    <FontAwesomeIcon className="icon" icon={faCaretLeft} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Collections</p>
              </TooltipContent>
            </Tooltip>
            <h1 className="line-clamp-1">{props.name}</h1>
          </section>
          <div className="flex items-center gap-4">
            {disabled ? (
              <Button>
                <div>
                  <FontAwesomeIcon
                    className="icon mr-4"
                    icon={faSpinner}
                    spin
                  />
                  Save
                </div>
              </Button>
            ) : (
              <Button type="submit" onClick={onSubmit} asChild>
                <div>
                  <FontAwesomeIcon className="icon mr-4" icon={faSave} />
                  Save
                </div>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FontAwesomeIcon className="icon" icon={faEllipsis} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Button variant="link" asChild>
                    <Link
                      href={`/store/${props.store_id}/collection/${props.id}`}
                    >
                      <FontAwesomeIcon className="icon mr-[5px]" icon={faEye} />{' '}
                      View Collection
                    </Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {props.status == 'Private' ? (
                    <Button
                      variant="link"
                      onClick={() => {
                        {
                          collectionStatusUpdate('Public');
                        }
                      }}
                      asChild
                    >
                      <div>
                        <FontAwesomeIcon
                          className="icon mr-[5px]"
                          icon={faEye}
                        />{' '}
                        Make Public
                      </div>
                    </Button>
                  ) : (
                    <Button
                      variant="link"
                      onClick={() => {
                        {
                          collectionStatusUpdate('Private');
                        }
                      }}
                      asChild
                    >
                      <div>
                        <FontAwesomeIcon
                          className="icon mr-[5px]"
                          icon={faEyeSlash}
                        />{' '}
                        Make Private
                      </div>
                    </Button>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant="link" onClick={deleteCollection} asChild>
                    <div>
                      <FontAwesomeIcon
                        className="icon mr-[5px]"
                        icon={faTrash}
                      />{' '}
                      Delete
                    </div>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
      </section>
      <Separator />
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full flex-col gap-8 px-4 pt-4 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <section className="flex flex-col gap-8 md:flex-row">
                <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                  <p className="pb-4">
                    <b>Title and meta description</b>
                  </p>
                  <p>
                    The title and meta description help define how your
                    collection shows up on search engines.
                  </p>
                </aside>
                <Card className="w-full flex-1">
                  <CardContent className="flex w-full flex-col gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              onChangeCapture={field.onChange}
                              id="name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea
                              onChangeCapture={field.onChange}
                              placeholder="Tell us a little bit about this collection..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Collection Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex items-center space-x-6"
                            >
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="Manual" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Manual
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="Smart" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Smart
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </section>
              {props.type !== 'Manual' && (
                <section className="flex flex-col gap-8 pt-8 md:flex-row">
                  <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                    <p className="pb-4">
                      <b>Smart Collection Tags</b>
                    </p>
                    <p>
                      Based on the tags in here we will build out the collection
                      of products for you.
                    </p>
                  </aside>
                  <Card className="w-full flex-1">
                    <CardContent className="flex w-full flex-col gap-8">
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <TagsInput
                                value={field.value}
                                onValueChange={field.onChange}
                              />
                            </FormControl>
                            <FormDescription>
                              Use{' '}
                              <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                                Enter
                              </kbd>{' '}
                              to add tags to list.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </section>
              )}
            </form>
          </Form>
          <section className="flex flex-col gap-8 md:flex-row">
            <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
              <p className="pb-4">
                <b>Products</b>
              </p>
              <p className="pb-4">
                This will be the products in the collection
              </p>
              {props.type === 'Manual' && (
                <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger>
                    <Button variant="outline" asChild>
                      <div>
                        <FontAwesomeIcon
                          className="icon mr-2"
                          icon={faPencil}
                        />
                        Edit Products
                      </div>
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Select Products</AlertDialogTitle>
                      <Separator className="mb-4" />
                      <AlertDialogDescription asChild>
                        <AddProductsToCollectionForm
                          closeModal={closeModal}
                          preselected={selectedProducts}
                          products={blogSnapShots!}
                          loading={loading1}
                        />
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </aside>
            <Card className="w-full flex-1">
              <CardContent className="flex w-full flex-col gap-8">
                {form.getValues('type') === 'Manual' && (
                  <ProductList
                    store_id={props.store_id}
                    product_list={selectedProducts}
                  />
                )}
                {form.getValues('type') === 'Smart' && (
                  <ProductList
                    store_id={props.store_id}
                    tag_list={selectedTags}
                  />
                )}
              </CardContent>
            </Card>
          </section>
        </section>
      </section>
    </section>
  );
}
