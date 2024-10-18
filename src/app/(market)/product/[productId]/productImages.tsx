'use client';

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
  return (
    <section className="flex w-full items-start gap-4">
      {props.images.length > 1 && (
        <div className="hidden flex-col items-center justify-center gap-4 md:flex">
          {props.images.map((image, index) => (
            <section
              className={`flex aspect-square w-[50px] cursor-pointer items-center justify-center overflow-hidden rounded border bg-layer-one xl:w-[100px] ${
                index + 1 === current ? 'border-2 border-primary' : ''
              }`}
              key={`sub-image-${index}`}
            >
              <Image
                src={image}
                alt="Product Image"
                width="100"
                height="100"
                className="w-full"
                onClick={() => api && api.scrollTo(index)}
              />
            </section>
          ))}
        </div>
      )}
      <section className="w-full flex-1">
        <Carousel opts={{ loop: true }} setApi={setApi}>
          <CarouselContent>
            {props.images.map((image) => {
              return (
                <CarouselItem key={image}>
                  <section
                    className="flex aspect-square items-center justify-center overflow-hidden rounded border bg-layer-one"
                    key={image}
                  >
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
    </section>
  );
}
