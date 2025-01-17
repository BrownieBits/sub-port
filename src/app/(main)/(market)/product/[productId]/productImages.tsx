'use client';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import React from 'react';

export default function ProductImages(props: { images: string[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [mainImage, setMainImage] = React.useState('');

  React.useEffect(() => {
    if (props.images.length >= 0) {
      setMainImage(props.images[0]);
    }
  }, [props.images]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (mainImage === '') {
    return <></>;
  }
  if (props.images.length === 2) {
    props.images[2] = props.images[0];
    props.images[3] = props.images[1];
  }
  if (props.images.length === 1) {
    props.images[1] = props.images[0];
    props.images[2] = props.images[0];
  }
  return (
    <Card className="w-full overflow-hidden">
      <section className="w-full">
        <Carousel opts={{ loop: true }} setApi={setApi}>
          <CarouselContent className="flex">
            {props.images.map((image, index) => {
              return (
                <CarouselItem
                  key={`carousel-image-${image}-${index}`}
                  className="basis-7/12"
                >
                  <section className="flex aspect-square h-full items-center justify-center overflow-hidden rounded border">
                    <Image
                      src={image}
                      alt="Product Image"
                      width="1000"
                      height="1000"
                      priority
                      className="w-full cursor-pointer"
                      onClick={() => setMainImage(image)}
                    />
                  </section>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </section>
    </Card>
  );
}
