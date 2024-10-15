'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { currency_list } from '@/lib/currencyList';
import { db, storage } from '@/lib/firebase';
import { Option, ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import {
  faCaretLeft,
  faEllipsis,
  faEye,
  faSave,
  faSquareUpRight,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  collection,
  doc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { goTo, revalidate } from './actions';
import AddOptionDrawer from './addOptionDrawer';
import { AiDescriptionWriter } from './aiDescriptionWriter';
import DraggableImages from './draggableImages';
import { ShipFromSelect } from './ShipFrom';

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
    .max(256, {
      message: 'Product name must be no more than 256 characters long',
    }),
  description: z.string().optional(),
  product_type: z
    .string()
    .min(1, { message: 'Product Type name must be 6 or more characters long' })
    .max(32, {
      message: 'Product Type name must be no more than 32 characters long',
    }),
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
  prices: z
    .object({
      price: z
        .union([
          z.coerce
            .number({
              message: 'Price must be a number',
            })
            .gte(0, {
              message: 'Price must be positive',
            }),
          z.literal('').optional(),
        ])
        .optional(),
      compare_at: z
        .union([
          z.coerce
            .number({
              message: 'Compare at Price must be a number',
            })
            .gte(0, {
              message: 'Compare at Price must be positive',
            }),
          z.literal('').optional(),
        ])
        .optional(),
    })
    .optional(),
  currency: z.enum(['', ...currencyTypes], {
    required_error: 'You need to select a collection type.',
  }),
  tags: z.string().optional(),
  sku: z.string().optional(),
  is_featured: z.boolean().default(false),
  track_inventory: z.boolean().default(false),
  inventory: z.union([
    z.coerce
      .number({
        message: 'Inventory must be a number',
      })
      .gte(0, {
        message: 'Inventory must be positive',
      }),
    z.literal(''),
  ]),
  weight: z.union([
    z.coerce
      .number({
        message: 'Inventory must be a number',
      })
      .positive({
        message: 'Inventory must be positive',
      }),
    z.literal(''),
  ]),
  weight_units: z.enum(['', 'pound', 'ounce', 'gram', 'kilogram'], {
    required_error: 'You need to select a Weight type.',
  }),
  height: z.union([
    z.coerce
      .number({
        message: 'Inventory must be a number',
      })
      .positive({
        message: 'Inventory must be positive',
      }),
    z.literal(''),
  ]),
  width: z.union([
    z.coerce
      .number({
        message: 'Inventory must be a number',
      })
      .positive({
        message: 'Inventory must be positive',
      }),
    z.literal(''),
  ]),
  length: z.union([
    z.coerce
      .number({
        message: 'Inventory must be a number',
      })
      .positive({
        message: 'Inventory must be positive',
      }),
    z.literal(''),
  ]),
  dimension_units: z.enum(['', 'inch', 'centimeter'], {
    required_error: 'You need to select a Dimension type.',
  }),
  ship_from: z.string({
    required_error: 'Please select a Ship From Address.',
  }),
  variant: z
    .array(
      z.object({
        prices: z.object({
          price: z
            .union([
              z.coerce
                .number({
                  message: 'Price must be a number',
                })
                .gte(0, {
                  message: 'Price must be positive',
                }),
              z.literal(''),
            ])
            .optional(),
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
        }),
        inventory: z
          .union([
            z.coerce
              .number({
                message: 'Inventory must be a number',
              })
              .gte(0, {
                message: 'Inventory must be positive',
              }),
            z.literal(''),
          ])
          .optional(),
      })
    )
    .optional(),
});
type Props = {
  storeID: string;
  userID: string;
  docID?: string;
  name?: string;
  description?: string;
  product_type?: string;
  product_images?: ProductImage[];
  price?: number;
  compare_at?: number;
  currency?: string;
  tags?: string[];
  sku?: string;
  is_featured?: boolean;
  track_inventory?: boolean;
  inventory?: number;
  status?: string;
  ship_from_address?: string;
  weight?: {
    units: 'pound' | 'ounce' | 'gram' | 'kilogram' | undefined;
    value: number;
  };
  dimensions?: {
    units: 'inch' | 'centimeter' | undefined;
    height: number;
    width: number;
    length: number;
  };
  variants?: {
    name: string;
    price: number;
    compare_at: number;
    inventory: number;
  }[];
  options?: Option[];
};

export default function SelfEditForm(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const productImagesRef = React.useRef<HTMLInputElement>(null);
  const [productImages, setProductImages] = React.useState<ProductImage[]>([]);
  const [productImageRemovals, setProductImageRemovals] = React.useState<
    string[]
  >([]);

  const [tags, setTags] = React.useState<string[]>([]);
  const [options, setOptions] = React.useState<Option[]>([]);
  const [removeOptions, setRemoveOptions] = React.useState<string[]>([]);
  const [variants, setVariants] = React.useState<string[]>([]);
  const [trackInventory, setTrackInventory] = React.useState<boolean>(false);
  const [address, setAddress] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>('');
  const [uploadFile, uploading, snapshot, uploadError] = useUploadFile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name || '',
      description: props.description || '',
      product_type: props.product_type || '',
      product_images: undefined,
      prices: {
        price: props.price || 0.0,
        compare_at: props.compare_at || 0.0,
      },
      tags: props.tags?.join(',') || '',
      currency: props.currency || 'USD',
      sku: props.sku || '',
      is_featured: props.is_featured || false,
      track_inventory: props.track_inventory || false,
      inventory: props.inventory || 0,
      weight: props.weight?.value || 0,
      weight_units: props.weight?.units || 'pound',
      height: props.dimensions?.height || 0,
      width: props.dimensions?.width || 0,
      length: props.dimensions?.length || 0,
      dimension_units: props.dimensions?.units || 'inch',
      ship_from: props.ship_from_address || '',
    },
  });

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

  function validatePrices() {
    let price = form.getValues('prices.price');
    let compare_at = form.getValues('prices.compare_at');
    const uploadVariants: any = [];
    let has_errors = false;
    if (variants.length === 0) {
      if (price === '' || (price as number) <= 0) {
        form.setError('prices.price', {
          message: 'Price must be a positive number',
        });
        has_errors = true;
      }

      if (compare_at === '') {
        form.setValue('prices.compare_at', 0.0);
        compare_at = 0.0;
      }
      if ((price! as number) <= compare_at!) {
        form.setError('prices.compare_at', {
          message: 'Compare At must be a less than Price',
        });
        has_errors = true;
      }
    } else {
      variants.map((variant, index) => {
        let variant_price = form.getValues(`variant.${index}.prices.price`);
        let variant_compare_at = form.getValues(
          `variant.${index}.prices.compare_at`
        );
        let variant_inventory = form.getValues(`variant.${index}.inventory`);
        if (
          variant_price === undefined ||
          variant_price === '' ||
          (variant_price as number) <= 0
        ) {
          form.setError(`variant.${index}.prices.price`, {
            message: 'Price must be a positive number',
          });
          has_errors = true;
        }
        if (variant_compare_at === undefined || variant_compare_at === '') {
          form.setValue(`variant.${index}.prices.compare_at`, 0);
          variant_compare_at = 0;
        }
        if (
          parseFloat(variant_price!.toString()) <=
          parseFloat(variant_compare_at!.toString())!
        ) {
          form.setError(`variant.${index}.prices.compare_at`, {
            message: 'Compare At must be a less than Price',
          });
          has_errors = true;
        }
        if (
          price == 0 ||
          (variant_price !== undefined &&
            variant_price !== '' &&
            parseFloat(variant_price!.toString()) <
              parseFloat(price!.toString()))
        ) {
          price = variant_price;
        }
        if (
          variant_compare_at !== undefined &&
          parseFloat(variant_compare_at!.toString()) >
            parseFloat(compare_at!.toString())
        ) {
          compare_at = variant_compare_at;
        }
        if (!trackInventory) {
          variant_inventory = 1;
        } else if (
          variant_inventory === undefined ||
          variant_inventory === ''
        ) {
          form.setError(`variant.${index}.inventory`, {
            message: 'Inventory must be a number',
          });
          has_errors = true;
        }
        uploadVariants.push({
          name: variant,
          price: variant_price,
          compare_at: variant_compare_at,
          inventory: variant_inventory,
        });
      });
    }
    if (has_errors) {
      return {
        price: price,
        compare_at: compare_at,
        uploadVariants: uploadVariants,
        error: has_errors,
      };
    }
    form.clearErrors('prices.price');
    form.clearErrors('prices.compare_at');
    form.clearErrors('variant');
    return {
      price: price,
      compare_at: compare_at,
      uploadVariants: uploadVariants,
      error: false,
    };
  }

  async function onSubmit() {
    setDisabled(true);
    try {
      const { price, compare_at, uploadVariants, error } = validatePrices();
      if (error) {
        setDisabled(false);
        toast.error('Error Saving', {
          description:
            'There was an error saving your product. Please try again.',
        });
        return;
      }
      const collectionReference: CollectionReference = collection(
        db,
        'products'
      );
      let docRef: DocumentReference = doc(collectionReference);
      if (props.docID !== undefined) {
        docRef = doc(collectionReference, props.docID);
      }
      const imageFileUrls: string[] = await uploadImages(docRef.id);
      const batch = writeBatch(db);
      const tags = form.getValues('tags')?.split(',') || [];
      tags.map((tag) => {
        tag = tag.trim();
      });
      if (props.docID !== undefined) {
        batch.update(docRef, {
          name: form.getValues('name'),
          images: imageFileUrls,
          description: form.getValues('description') || '',
          product_type: form.getValues('product_type'),
          price: parseFloat(price! as string).toFixed(2) as unknown as number,
          compare_at: parseFloat(compare_at! as string).toFixed(
            2
          ) as unknown as number,
          currency: form.getValues('currency'),
          tags: tags,
          inventory: form.getValues('inventory') as number,
          track_inventory: trackInventory,
          is_featured: form.getValues('is_featured'),
          weight: {
            units: form.getValues('weight_units'),
            value: form.getValues('weight'),
          },
          dimensions: {
            height: form.getValues('height'),
            width: form.getValues('width'),
            length: form.getValues('length'),
            units: form.getValues('dimension_units'),
          },
          ship_from_address: address,
          updated_at: Timestamp.fromDate(new Date()),
          sku: form.getValues('sku'),
          status: status,
          colors: [],
        });

        uploadVariants.map(
          (
            variant: {
              name: string;
              price: number;
              compare_at: number;
              inventory: number;
            },
            index: number
          ) => {
            let newValue = true;
            props.variants?.map((importedVariant) => {
              if (importedVariant.name === variant.name) {
                newValue = false;
              }
            });
            if (newValue) {
              const variantRef: DocumentReference = doc(
                db,
                `products/${docRef.id}/variants`,
                variant.name
              );
              batch.set(variantRef, {
                name: variant.name,
                price: parseFloat(variant.price.toString()).toFixed(
                  2
                ) as unknown as number,
                compare_at: parseFloat(variant.compare_at.toString()).toFixed(
                  2
                ) as unknown as number,
                inventory: variant.inventory as number,
                index: index as number,
                owner_id: props.userID,
                created_at: Timestamp.fromDate(new Date()),
                updated_at: Timestamp.fromDate(new Date()),
              });
            } else {
              const variantRef: DocumentReference = doc(
                db,
                `products/${props.docID}/variants`,
                variant.name
              );
              batch.update(variantRef, {
                price: parseFloat(variant.price.toString()).toFixed(
                  2
                ) as unknown as number,
                compare_at: parseFloat(variant.compare_at.toString()).toFixed(
                  2
                ) as unknown as number,
                inventory: variant.inventory as number,
                index: index as number,
                updated_at: Timestamp.fromDate(new Date()),
                owner_id: props.userID,
              });
            }
          }
        );
        options.map((option, index) => {
          if (option.id) {
            let optionRef: DocumentReference = doc(
              db,
              `products/${props.docID}/options`,
              option.id!
            );
            batch.update(optionRef, {
              name: option.name,
              options: option.options,
              index: index as number,
              owner_id: props.userID,
            });
          } else {
            const optionRef: CollectionReference = collection(
              db,
              `products/${docRef.id}/options`
            );
            let optionDocRef: DocumentReference = doc(optionRef);
            batch.set(optionDocRef, {
              name: option.name,
              options: option.options,
              index: index as number,
              owner_id: props.userID,
            });
          }
        });
        removeOptions.map((option) => {
          const deleteRef: DocumentReference = doc(
            db,
            `products/${props.docID}/options`,
            option
          );
          batch.delete(deleteRef);
        });
        props.variants?.map((variant) => {
          if (!variants.includes(variant.name)) {
            const variantRef: DocumentReference = doc(
              db,
              `products/${docRef.id}/variants`,
              variant.name
            );
            batch.delete(variantRef);
          }
        });
      } else {
        batch.set(docRef, {
          name: form.getValues('name'),
          images: imageFileUrls,
          vendor: 'self',
          vendor_id: '',
          description: form.getValues('description') || '',
          price: parseFloat(price! as string).toFixed(2) as unknown as number,
          compare_at: parseFloat(compare_at! as string).toFixed(
            2
          ) as unknown as number,
          currency: form.getValues('currency'),
          inventory: form.getValues('inventory') as number,
          track_inventory: trackInventory,
          weight: {
            units: form.getValues('weight_units'),
            value: form.getValues('weight') as number,
          },
          dimensions: {
            height: form.getValues('height') as number,
            width: form.getValues('width') as number,
            length: form.getValues('length') as number,
            units: form.getValues('dimension_units'),
          },
          ship_from_address: address,
          status: 'Public',
          tags: form.getValues('tags')?.replace(/ /g, '').split(',') || [],
          admin_tags: [],
          like_count: 0,
          product_type: form.getValues('product_type'),
          store_id: props.storeID,
          owner_id: props.userID,
          digital_file: null,
          digital_file_name: null,
          units_sold: 0,
          is_featured: form.getValues('is_featured'),
          created_at: Timestamp.fromDate(new Date()),
          updated_at: Timestamp.fromDate(new Date()),
          colors: [],
          sku: form.getValues('sku'),
          revenue: 0,
          view_count: 0,
          service_percent: 0.1,
        });
        uploadVariants.map(
          (
            variant: {
              name: string;
              price: number;
              compare_at: number;
              inventory: number;
            },
            index: number
          ) => {
            const variantRef: DocumentReference = doc(
              db,
              `products/${docRef.id}/variants`,
              variant.name
            );
            batch.set(variantRef, {
              name: variant.name,
              price: parseFloat(variant.price.toString()).toFixed(
                2
              ) as unknown as number,
              compare_at: parseFloat(variant.compare_at.toString()).toFixed(
                2
              ) as unknown as number,
              inventory: variant.inventory as number,
              index: index as number,
              owner_id: props.userID,
              created_at: Timestamp.fromDate(new Date()),
              updated_at: Timestamp.fromDate(new Date()),
            });
          }
        );
        options.map((option, index) => {
          const optionRef: CollectionReference = collection(
            db,
            `products/${docRef.id}/options`
          );
          let optionDocRef: DocumentReference = doc(optionRef);
          batch.set(optionDocRef, {
            name: option.name,
            options: option.options,
            index: index as number,
            owner_id: props.userID,
          });
        });
      }

      await batch.commit();
      setDisabled(false);
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
      setDisabled(false);
      console.error(error);
      toast.error('Error Saving', {
        description:
          'There was an error saving your product. Please try again.',
      });
    }
  }

  function removeImage(index: number) {
    const newProductImages = productImages.slice(0);
    const newProductImageRemovals = productImageRemovals.slice(0);
    if (
      newProductImages[index].image.includes('firebasestorage.googleapis.com')
    ) {
      newProductImageRemovals.push(newProductImages[index].image);
    }
    newProductImages.splice(index, 1);
    setProductImages(newProductImages);
    setProductImageRemovals(newProductImageRemovals);
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

  function removeOption(index: number) {
    const newRemoveList = removeOptions.slice(0);
    if (options[index].id) {
      newRemoveList.push(options[index].id!);
      setRemoveOptions(newRemoveList);
    }
    const newOptionsList = options.slice(0);
    newOptionsList.splice(index, 1);
    setOptions(newOptionsList);
  }

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
  React.useEffect(() => {
    if (props.ship_from_address) {
      setAddress(props.ship_from_address);
    }
  }, [props.ship_from_address]);
  React.useEffect(() => {
    if (props.track_inventory) {
      setTrackInventory(props.track_inventory);
    }
  }, [props.track_inventory]);
  React.useEffect(() => {
    if (props.options) {
      setOptions(props.options);
      if (props.variants) {
        props.variants.map((variant, index) => {
          form.setValue(`variant.${index}.prices.price`, variant.price);
          form.setValue(
            `variant.${index}.prices.compare_at`,
            variant.compare_at
          );
          form.setValue(`variant.${index}.inventory`, variant.inventory);
        });
      }
    }
  }, [props.options]);
  React.useEffect(() => {
    if (!trackInventory) {
      if ((form.getValues('inventory') as number) < 1) {
        form.setValue('inventory', 1);
      }

      if (variants.length > 0) {
        variants.map((item, index) => {
          if ((form.getValues(`variant.${index}.inventory`) as number) < 1) {
            form.setValue(`variant.${index}.inventory`, 1);
          }
        });
      }
    }
  }, [trackInventory]);
  React.useEffect(() => {
    let newVariantsList: string[] = [];
    if (options.length === 1) {
      newVariantsList = options[0].options;
    } else if (options.length === 2) {
      options[0].options.map((firstItem: string) => {
        options[1].options.map((secondItem: string) => {
          newVariantsList.push(`${firstItem}-${secondItem}`);
        });
      });
    }
    setVariants(newVariantsList);
  }, [options]);

  return (
    <section className="relative">
      <section className="mx-auto w-full max-w-[1754px]">
        <section className="flex w-full items-center justify-between gap-4 p-4">
          {props.name !== undefined ? (
            <section className="flex w-auto items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/products">
                      <FontAwesomeIcon className="icon" icon={faCaretLeft} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to Products</p>
                </TooltipContent>
              </Tooltip>
              <h1 className="line-clamp-1">{props.name}</h1>
            </section>
          ) : (
            <h1 className="line-clamp-1">Add Product</h1>
          )}
          <div className="flex w-auto items-center gap-4">
            {props.status !== undefined && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-foreground"
                  >
                    <FontAwesomeIcon className="icon" icon={faEllipsis} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[175px] px-0">
                  <DropdownMenuItem className="px-0">
                    {props.status !== 'archived' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Product"
                        asChild
                        className="flex h-auto w-full justify-start py-0 text-foreground"
                      >
                        <Link href={`/product/${props.docID}`}>
                          <FontAwesomeIcon
                            className="icon mr-4"
                            icon={faSquareUpRight}
                          />
                          View Product
                        </Link>
                      </Button>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-0">
                    {props.status !== undefined &&
                      props.status === 'Public' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Make Private"
                          onClick={() => ChangeStatus('Private')}
                          className="flex h-auto w-full justify-start py-0 text-foreground"
                        >
                          <FontAwesomeIcon
                            className="icon mr-4"
                            icon={faEyeSlash}
                          />
                          Make Private
                        </Button>
                      )}
                    {props.status !== undefined &&
                      props.status === 'Private' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Make Publix"
                          onClick={() => ChangeStatus('Public')}
                          className="flex h-auto w-full justify-start py-0 text-foreground"
                        >
                          <FontAwesomeIcon className="icon mr-4" icon={faEye} />
                          Make Public
                        </Button>
                      )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-0">
                    {props.status !== 'archived' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete"
                        onClick={() => ChangeStatus('Delete')}
                        className="flex h-auto w-full justify-start py-0 text-foreground"
                      >
                        <FontAwesomeIcon className="icon mr-4" icon={faTrash} />
                        Delete
                      </Button>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!disabled && (
              <Button
                type="submit"
                size="sm"
                onClick={form.handleSubmit(onSubmit)}
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
              <aside className="flex w-full flex-1 flex-col gap-8 rounded bg-layer-one p-8 drop-shadow">
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
                      <FormDescription>
                        Having trouble writing a description? Use Ai to help...{' '}
                        <AiDescriptionWriter />
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Product Type</FormLabel>
                      <FormControl>
                        <Input
                          onChangeCapture={field.onChange}
                          id="product_type"
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
                <p>These will be the images used to show off your product.</p>
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
              <aside className="flex w-full flex-1 flex-col gap-8 overflow-x-auto rounded bg-layer-one p-4 drop-shadow">
                {productImages.length === 0 && (
                  <section className="grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-5 md:grid-rows-2">
                    <section className="col-span-2 row-span-2 aspect-square w-full">
                      <section className="flex aspect-square items-center justify-center overflow-hidden rounded bg-layer-three">
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            productImagesRef.current?.click();
                          }}
                          className="h-full w-full rounded bg-layer-three text-foreground hover:bg-layer-four"
                        >
                          <p className="text-4xl">
                            <FontAwesomeIcon className="icon" icon={faUpload} />
                          </p>
                        </Button>
                      </section>
                    </section>
                  </section>
                )}
                {productImages.length === 1 && (
                  <section className="grid grid-cols-2 grid-rows-3 gap-4 md:grid-cols-5 md:grid-rows-2">
                    <section className="col-span-2 row-span-2 aspect-square w-full">
                      <section className="relative flex aspect-square items-center justify-center overflow-hidden rounded bg-layer-three">
                        <section className="absolute right-[2px] top-[2px]">
                          <Button
                            size="sm"
                            onClick={(event) => {
                              event.preventDefault();
                              removeImage(productImages[0].id);
                            }}
                            className="h-auto border-destructive bg-destructive p-2 text-destructive-foreground hover:bg-destructive"
                          >
                            <FontAwesomeIcon className="icon" icon={faTrash} />
                          </Button>
                        </section>
                        <Image
                          src={productImages[0].image}
                          height={400}
                          width={400}
                          alt="Main Product Image"
                        />
                      </section>
                    </section>
                    <section
                      className="slot col-start-1 row-start-3 aspect-square md:col-start-3 md:row-start-1"
                      data-swapy-slot="2"
                    >
                      <section className="flex aspect-square items-center justify-center overflow-hidden rounded bg-layer-three">
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            productImagesRef.current?.click();
                          }}
                          className="h-full w-full rounded bg-layer-three text-foreground hover:bg-layer-four"
                        >
                          <p className="text-4xl">
                            <FontAwesomeIcon className="icon" icon={faUpload} />
                          </p>
                        </Button>
                      </section>
                    </section>
                  </section>
                )}
                {productImages.length > 1 && (
                  <DraggableImages
                    product_images={productImages}
                    uploadRef={productImagesRef}
                    removeImage={removeImage}
                    reOrderImages={setProductImages}
                  />
                )}
              </aside>
            </section>

            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Pricing and Currency</b>
                </p>
                <p>
                  These options will help define your product and make them
                  searchable.
                </p>
              </aside>
              <aside className="flex w-full flex-1 flex-col gap-8 rounded bg-layer-one p-8 drop-shadow">
                <section className="flex w-full flex-col gap-8 md:flex-row">
                  <FormField
                    control={form.control}
                    name="prices.price"
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          'w-full flex-1',
                          variants.length > 0 ? 'hidden' : 'block'
                        )}
                      >
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
                      <FormItem
                        className={cn(
                          'w-full flex-1',
                          variants.length > 0 ? 'hidden' : 'block'
                        )}
                      >
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
              </aside>
            </section>

            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Variants</b>
                </p>
                <p>
                  These options will help define your product and make them
                  searchable.
                </p>
              </aside>
              <aside className="flex w-full flex-1 flex-col gap-8 rounded bg-layer-one p-8 drop-shadow">
                <section className="flex w-full items-center justify-between gap-8">
                  <p>
                    <b>Options</b>
                  </p>
                  {options.length < 2 && (
                    <AddOptionDrawer
                      optionList={options}
                      setOptions={setOptions}
                    />
                  )}
                </section>
                {options.length === 0 ? (
                  <p className="text-sm">No options created.</p>
                ) : (
                  <>
                    {options.map((item, index) => (
                      <section
                        className="flex w-full items-center gap-4"
                        key={index}
                      >
                        <aside className="flex flex-1 flex-col gap-4">
                          <p>{item.name}</p>
                          <div className="flex w-full gap-4">
                            {item.options.map((opt, i) => {
                              return (
                                <span
                                  className="rounded bg-layer-four px-2.5 py-0.5 text-xs font-medium text-background"
                                  key={i}
                                >
                                  {opt}
                                </span>
                              );
                            })}
                          </div>
                        </aside>
                        <aside>
                          <AddOptionDrawer
                            optionList={options}
                            setOptions={setOptions}
                            name={item.name}
                            index={index}
                            id={item.id!}
                            options={item.options.join(',')}
                          />
                        </aside>
                        <aside>
                          <Button
                            variant="destructive"
                            size="icon"
                            type="button"
                            className="text-xl"
                            onClick={(event) => {
                              event.preventDefault();
                              removeOption(index);
                            }}
                            asChild
                          >
                            <p className="text-lg">
                              <FontAwesomeIcon
                                className="icon"
                                icon={faTrash}
                              />
                            </p>
                          </Button>
                        </aside>
                      </section>
                    ))}
                  </>
                )}
                <Separator />
                <section className="flex w-full items-center justify-between gap-8">
                  <p>
                    <b>Variants</b>
                  </p>
                </section>
                {variants.length === 0 ? (
                  <p className="text-sm">Add options to create variants.</p>
                ) : (
                  <>
                    {variants.map((variant, index) => (
                      <div
                        key={`variant-${index}`}
                        className="grid w-full flex-1 grid-cols-4 items-center gap-8"
                      >
                        <p>{variant}</p>
                        <div className="col-span-4 grid grid-cols-6 gap-8 md:col-span-3">
                          <div className="col-span-3 md:col-span-2">
                            <FormField
                              control={form.control}
                              name={`variant.${index}.prices.price`}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>Price</FormLabel>
                                  <FormControl>
                                    <Input
                                      onChangeCapture={field.onChange}
                                      id={`variant.${index}.prices.price`}
                                      type="number"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="col-span-3 md:col-span-2">
                            <FormField
                              control={form.control}
                              name={`variant.${index}.prices.compare_at`}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>Compare At</FormLabel>
                                  <FormControl>
                                    <Input
                                      onChangeCapture={field.onChange}
                                      id={`variant.${index}.prices.compare_at`}
                                      type="number"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div
                            className={cn(
                              'col-span-6 md:col-span-2',
                              !trackInventory ? 'hidden' : 'block'
                            )}
                          >
                            <FormField
                              control={form.control}
                              name={`variant.${index}.inventory`}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>Inventory</FormLabel>
                                  <FormControl>
                                    <Input
                                      onChangeCapture={field.onChange}
                                      id={`variant.${index}.inventory`}
                                      type="number"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </aside>
            </section>

            <section className="flex flex-col gap-8 md:flex-row">
              <aside className="w-full md:w-[200px] lg:w-[300px] xl:w-[600px]">
                <p className="pb-4">
                  <b>Options</b>
                </p>
                <p>
                  These options will help define your product and make them
                  searchable.
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
                          id="sku"
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
                <FormField
                  control={form.control}
                  name="track_inventory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(event: any) => {
                            field.onChange(event);
                            setTrackInventory(!field.value);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Track Inventory</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        'w-full',
                        !trackInventory || variants.length > 0
                          ? 'hidden'
                          : 'block'
                      )}
                    >
                      <FormLabel>Inventory</FormLabel>
                      <FormControl>
                        <Input
                          onChangeCapture={field.onChange}
                          id="inventory"
                          type="number"
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
                  <b>Shipping</b>
                </p>
                <p>
                  These options will help define your products shipping
                  settings.
                </p>
              </aside>
              <aside className="flex w-full flex-1 flex-col gap-8 rounded bg-layer-one p-8 drop-shadow">
                <section className="flex w-full flex-col gap-8 md:flex-row">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="weight"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight_units"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormLabel>Weight Units</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a weight unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pound" key="pound">
                              LBS
                            </SelectItem>
                            <SelectItem value="ounce" key="ounce">
                              OZ
                            </SelectItem>
                            <SelectItem value="gram" key="gram">
                              GM
                            </SelectItem>
                            <SelectItem value="kilogram" key="kilogram">
                              KG
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
                <section className="flex w-full flex-col gap-8 md:flex-row">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="length"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="width"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="height"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimension_units"
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormLabel>Measurment Units</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a weight unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="inch" key="inch">
                              IN
                            </SelectItem>
                            <SelectItem value="centimeter" key="centimeter">
                              CM
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
                <ShipFromSelect
                  userID={props.userID}
                  address={props.ship_from_address}
                  setAddress={setAddress}
                  form={form}
                />
              </aside>
            </section>
          </form>
        </Form>
      </section>
    </section>
  );
}
