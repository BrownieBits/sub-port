'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/use-media-query';
import { db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import {
  faCalendar,
  faClose,
  faSquarePlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { revalidate } from './actions';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Code must be 3 or more characters long' })
    .max(18, {
      message: 'Code must be no more than 18 characters long',
    })
    .refine((s) => !s.includes(' '), 'Code must contain no spaces'),
  type: z.enum(['Flat Amount', 'Percentage'], {
    required_error: 'You need to select a Promotion type.',
  }),
  amount: z
    .number()
    .int({ message: 'Amount must be a number' })
    .positive({ message: 'Amount must be a positive number' }),
  min_order_value: z
    .number()
    .int({ message: 'Min Order Value must be a number' })
    .nonnegative({ message: 'Min Order Value must be a positive number' }),
  expiration_date: z.date().optional(),
});

export const NewPromotionButton = (props: {
  text: string;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
  size?: 'default' | 'icon' | 'lg' | 'sm' | null | undefined;
  className?: string | '';
}) => {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const store_id = userStore((state) => state.user_store);
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'Flat Amount',
      amount: 1,
      min_order_value: 0,
      expiration_date: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let expiration_date = null;
    if (values.expiration_date !== undefined) {
      expiration_date = Timestamp.fromDate(values.expiration_date);
    }
    const documentReference: DocumentReference = doc(
      db,
      'stores',
      store_id!,
      'promotions',
      values.name.toUpperCase()
    );
    const querySnapshot = await getDoc(documentReference);
    if (querySnapshot.exists()) {
      form.setError('name', {
        message: 'You have already used this code before',
      });
      return;
    }
    await setDoc(documentReference, {
      name: values.name.toUpperCase(),
      number_of_uses: 0,
      minimum_order_value: values.min_order_value,
      amount:
        values.type === 'Percentage' ? values.amount : values.amount * 100,
      type: values.type,
      status: 'Inactive',
      times_used: 0,
      owner_id: user_id,
      show_in_banner: false,
      expiration_date: expiration_date,
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
    });
    toast.success('Promotion Created', {
      description: 'Your promotion has been created.',
    });
    form.reset();
    revalidate();
    setOpen(false);
  }

  if (!user_loaded) {
    return <></>;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={props.variant}
            size={props.size}
            className={props.className}
          >
            <FontAwesomeIcon
              className="icon mr-2 h-4 w-4"
              icon={faSquarePlus}
            />
            <p>{props.text}</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Promotion</DialogTitle>
            <DialogDescription className="flex flex-col" asChild>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-8 pt-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Code</FormLabel>
                        <FormControl>
                          <Input className="text-foreground" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full space-x-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-foreground">
                                <SelectValue placeholder="Select a promotion type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Flat Amount">$</SelectItem>
                              <SelectItem value="Percentage">%</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-foreground">
                            Amount
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="text-foreground"
                              onChange={(event) =>
                                field.onChange(+event.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="min_order_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Min Order Value
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="text-foreground"
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiration_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground">
                          Expiration Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className="text-foreground w-full justify-start text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, 'LLL dd, yyyy')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <FontAwesomeIcon
                                  className="icon ml-[10px]"
                                  icon={faCalendar}
                                />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value!}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <section className="flex w-full justify-end gap-4">
                    <DialogClose>Cancel</DialogClose>
                    <Button type="submit">Submit</Button>
                  </section>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={props.variant}
          size={props.size}
          className={props.className}
        >
          <FontAwesomeIcon className="icon mr-2 h-4 w-4" icon={faSquarePlus} />
          <p>{props.text}</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto w-full max-w-[2428px]">
          <DrawerTitle className="flex justify-between">
            Add Promotion
            <DrawerClose asChild>
              <Button variant="outline" size="sm">
                <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
              </Button>
            </DrawerClose>
          </DrawerTitle>
          <DrawerDescription
            className="flex w-full flex-col items-start text-left"
            asChild
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Code</FormLabel>
                      <FormControl>
                        <Input className="text-foreground" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full space-x-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="text-foreground">
                              <SelectValue placeholder="Select a promotion type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Flat Amount">$</SelectItem>
                            <SelectItem value="Percentage">%</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-foreground">
                          Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="text-foreground"
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="min_order_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Min Order Value
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="text-foreground"
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiration_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground">
                        Expiration Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className="text-foreground w-full justify-start text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, 'LLL dd, yyyy')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <FontAwesomeIcon
                                className="icon ml-[10px]"
                                icon={faCalendar}
                              />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value!}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <section className="flex w-full justify-end gap-4">
                  <DrawerClose>Cancel</DrawerClose>
                  <Button type="submit">Submit</Button>
                </section>
              </form>
            </Form>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
