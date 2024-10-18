'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsis,
  faEye,
  faPencil,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { revalidate } from './actions';
import AddProductsToCollectionForm from './addProductToCollection';

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
  tags: z.string().optional(),
});

export default function Edit(props: {
  name: string;
  description: string;
  tags: string;
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
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [selectedName, setSelectedName] = React.useState<string>('');
  const [selectedDescription, setSelectedDescription] =
    React.useState<string>('');
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [selectedTags, setSelectedTags] = React.useState<string>('');
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name || '',
      type: props.type || 'Manual',
      description: props.description || '',
      tags: props.tags || '',
    },
  });

  async function onSubmit() {
    const docRef: DocumentReference = doc(
      db,
      `stores/${props.store_id}/collections`,
      props.id
    );
    setDisabled(true);
    await updateDoc(docRef, {
      name: selectedName,
      type: selectedType,
      products: selectedProducts,
      description: selectedDescription,
      tags: selectedTags,
    });
    toast('Colletion Updated', {
      description: `The ${selectedName} was updated.`,
    });
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
    });
    revalidate(props.id);
  }
  async function updateForm(event: any) {
    if (
      event !== null &&
      event.target !== undefined &&
      event.target.name! === 'name'
    ) {
      setSelectedName(event.target.value);
    } else if (
      event !== null &&
      event.target != undefined &&
      event.target.name! === 'description'
    ) {
      setSelectedDescription(event.target.value);
    } else if (
      event !== null &&
      event.target !== undefined &&
      event.target.name! === 'tags'
    ) {
      setSelectedTags(event.target.value);
    } else if (event !== null && (event === 'Manual' || event === 'Smart')) {
      if (event === 'Manual') {
        form.setValue('tags', '');
        setSelectedTags('');
      } else {
        form.setValue('tags', props.tags);
        setSelectedTags(props.tags);
      }
      setSelectedType(event);
    }
  }
  async function updateSave() {
    if (
      selectedName !== props.name ||
      selectedDescription !== props.description ||
      selectedTags !== props.tags ||
      selectedProducts !== props.products ||
      selectedType !== props.type
    ) {
      setDisabled(false);
    } else if (
      selectedName === props.name &&
      selectedDescription === props.description &&
      selectedTags === props.tags &&
      selectedProducts === props.products &&
      selectedType === props.type
    ) {
      setDisabled(true);
    }
  }
  function closeModal(updatedProducts: string[]) {
    setOpen(false);
    setSelectedProducts(updatedProducts);
  }

  React.useEffect(() => {
    form.setValue('name', props.name);
    setSelectedName(props.name);
  }, [props.name]);
  React.useEffect(() => {
    form.setValue('description', props.description);
    setSelectedDescription(props.description);
  }, [props.description]);
  React.useEffect(() => {
    form.setValue('tags', props.tags);
    setSelectedTags(props.tags);
  }, [props.tags]);
  React.useEffect(() => {
    form.setValue('type', props.type);
    setSelectedType(props.type);
  }, [props.type]);
  React.useEffect(() => {
    setSelectedProducts(props.products);
  }, [props.products]);
  React.useEffect(() => {
    updateSave();
  }, [
    selectedProducts,
    selectedType,
    selectedName,
    selectedDescription,
    selectedTags,
  ]);

  return (
    <section>
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full items-center justify-between gap-4 px-4 pt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/products">
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/products/collections">
                  Collections
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{props.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
        <section className="flex w-full items-center justify-between gap-4 px-4 pb-4 pt-[10px]">
          <h1>{props.name}</h1>
          <div className="flex items-center gap-4">
            {disabled ? (
              <></>
            ) : (
              <Button type="submit" onClick={onSubmit} asChild>
                <div>
                  <FontAwesomeIcon className="icon mr-[5px]" icon={faSave} />
                  Save
                </div>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/store/${props.store_id}/collection/${props.id}`}>
                View Collection
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FontAwesomeIcon className="icon" icon={faEllipsis} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  {props.status == 'Private' ? (
                    <Button
                      variant="ghost"
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
                      variant="ghost"
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
                  <Button variant="ghost" onClick={deleteCollection} asChild>
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
        <section className="flex w-full flex-col gap-8 px-4 pb-8 pt-4">
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
                <aside className="flex w-full flex-1 flex-col gap-8 rounded bg-layer-one p-8 drop-shadow">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={updateForm}
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
                            onChangeCapture={updateForm}
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
                            onValueChange={updateForm}
                            defaultValue={field.value}
                            className="flex items-center space-x-6"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Manual" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Manual
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
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
                </aside>
              </section>
              {selectedType === 'Manual' ? (
                <></>
              ) : (
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
                  <aside className="flex w-full flex-1 flex-col gap-8 rounded bg-layer-one p-8 drop-shadow">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input
                              onChangeCapture={updateForm}
                              id="tags"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </aside>
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
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger>
                  <Button variant="outline" asChild>
                    <div>
                      <FontAwesomeIcon className="icon mr-2" icon={faPencil} />
                      Edit Products
                    </div>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Select Products</AlertDialogTitle>
                    <Separator className="mb-4" />
                    <AlertDialogDescription>
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
            </aside>
            <aside className="flex w-full flex-1 flex-col gap-8 rounded bg-layer-one p-8 drop-shadow">
              {loading1 ? (
                <div>Loading</div>
              ) : (
                <section className="flex flex-col gap-4">
                  {blogSnapShots?.docs?.length! > 0 ? (
                    <>
                      {blogSnapShots?.docs.map((doc) => {
                        if (!selectedProducts?.includes(doc.id)) {
                          return <></>;
                        }
                        return (
                          <section
                            className="flex items-center gap-4"
                            key={doc.id}
                          >
                            <div className="flex aspect-square w-[50px] items-center justify-center overflow-hidden border bg-layer-one">
                              <Image
                                alt={doc.data().name}
                                src={doc.data().images[0]}
                                width="50"
                                height="50"
                              />
                            </div>
                            <span className="flex-1">{doc.data().name}</span>
                            <span className="flex-1">
                              {doc.data().product_type}
                            </span>
                            {doc.data().status === 'Public' ? (
                              <span className="mr-2 rounded bg-success px-2.5 py-0.5 text-xs font-medium text-success-foreground">
                                {doc.data().status}
                              </span>
                            ) : (
                              <span className="mr-2 rounded bg-destructive px-2.5 py-0.5 text-xs font-medium text-destructive-foreground">
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
                </section>
              )}
            </aside>
          </section>
        </section>
      </section>
    </section>
  );
}
