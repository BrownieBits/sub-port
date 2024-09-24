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
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import {
  faBinoculars,
  faClose,
  faGlobe,
  faInfoCircle,
  faStore,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Timestamp } from 'firebase/firestore';
import React from 'react';

export const ShowDetails = (props: {
  text: string;
  howManyToShow: number;
  store_name: string;
  product_id: string;
  // location: string;
  created_at: Timestamp;
  view_count: number;
  like_count: number;
}) => {
  const timestamp = new Date(
    props.created_at.seconds * 1000 + props.created_at.nanoseconds / 1000000
  );
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <section className="mt-8 w-full rounded border bg-layer-one p-4">
        <h4>Product Details</h4>
        <p className="whitespace-pre-wrap pt-[5px] text-sm text-muted-foreground">
          {props.text.length < props.howManyToShow
            ? props.text.replaceAll('\\n', '\n')
            : `${props.text.replaceAll('\\n', '\n').substring(0, props.howManyToShow)}...`}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="h-auto p-[0] px-4 text-foreground hover:no-underline"
                asChild
              >
                <span>...more</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  <h3>Product Details</h3>
                </DialogTitle>
                <DialogDescription className="flex flex-col">
                  <span className="whitespace-pre-wrap pb-4 text-foreground">
                    {props.text.replaceAll('\\n', '\n')}
                  </span>

                  <span className="flex w-full justify-start gap-0 pb-4 text-foreground">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faGlobe}
                    />
                    htttps://{process.env.NEXT_PUBLIC_BASE_URL}/product/
                    {props.product_id}
                  </span>
                  <span className="flex w-full justify-start gap-0 pb-4 text-foreground">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faStore}
                    />
                    htttps://{process.env.NEXT_PUBLIC_BASE_URL}/store/
                    {props.store_name}
                  </span>
                  <span className="pb-4 text-foreground">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faThumbsUp}
                    />
                    {props.like_count} like
                    {props.like_count > 1 ? 's' : ''}
                  </span>
                  <span className="pb-4 text-foreground">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faBinoculars}
                    />
                    {props.view_count} view{props.view_count > 1 ? 's' : ''}
                  </span>
                  <span className="pb-4 text-foreground">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faInfoCircle}
                    />
                    Created{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(timestamp)}
                  </span>
                  {/* <span className="text-foreground pb-8">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faGlobeAmericas}
                    />
                    {
                      country_list.filter(
                        (country) => country.value === props.location
                      )[0].name
                    }
                  </span> */}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 w-full rounded border bg-layer-one p-4">
      <h4>Product Details</h4>
      <p className="whitespace-pre-wrap pt-[5px] text-sm text-muted-foreground">
        {props.text.length < props.howManyToShow
          ? props.text.replaceAll('\\n', '\n')
          : `${props.text.replaceAll('\\n', '\n').substring(0, props.howManyToShow)}...`}

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger>
            <Button
              variant="link"
              className="h-auto p-[0] px-4 text-foreground hover:no-underline"
              asChild
            >
              <span>...more</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="mx-auto w-full max-w-[2428px]">
              <DrawerTitle className="flex justify-between">
                <h3>Product Details</h3>
                <DrawerClose>
                  <Button variant="outline">
                    <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
                  </Button>
                </DrawerClose>
              </DrawerTitle>
              <DrawerDescription className="flex w-full flex-col items-start text-left">
                <span className="whitespace-pre-wrap pb-4 text-foreground">
                  {props.text.replaceAll('\\n', '\n')}
                </span>
                <span className="flex w-full justify-start gap-0 pb-4 text-foreground">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faGlobe}
                  />
                  htttps://{process.env.NEXT_PUBLIC_BASE_URL}/product/
                  {props.product_id}
                </span>
                <span className="flex w-full justify-start gap-0 pb-4 text-foreground">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faStore}
                  />
                  htttps://{process.env.NEXT_PUBLIC_BASE_URL}/store/
                  {props.store_name}
                </span>
                <span className="pb-4 text-foreground">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faThumbsUp}
                  />
                  {props.like_count} like
                  {props.like_count > 1 ? 's' : ''}
                </span>
                <span className="pb-4 text-foreground">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faBinoculars}
                  />
                  {props.view_count} view{props.view_count > 1 ? 's' : ''}
                </span>
                <span className="pb-4 text-foreground">
                  <FontAwesomeIcon
                    className="icon mr-2 h-4 w-4"
                    icon={faInfoCircle}
                  />
                  Created{' '}
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(timestamp)}
                </span>
                {/* <span className="text-foreground pb-8">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faGlobeAmericas}
                    />
                    {
                      country_list.filter(
                        (country) => country.value === props.location
                      )[0].name
                    }
                  </span> */}
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </p>
    </section>
  );
};
