'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  faBinoculars,
  faClose,
  faGlobe,
  faInfoCircle,
  faStore,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const ShowDetails = (props: {
  text: string;
  howManyToShow: number;
  store_name: string;
  product_id: string;
  // location: string;
  created_at_seconds: number;
  created_at_nanoseconds: number;
  view_count: number;
  like_count: number;
  product_type: string;
}) => {
  const timestamp = new Date(
    props.created_at_seconds * 1000 + props.created_at_nanoseconds / 1000000
  );
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-start gap-2">
          <h4>Product Details</h4>
          <p className="text-muted-foreground">
            Product Type: {props.product_type}
          </p>
          <p className="text-muted-foreground line-clamp-2 whitespace-pre-wrap">
            {props.text.replaceAll('\\n', '\n')}
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="xs"
                className="text-foreground hover:no-underline"
              >
                More
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Product Details</DialogTitle>
                <DialogDescription asChild>
                  <section className="flex flex-col gap-4">
                    <p className="text-foreground pt-4 font-bold">
                      Product Type: {props.product_type}
                    </p>
                    <span className="text-foreground whitespace-pre-wrap">
                      {props.text.replaceAll('\\n', '\n')}
                    </span>

                    <span className="text-foreground flex w-full justify-start gap-0">
                      <FontAwesomeIcon
                        className="icon mr-2 h-4 w-4"
                        icon={faGlobe}
                      />
                      htttps://{process.env.NEXT_PUBLIC_BASE_URL}/product/
                      {props.product_id}
                    </span>
                    <span className="text-foreground flex w-full justify-start gap-0">
                      <FontAwesomeIcon
                        className="icon mr-2 h-4 w-4"
                        icon={faStore}
                      />
                      htttps://{process.env.NEXT_PUBLIC_BASE_URL}/store/
                      {props.store_name}
                    </span>
                    <span className="text-foreground">
                      <FontAwesomeIcon
                        className="icon mr-2 h-4 w-4"
                        icon={faThumbsUp}
                      />
                      {props.like_count} like
                      {props.like_count > 1 ? 's' : ''}
                    </span>
                    <span className="text-foreground">
                      <FontAwesomeIcon
                        className="icon mr-2 h-4 w-4"
                        icon={faBinoculars}
                      />
                      {props.view_count} view{props.view_count > 1 ? 's' : ''}
                    </span>
                    <span className="text-foreground">
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
                  </section>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-start gap-2">
        <h4>Product Details</h4>
        <p className="text-muted-foreground">
          Product Type: {props.product_type}
        </p>
        <p className="text-muted-foreground line-clamp-2 whitespace-pre-wrap">
          {props.text.replaceAll('\\n', '\n')}
        </p>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="xs"
              className="text-foreground hover:no-underline"
            >
              More
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="mx-auto w-full max-w-[2428px]">
              <DrawerTitle className="flex items-center justify-between">
                Product Details
                <DrawerClose asChild>
                  <Button variant="outline" size="sm">
                    <FontAwesomeIcon className="icon h-4 w-4" icon={faClose} />
                  </Button>
                </DrawerClose>
              </DrawerTitle>
              <DrawerDescription asChild>
                <section className="flex w-full flex-col items-start gap-4 text-left">
                  <p className="text-foreground font-bold">
                    Product Type: {props.product_type}
                  </p>
                  <span className="text-foreground whitespace-pre-wrap">
                    {props.text.replaceAll('\\n', '\n')}
                  </span>
                  <span className="text-foreground flex w-full justify-start gap-0">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faGlobe}
                    />
                    htttps://{process.env.NEXT_PUBLIC_BASE_URL}/product/
                    {props.product_id}
                  </span>
                  <span className="text-foreground flex w-full justify-start gap-0">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faStore}
                    />
                    htttps://{process.env.NEXT_PUBLIC_BASE_URL}/store/
                    {props.store_name}
                  </span>
                  <span className="text-foreground">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faThumbsUp}
                    />
                    {props.like_count} like
                    {props.like_count > 1 ? 's' : ''}
                  </span>
                  <span className="text-foreground">
                    <FontAwesomeIcon
                      className="icon mr-2 h-4 w-4"
                      icon={faBinoculars}
                    />
                    {props.view_count} view{props.view_count > 1 ? 's' : ''}
                  </span>
                  <span className="text-foreground">
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
                </section>
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
};
