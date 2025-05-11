'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/use-media-query';
import { db } from '@/lib/firebase';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, DocumentReference, updateDoc } from 'firebase/firestore';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  carrier: z.enum(['USPS', 'FEDEX', 'UPS'], {
    message: 'Please select a carrier',
  }),
  tracking_number: z
    .string()
    .min(1, { message: 'Tracking Number is required' })
    .max(64, {
      message: 'Tracking Number must be no more than 32 characters long',
    }),
});
export const UploadTrackingButton = ({
  carrier,
  shipment_id,
  order_id,
  checkFulFilled,
}: {
  carrier: string;
  shipment_id: string;
  order_id: string;
  checkFulFilled: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  let start_carrier: 'USPS' | 'FEDEX' | 'UPS' = 'USPS';
  if (carrier.startsWith('FEDEX')) {
    start_carrier = 'FEDEX';
  } else if (carrier.startsWith('UPS')) {
    start_carrier = 'UPS';
  }
  const trackingForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carrier: start_carrier,
      tracking_number: '',
    },
  });

  async function onAdd() {
    const data = trackingForm.getValues();
    const storeRef: DocumentReference = doc(
      db,
      `orders/${order_id}/shipments/`,
      shipment_id
    );
    await updateDoc(storeRef, {
      status: 'Fulfilled',
      tracking: `${data.carrier}::${data.tracking_number}`,
    });
    await checkFulFilled();
    trackingForm.reset();
    setOpen(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="xs">Update Tracking</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Tracking</DialogTitle>
            <DialogDescription asChild>
              <Form {...trackingForm}>
                <form
                  onSubmit={trackingForm.handleSubmit(onAdd)}
                  className="flex w-full flex-col items-start justify-start gap-8 pt-4"
                >
                  <FormField
                    control={trackingForm.control}
                    name="carrier"
                    render={({ field }) => (
                      <FormItem className="text-foreground flex w-full flex-col items-start justify-start">
                        <FormLabel className="text-foreground">
                          Carrier
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a carrier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USPS">USPS</SelectItem>
                            <SelectItem value="FEDEX">FEDEX</SelectItem>
                            <SelectItem value="UPS">UPS</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={trackingForm.control}
                    name="tracking_number"
                    render={({ field }) => (
                      <FormItem className="text-foreground flex w-full flex-col items-start justify-start">
                        <FormLabel className="text-foreground">
                          Tracking Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            onChangeCapture={field.onChange}
                            id="tracking_number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Update
                  </Button>
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
        <Button size="xs">Upload Tracking</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto w-full max-w-[2428px]">
          <DrawerTitle className="flex items-center justify-between">
            Update Tracking
            <DrawerClose asChild>
              <Button variant="outline" size="sm">
                <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
              </Button>
            </DrawerClose>
          </DrawerTitle>
          <DrawerDescription asChild>
            <Form {...trackingForm}>
              <form
                onSubmit={trackingForm.handleSubmit(onAdd)}
                className="flex w-full flex-col items-start justify-start gap-8 pt-4"
              >
                <FormField
                  control={trackingForm.control}
                  name="carrier"
                  render={({ field }) => (
                    <FormItem className="text-foreground flex w-full flex-col items-start justify-start">
                      <FormLabel className="text-foreground">Carrier</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a carrier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USPS">USPS</SelectItem>
                          <SelectItem value="FEDEX">FEDEX</SelectItem>
                          <SelectItem value="UPS">UPS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={trackingForm.control}
                  name="tracking_number"
                  render={({ field }) => (
                    <FormItem className="text-foreground flex w-full flex-col items-start justify-start">
                      <FormLabel className="text-foreground">
                        Tracking Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChangeCapture={field.onChange}
                          id="tracking_number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Update
                </Button>
              </form>
            </Form>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
