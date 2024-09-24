'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { currency_list } from '@/lib/currencyList';
import { db, storage } from '@/lib/firebase';
import { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import {
  faEye,
  faFile,
  faRefresh,
  faSave,
  faSquarePlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  collection,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  ref,
} from 'firebase/storage';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { goTo, revalidate } from './actions';
import DraggableImages from './draggableImages';

const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const currencyTypes = currency_list.map((item) => item.value);
const formSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Product name must be 6 or more characters long' })
    .max(32, {
      message: 'Product name must be no more than 32 characters long',
    }),
  description: z.string().optional(),
  product_images: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 6, `Maximum of 6 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    )
    .optional(),
  digital_file: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 1, `Maximum of 1 files are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .optional(),
  prices: z
    .object({
      price: z.union([
        z.coerce
          .number({
            message: 'Price must be a number',
          })
          .positive({
            message: 'Price must be positive',
          }),
        z.literal(''),
      ]),
      compare_at: z
        .union([
          z.coerce
            .number({
              message: 'Compare at Price must be a number',
            })
            .gte(0, {
              message: 'Compare at Price must be positive',
            }),
          z.literal(''),
        ])
        .optional(),
    })
    .refine(
      (data) => {
        if (data.compare_at !== undefined) {
          return data.price > data.compare_at;
        }
        return true;
      },
      {
        message: 'Compare at Price must be lower than price.',
        path: ['compare_at'], // path of error
      }
    ),
  currency: z.enum(['', ...currencyTypes], {
    required_error: 'You need to select a collection type.',
  }),
  tags: z.string().optional(),
  sku: z.string().optional(),
  is_featured: z.boolean().default(false),
});
type Props = {
  storeID: string;
  userID: string;
  docID?: string;
  name?: string;
  description?: string;
  product_images?: ProductImage[];
  digital_file?: string;
  digital_file_name?: string;
  tags?: string[];
  price?: number;
  compare_at?: number;
  currency?: string;
  sku?: string;
  is_featured?: boolean;
  status?: string;
};

export default function DigitalEditForm(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const productImagesRef = React.useRef<HTMLInputElement>(null);
  const digitalFileRef = React.useRef<HTMLInputElement>(null);
  const [productImages, setProductImages] = React.useState<ProductImage[]>([]);
  const [productImageFiles, setProductImageFiles] = React.useState<File[]>([]);
  const [productImageRemovals, setProductImageRemovals] = React.useState<
    string[]
  >([]);
  const [digitalFile, setDigitalFile] = React.useState<string>('');
  const [digitalFileName, setDigitalFileName] = React.useState<string>('');
  const [digitalFileRemoval, setDigitalFileRemoval] =
    React.useState<string>('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState<string>('');
  const [uploadFile, uploading, snapshot, uploadError] = useUploadFile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name || '',
      description: props.description || '',
      product_images: undefined,
      digital_file: undefined,
      prices: {
        price: props.price || 0.0,
        compare_at: props.compare_at || 0.0,
      },
      currency: props.currency || 'USD',
      tags: props.tags?.join(',') || '',
      sku: props.sku || '',
      is_featured: props.is_featured || false,
    },
  });

  async function uploadDigitalFile(docId: string) {
    let df = digitalFile;
    const uploadFiles = form.getValues('digital_file');

    if (df !== '' && props.digital_file !== df && uploadFiles !== undefined) {
      const df_fileName = docId + uploadFiles[0].name;
      const digitalFileStorageRef: StorageReference = ref(
        storage,
        `${props.userID}/stores/${props.storeID}/digital_files/${docId}/${df_fileName}`
      );

      await uploadFile(digitalFileStorageRef, uploadFiles[0], {
        contentType: uploadFiles[0].type,
      });
      df = await getDownloadURL(digitalFileStorageRef);
    }

    if (digitalFileRemoval !== '') {
      let removalURL = digitalFile.replace(
        'https://firebasestorage.googleapis.com/v0/b/creator-base-6c959.appspot.com/o/',
        ''
      );
      removalURL = removalURL.replace(/\?alt.*/, '');
      removalURL = removalURL.replaceAll('%2F', '/');
      const del_df_storageRef = ref(storage, removalURL);
      await deleteObject(del_df_storageRef);
    }
    return df;
  }
  async function uploadImages(docId: string) {
    let pi = productImages.map((image) => image.image);

    const uploadFiles = form.getValues('product_images');

    if (uploadFiles !== undefined) {
      const imageFileUrls: string[] = await Promise.all(
        Array.from(uploadFiles).map(async (item): Promise<string> => {
          const fileStorageRef = ref(
            storage,
            `${props.userID}/stores/${props.storeID}/product_images/${docId}/${item.name.replace(/[^a-zA-Z0-9.]/g, '')}`
          );
          await uploadFile(fileStorageRef, item, {
            contentType: item.type,
          });
          return await getDownloadURL(fileStorageRef);
        })
      );
      pi = [...pi, ...imageFileUrls];
    }

    if (productImageRemovals.length > 0) {
      await Promise.all(
        productImageRemovals.map(async (item): Promise<string> => {
          let removalURL = item.replace(
            'https://firebasestorage.googleapis.com/v0/b/creator-base-6c959.appspot.com/o/',
            ''
          );
          removalURL = removalURL.replace(/\?alt.*/, '');
          removalURL = removalURL.replaceAll('%2F', '/');
          const del_df_storageRef = ref(storage, removalURL);
          try {
            await deleteObject(del_df_storageRef);
          } catch (error) {
            console.error(error);
          }

          return removalURL;
        })
      );
      setProductImageRemovals([]);
    }
    pi = pi.filter((item) => item.includes('firebasestorage.googleapis.com'));

    form.resetField('product_images');
    return pi;
  }

  async function onSubmit() {
    setDisabled(true);
    try {
      if (digitalFile === '') {
        form.setError('digital_file', { message: 'This is required.' });
        return;
      }
      form.clearErrors('digital_file');

      const collectionReference: CollectionReference = collection(
        db,
        'products'
      );
      let docRef: DocumentReference = doc(collectionReference);
      if (props.docID !== undefined) {
        docRef = doc(collectionReference, props.docID);
      }
      const digitalFileUrl = await uploadDigitalFile(docRef.id);
      const imageFileUrls: string[] = await uploadImages(docRef.id);

      const price = parseFloat(form.getValues('prices.price') as string);
      const compare_at = parseFloat(
        form.getValues('prices.compare_at') as string
      );
      if (props.docID !== undefined) {
        await updateDoc(docRef, {
          name: form.getValues('name'),
          images: imageFileUrls,
          description: form.getValues('description') || '',
          price: price.toFixed(2) as unknown as number,
          compare_at: compare_at.toFixed(2) as unknown as number,
          currency: form.getValues('currency'),
          tags: form.getValues('tags')?.replace(/ /g, '').split(',') || [],
          digital_file: digitalFileUrl,
          digital_file_name: digitalFileName,
          is_featured: form.getValues('is_featured'),
          updated_at: Timestamp.fromDate(new Date()),
          sku: form.getValues('sku'),
          status: status,
        });
      } else {
        await setDoc(docRef, {
          name: form.getValues('name'),
          images: imageFileUrls,
          vendor: 'digital',
          vendor_id: '',
          description: form.getValues('description') || '',
          price: price.toFixed(2) as unknown as number,
          compare_at: compare_at.toFixed(2) as unknown as number,
          currency: form.getValues('currency'),
          inventory: 1,
          track_inventory: false,
          weight: null,
          dimensions: null,
          ship_from_address: null,
          status: 'Public',
          tags: form.getValues('tags')?.replace(/ /g, '').split(',') || [],
          admin_tags: [],
          like_count: 0,
          product_type: 'Digital',
          store_id: props.storeID,
          owner_id: props.userID,
          digital_file: digitalFileUrl,
          digital_file_name: digitalFileName,
          units_sold: 0,
          is_featured: form.getValues('is_featured'),
          created_at: Timestamp.fromDate(new Date()),
          updated_at: Timestamp.fromDate(new Date()),
          colors: [],
          sku: form.getValues('sku'),
          revenue: 0,
          view_count: 0,
          service_percent: 0.05,
        });
      }

      toast.success('Product Saved', {
        description: 'Your product has been saved.',
      });
      if (props.name !== undefined) {
        revalidate(props.docID!);
        router.replace(pathname);
      } else {
        revalidate('new-digital');
        goTo(`/dashboard/products/${docRef.id}`);
      }
    } catch (error) {
      setDisabled(true);
      console.error(error);
      toast.error('Error Saving', {
        description:
          'There was an error saving your product. Please try again.',
      });
    }
  }
  async function clearDigitalFile() {
    if (digitalFile.includes('firebasestorage.googleapis.com')) {
      setDigitalFileRemoval(digitalFile);
    }
    setDigitalFile('');
    setDigitalFileName('');
    const data = new DataTransfer();
    form.setValue('digital_file', data.files);
    digitalFileRef.current?.click();
  }

  function resetImages(
    images: ProductImage[],
    files: File[],
    removals: string[]
  ) {
    setProductImages(images);
    setProductImageFiles(files);
    setProductImageRemovals(removals);
  }

  async function ChangeStatus(action: string) {
    const docRef = doc(db, 'products', props.docID!);
    if (action === 'Delete') {
      await updateDoc(docRef, {
        status: 'archived',
        updated_at: Timestamp.fromDate(new Date()),
      });
      revalidate(props.docID!);
      goTo('/dashboard/products');
    } else {
      await updateDoc(docRef, {
        status: action,
        updated_at: Timestamp.fromDate(new Date()),
      });
    }
    revalidate(props.docID!);
  }

  React.useEffect(() => {
    if (props.digital_file) {
      setDigitalFile(props.digital_file);
    }
  }, [props.digital_file_name]);
  React.useEffect(() => {
    if (props.digital_file_name) {
      setDigitalFileName(props.digital_file_name);
    }
  }, [props.digital_file_name]);
  React.useEffect(() => {
    if (props.product_images) {
      setProductImages(props.product_images);
    }
  }, [props.product_images]);
  React.useEffect(() => {
    if (props.tags) {
      setTags(props.tags);
    }
  }, [props.tags]);
  React.useEffect(() => {
    if (props.status) {
      setStatus(props.status);
    }
  }, [props.status]);

  return (
    <section className="relative">
      <section className="mx-auto w-full max-w-[1754px]">
        {props.name !== undefined && (
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
                  <BreadcrumbPage>{props.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </section>
        )}
        <section
          className={cn('flex w-full items-center justify-between gap-4 px-4', {
            'pb-4 pt-[10px]': props.name !== undefined,
            'py-4': props.name === undefined,
          })}
        >
          {props.name !== undefined ? (
            <h1>{props.name}</h1>
          ) : (
            <h1>Add Product</h1>
          )}
          <div className="flex items-center gap-4">
            {props.status !== undefined && props.status === 'Public' && (
              <Button
                variant="outline"
                title="Make Private"
                onClick={() => ChangeStatus('Private')}
                className="text-foreground"
              >
                <FontAwesomeIcon className="icon" icon={faEyeSlash} />
              </Button>
            )}
            {props.status !== undefined && props.status === 'Private' && (
              <Button
                variant="outline"
                title="Make Publix"
                onClick={() => ChangeStatus('Public')}
                className="text-foreground"
              >
                <FontAwesomeIcon className="icon" icon={faEye} />
              </Button>
            )}
            {props.status !== undefined && props.status !== 'archived' && (
              <Button
                variant="outline"
                title="Delete"
                onClick={() => ChangeStatus('Delete')}
                className="text-foreground"
              >
                <FontAwesomeIcon className="icon" icon={faTrash} />
              </Button>
            )}
            {!disabled && (
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={disabled}
                asChild
              >
                <div>
                  <FontAwesomeIcon className="icon mr-[5px]" icon={faSave} />
                  Save
                </div>
              </Button>
            )}
          </div>
        </section>
      </section>
      <Separator />
      <section className="relative mx-auto w-full max-w-[1754px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-8 px-4 py-8"
          >
            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Title and meta description</b>
                </p>
                <p>
                  The title and meta description help define how your store
                  shows up on search engines.
                </p>
              </aside>
              <aside className="bg-layer-one flex w-full flex-1 flex-col gap-8 rounded p-8 drop-shadow">
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
                          placeholder="Tell us a little bit about this product..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </aside>
            </section>

            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Images</b>
                </p>
                <p className="pb-4">
                  These will be the images used to show off your product.
                </p>
                {productImages.length <= 6 ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      form.setFocus('product_images');
                      productImagesRef.current?.click();
                    }}
                    asChild
                  >
                    <div>
                      <FontAwesomeIcon
                        className="icon mr-2"
                        icon={faSquarePlus}
                      />
                      Add Image
                    </div>
                  </Button>
                ) : (
                  <></>
                )}

                <FormField
                  control={form.control}
                  name="product_images"
                  render={({ field: { onChange }, ...field }) => {
                    // Get current images value (always watched updated)
                    const images = form.watch('product_images');

                    return (
                      <FormItem className="pt-4">
                        <FormControl>
                          <>
                            <Input
                              type="file"
                              accept={ALLOWED_IMAGE_TYPES.join(',')}
                              hidden={true}
                              className="hidden"
                              ref={productImagesRef}
                              disabled={form.formState.isSubmitting}
                              {...field}
                              onChange={(event) => {
                                // Triggered when user uploaded a new file
                                // FileList is immutable, so we need to create a new one
                                const dataTransfer = new DataTransfer();

                                // Add old images
                                if (images) {
                                  Array.from(images).forEach((image) =>
                                    dataTransfer.items.add(image)
                                  );
                                }

                                // Add newly uploaded images
                                Array.from(event.target.files!).forEach(
                                  (image) => dataTransfer.items.add(image)
                                );

                                // Validate and update uploaded file
                                const newFiles = dataTransfer.files;
                                if (newFiles.length > 0) {
                                  setProductImages([
                                    ...productImages,
                                    {
                                      id: newFiles.length - 1,
                                      image: URL.createObjectURL(
                                        newFiles[newFiles.length - 1]
                                      ),
                                    },
                                  ]);
                                  setProductImageFiles([
                                    ...productImageFiles,
                                    newFiles[newFiles.length - 1],
                                  ]);
                                }
                                onChange(newFiles);
                              }}
                            />
                          </>
                        </FormControl>
                        <FormDescription>
                          For best results we suggest an image that is 1000x1000
                          pixels.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </aside>
              <aside className="bg-layer-one flex w-full flex-1 flex-col gap-8 overflow-x-auto rounded p-8 drop-shadow">
                <DraggableImages
                  product_images={productImages}
                  product_image_files={productImageFiles}
                  product_images_removals={productImageRemovals}
                  remove={resetImages}
                />
              </aside>
            </section>

            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Digital File</b>
                </p>
                <p className="pb-4">
                  This will be the file sent to the customer once purchased.
                </p>
                {digitalFile === '' ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      form.setFocus('digital_file');
                      digitalFileRef.current?.click();
                    }}
                    asChild
                  >
                    <div>
                      <FontAwesomeIcon
                        className="icon mr-2"
                        icon={faSquarePlus}
                      />
                      Add File
                    </div>
                  </Button>
                ) : (
                  <></>
                )}

                <FormField
                  control={form.control}
                  name="digital_file"
                  render={({ field: { onChange }, ...field }) => {
                    // Get current images value (always watched updated)
                    const images = form.watch('digital_file');

                    return (
                      <FormItem>
                        <FormControl>
                          {digitalFile === '' ? (
                            <Input
                              type="file"
                              hidden={true}
                              className="hidden"
                              ref={digitalFileRef}
                              disabled={form.formState.isSubmitting}
                              {...field}
                              onChange={(event) => {
                                // Triggered when user uploaded a new file
                                // FileList is immutable, so we need to create a new one
                                const dataTransfer = new DataTransfer();

                                // Add old images
                                if (images) {
                                  Array.from(images).forEach((image) =>
                                    dataTransfer.items.add(image)
                                  );
                                }

                                // Add newly uploaded images
                                Array.from(event.target.files!).forEach(
                                  (image) => dataTransfer.items.add(image)
                                );

                                // Validate and update uploaded file
                                const newFiles = dataTransfer.files;
                                if (newFiles.length > 0) {
                                  setDigitalFile(newFiles[0].name);
                                  setDigitalFileName(newFiles[0].name);
                                }
                                onChange(newFiles);
                              }}
                            />
                          ) : (
                            <></>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </aside>
              <aside className="bg-layer-one flex w-full flex-1 flex-col gap-8 rounded p-8 drop-shadow">
                {digitalFile === '' ? (
                  <section className="flex flex-col">
                    <p>
                      <b>No File Yet</b>
                    </p>
                    <p className="text-sm">
                      Add a file to send to your customers.
                    </p>
                  </section>
                ) : (
                  <section className="flex items-center gap-8">
                    <section className="flex flex-col items-center justify-center">
                      <FontAwesomeIcon
                        className="icon mb-4 text-8xl"
                        icon={faFile}
                      />
                      <p>{digitalFileName}</p>
                    </section>
                    <Button
                      asChild
                      variant="destructive"
                      onClick={clearDigitalFile}
                    >
                      <p>
                        <FontAwesomeIcon
                          className="icon text-xs"
                          icon={faRefresh}
                        />
                      </p>
                    </Button>
                  </section>
                )}
              </aside>
            </section>

            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Options and Pricing</b>
                </p>
                <p>
                  These options will help define your product and make them
                  searchable.
                </p>
              </aside>
              <aside className="bg-layer-one flex w-full flex-1 flex-col gap-8 rounded p-8 drop-shadow">
                <section className="flex w-full flex-col gap-8 md:flex-row">
                  <FormField
                    control={form.control}
                    name="prices.price"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="price"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prices.compare_at"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormLabel>Compare At Price</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="compare_at"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a currency type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currency_list.map((item) => {
                              return (
                                <SelectItem value={item.value} key={item.value}>
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          onChangeCapture={field.onChange}
                          id="tags"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use commas to seperate different tags.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          onChangeCapture={field.onChange}
                          id="tags"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </aside>
            </section>
          </form>
        </Form>
      </section>
    </section>
  );
}
