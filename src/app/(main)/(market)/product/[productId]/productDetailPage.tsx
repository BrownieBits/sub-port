'use client';
import { LikeButton } from '@/components/sp-ui/LikeButton';
import { ShowAvatar } from '@/components/sp-ui/ShowAvatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { useSidebar } from '@/components/ui/sidebar';
import { analytics, db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import cartStore from '@/stores/cartStore';
import userStore from '@/stores/userStore';
import { faFlag, faShare, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { logEvent } from 'firebase/analytics';
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  doc,
  runTransaction,
} from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ProductComments from './comments/productComments';
import ProductImages from './productImages';
import ProductLoading from './productLoading';
import RelatedProducts from './relatedProducts';
import { ShowDetails } from './showDetails';
import { options, variants } from './typedef';

const formSchema = z.object({
  quantity: z.union([
    z.coerce
      .number({
        message: 'Quantity must be a number',
      })
      .gt(0, {
        message: 'Quantity must be positive',
      }),
    z.literal(''),
  ]),
  options: z
    .array(
      z.object({
        option: z.string().optional(),
      })
    )
    .optional(),
});

type Props = {
  store_id: string;
  avatar: string | null;
  store_name: string;
  subscription_count: number;
  images: string[];
  product_name: string;
  product_type: string;
  price: number;
  compare_at: number;
  currency: string;
  product_id: string;
  product_description: string;
  tags: string[];
  like_count: number;
  options: options[];
  variants: variants[];
  created_at_seconds: number;
  created_at_nanoseconds: number;
  view_count: number;
  track_inventory: boolean;
  inventory: number;
  country: string;
  city: string;
  region: string;
  ip: string;
};

export default function ProductDetailPage(props: Props) {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const cart_loaded = cartStore((state) => state.cart_loaded);
  const cart_id = cartStore((state) => state.cart_id);
  const setShipmentsReady = cartStore((state) => state.setShipmentsReady);
  const [thinking, setThinking] = React.useState<boolean>(false);
  const [maxQuantity, setMaxQuantity] = React.useState<number>();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [price, setPrice] = React.useState<number>(0.0);
  const [compareAt, setCompareAt] = React.useState<number>(0.0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { setOpen } = useSidebar();
  async function onSubmit() {
    setThinking(true);
    try {
      const quantity = form.getValues('quantity') as number;
      let docID = props.product_id;
      if (props.options.length > 0) {
        docID += `_${selectedOptions.join('_')}`;
      }
      const cartItemRef: DocumentReference = doc(
        db,
        `carts/${cart_id}/items`,
        docID
      );
      await runTransaction(db, async (transaction) => {
        const cartItemDoc = await transaction.get(cartItemRef);
        if (!cartItemDoc.exists()) {
          transaction.set(cartItemRef, {
            quantity: quantity,
            options: selectedOptions,
            store_id: props.store_id,
            created_at: Timestamp.fromDate(new Date()),
          });
        } else {
          const newQuantity = cartItemDoc.data()?.quantity + quantity;
          await transaction.update(cartItemRef, { quantity: newQuantity });
        }
      });

      const cartRef: DocumentReference = doc(db, `carts`, cart_id);

      await runTransaction(db, async (transaction) => {
        const cartItemDoc = await transaction.get(cartRef);
        if (!cartItemDoc.exists()) {
          transaction.set(cartRef, {
            address: null,
            billing_address: null,
            email: '',
            payment_intent: null,
            shipments: null,
            shipments_ready: false,
            created_at: Timestamp.fromDate(new Date()),
            updated_at: Timestamp.fromDate(new Date()),
          });
        } else {
          await transaction.update(cartRef, {
            updated_at: Timestamp.fromDate(new Date()),
          });
        }
      });

      const analyticsColRef: CollectionReference = collection(
        db,
        `stores/${props.store_id}/analytics`
      );
      await addDoc(analyticsColRef, {
        type: 'cart_add',
        product_id: props.product_id,
        quantity: quantity,
        options: selectedOptions,
        store_id: props.store_id,
        user_id: user_id !== '' ? user_id : null,
        country: props.country,
        city: props.city,
        region: props.region,
        ip: props.ip,
        created_at: Timestamp.fromDate(new Date()),
      });
      setShipmentsReady(false);
      toast.success(`${props.product_name} Added to Cart!`, {
        description: `You have added ${quantity}${selectedOptions.length > 0 ? ' ' : ''}${selectedOptions.join(' ')} ${props.product_name}${quantity > 1 ? 's' : ''} to your cart!`,
      });
    } catch (error) {
      console.error(error);
      toast.error(`We had an issue adding to your cart.`, {
        description: `Please try again later.`,
      });
    }

    setThinking(false);
  }

  async function onOptionChange(event: string, index: number) {
    const newOptionsList = selectedOptions.slice(0);
    newOptionsList[index] = event;
    if (newOptionsList.includes('')) {
      setSelectedOptions(newOptionsList);
      return;
    }
    const selectedVariant = props.variants.filter((variant) => {
      if (variant.name == newOptionsList.join('-')) {
        return variant;
      }
      return;
    });
    if (selectedVariant.length > 0) {
      setPrice(selectedVariant[0].price);
      setCompareAt(selectedVariant[0].compare_at);
      setMaxQuantity(selectedVariant[0].inventory);
      if (selectedVariant[0].inventory > 0) {
        form.setValue('quantity', 1);
      } else {
        form.setValue('quantity', 0);
      }
    }
    setSelectedOptions(newOptionsList);
  }

  React.useEffect(() => {
    setOpen(false);
    if (analytics !== null) {
      logEvent(analytics, 'product_viewed', {
        product_id: props.product_id,
      });
    }
    if (props.price) {
      setPrice(props.price);
    }
    if (props.compare_at) {
      setCompareAt(props.compare_at);
    }
    if (props.product_type === 'Digital') {
      setMaxQuantity(1);
      form.setValue('quantity', 1);
    }
    if (!props.track_inventory) {
      setMaxQuantity(100);
      form.setValue('quantity', 1);
    } else if (props.track_inventory && props.inventory > 0) {
      setMaxQuantity(props.inventory);
      form.setValue('quantity', 1);
    } else {
      setMaxQuantity(0);
      form.setValue('quantity', 0);
    }
    let newOptionList = selectedOptions.slice(0);
    newOptionList = props.options.map((option) => '');
    setSelectedOptions(newOptionList);
  }, []);

  if (!user_loaded) {
    return <ProductLoading />;
  }
  return (
    <section className="mx-auto flex max-w-[1754px] flex-col gap-8 p-4">
      <section
        key="productInfo"
        className="flex flex-col gap-4 md:flex-row md:gap-8"
      >
        <section className="flex w-full flex-1 flex-col justify-start gap-4">
          <ProductImages images={props.images} />
          <section className="flex justify-between">
            <section className="flex flex-col items-start gap-1">
              <h1 className="text-xl">{props.product_name}</h1>
              <Link
                href={`/store/${props.store_id}`}
                className="flex items-center gap-2"
              >
                <ShowAvatar store_id={props.store_id} size="sm" />
                <p className="">
                  <b>{props.store_name}</b>{' '}
                  <span className="text-muted-foreground">&bull;</span>{' '}
                  <span className="text-muted-foreground">
                    {props.subscription_count} subscriber
                    {props.subscription_count > 1 ? 's' : ''}
                  </span>
                </p>
              </Link>
            </section>
            <section className="flex flex-col items-end gap-1">
              {compareAt > 0 && price > compareAt ? (
                <>
                  <p className="text-destructive line-through">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: props.currency,
                    }).format(price / 100)}
                  </p>
                  <p className="text-xl">
                    <b>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: props.currency,
                      }).format(compareAt / 100)}
                    </b>
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: props.currency,
                  }).format(price / 100)}
                </p>
              )}
            </section>
          </section>
          {props.options.length > 0 && (
            <section className="w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={cn('flex w-full flex-col gap-4 md:flex-row', {
                    hidden: props.product_type === 'Digital',
                  })}
                >
                  {props.options.length > 0 && (
                    <>
                      {props.options.map((option, index) => {
                        return (
                          <div key={`option-${index}`} className="w-full">
                            <FormField
                              control={form.control}
                              name={`options.${index}.option`}
                              render={({ field }) => (
                                <FormItem className="w-full flex-1">
                                  <FormLabel>{option.name}</FormLabel>
                                  <Select
                                    onValueChange={(event) =>
                                      onOptionChange(event, index)
                                    }
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder={`Select a ${option.name}`}
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {option.options.map((item) => {
                                        return (
                                          <SelectItem value={item} key={item}>
                                            {item}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                  {maxQuantity != null && (
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              onChangeCapture={field.onChange}
                              id="quantity"
                              type="number"
                              max={maxQuantity}
                              min={0}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </form>
              </Form>
            </section>
          )}
          <section className="flex w-full items-start gap-4">
            {!cart_loaded ? (
              <Button variant="outline" className="w-full md:w-auto">
                Loading Cart
              </Button>
            ) : (
              <>
                {maxQuantity == 0 ? (
                  <Button variant="destructive" className="w-full md:w-auto">
                    Sold Out
                  </Button>
                ) : (
                  <>
                    {props.options.length == 0 ||
                    (props.options.length > 0 &&
                      !selectedOptions.includes('')) ? (
                      <>
                        {thinking ? (
                          <Button
                            variant="outline"
                            className="w-full md:w-auto"
                          >
                            <FontAwesomeIcon
                              className="icon mr-2 h-4 w-4"
                              icon={faSpinner}
                              spin
                            />
                            Adding
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            onClick={form.handleSubmit(onSubmit)}
                            className="w-full md:w-auto"
                          >
                            Add To Cart
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button variant="secondary" className="w-full md:w-auto">
                        Select Options
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </section>
          <div className="flex justify-start gap-4 pt-4">
            <LikeButton
              product_id={props.product_id}
              like_count={props.like_count}
              store_id={props.store_id}
              country={props.country}
              city={props.city}
              region={props.region}
              ip={props.ip}
            />
            <Button variant="outline" size="xs" asChild>
              <div>
                <FontAwesomeIcon className="mr-1 !h-3" icon={faShare} />
                Share
              </div>
            </Button>
            <Button variant="outline" size="xs" className="text-foreground">
              <FontAwesomeIcon className="mr-1 !h-3" icon={faFlag} />
              Report
            </Button>
          </div>
          <ShowDetails
            text={props.product_description}
            howManyToShow={100}
            store_name={props.store_id}
            product_id={props.product_id}
            //add ships from
            created_at_seconds={props.created_at_seconds}
            created_at_nanoseconds={props.created_at_nanoseconds}
            view_count={props.view_count}
            like_count={props.like_count}
            product_type={props.product_type}
          />
          <ProductComments
            product_id={props.product_id}
            store_id={props.store_id}
          />
        </section>
        <section className="flex w-full flex-col md:w-[275px] xl:w-[400px]">
          <RelatedProducts
            product_id={props.product_id}
            store_id={props.store_id}
            tags={props.tags}
          />
        </section>
      </section>
    </section>
  );
}
