'use client';

import { Button } from '@/components/ui/button';
import { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  faTrash,
  faUpDownLeftRight,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React, { useRef } from 'react';
import { createSwapy } from 'swapy';

type Props = {
  product_images: ProductImage[];
  uploadRef: React.RefObject<HTMLInputElement | null>;
  removeImage: (index: number) => void;
  reOrderImages: (images: ProductImage[]) => void;
};

export default function DraggableImages(props: Props) {
  const container = useRef(null);
  const [productImages, setProductImages] = React.useState<ProductImage[]>([]);

  function removeProductImage(index: number) {
    props.removeImage(index);
    setProductImages([]);
  }

  React.useEffect(() => {
    if (productImages.length > 0 && container.current !== null) {
      const container2 = document.querySelector('.container')!;
      const swapy = createSwapy(container.current!, {
        swapMode: 'drop',
        animation: 'spring',
        enabled: true,
      });
      swapy.onSwap((data) => {
        console.log('boop');
        const newImageOrder: ProductImage[] = data.newSlotItemMap.asArray.map(
          (item, index) => {
            return {
              id: index,
              image: props.product_images[parseInt(item.item)].image,
            };
          }
        );
        props.reOrderImages(newImageOrder.slice(0));
        setProductImages([]);
      });
      swapy.onSwapStart(() => {
        console.log('beep');
      });

      return () => {
        swapy.destroy();
      };
    }
  }, [productImages, container]);
  React.useEffect(() => {
    setProductImages(props.product_images);
  }, [props.product_images]);

  return (
    <section
      ref={container}
      className={cn(
        'container grid grid-cols-2 gap-4 md:grid-cols-5 md:grid-rows-2',
        {
          'grid-rows-3':
            productImages.length === 1 || productImages.length === 2,
          'grid-rows-4':
            productImages.length === 3 || productImages.length === 4,
          'grid-rows-5': productImages.length >= 5,
        }
      )}
    >
      {productImages.length > 0 && (
        <section
          className="slot col-span-2 row-span-2 aspect-square w-full"
          data-swapy-slot="1"
        >
          <section
            className="group relative flex aspect-square items-center justify-center overflow-hidden rounded"
            data-swapy-item={productImages[0].id}
          >
            <section
              className="handle absolute left-[2px] top-[2px] hidden group-hover:block"
              // data-swapy-handle
            >
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                }}
                className="h-auto rounded-full border bg-background p-2 text-foreground"
              >
                <FontAwesomeIcon className="icon" icon={faUpDownLeftRight} />
              </Button>
            </section>
            <section className="absolute right-[2px] top-[2px] hidden group-hover:block">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  removeProductImage(productImages[0].id);
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
              priority
            />
          </section>
        </section>
      )}
      {productImages.length > 1 && (
        <section
          className="slot group col-start-1 row-start-3 aspect-square md:col-start-3 md:row-start-1"
          data-swapy-slot="2"
        >
          <section
            className="relative flex aspect-square items-center justify-center overflow-hidden rounded"
            data-swapy-item={productImages[1].id}
          >
            <section className="handle absolute left-[2px] top-[2px] hidden group-hover:block">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                }}
                className="hover: h-auto border bg-background p-2 text-foreground"
              >
                <FontAwesomeIcon className="icon" icon={faUpDownLeftRight} />
              </Button>
            </section>
            <section className="absolute right-[2px] top-[2px] hidden group-hover:block">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  removeProductImage(productImages[1].id);
                }}
                className="h-auto border-destructive bg-destructive p-2 text-destructive-foreground hover:bg-destructive"
              >
                <FontAwesomeIcon className="icon" icon={faTrash} />
              </Button>
            </section>
            <Image
              src={productImages[1].image}
              height={400}
              width={400}
              alt="Main Product Image"
            />
          </section>
        </section>
      )}
      {productImages.length > 2 && (
        <section
          className="slot col-start-2 row-start-3 aspect-square md:col-start-4 md:row-start-1"
          data-swapy-slot="3"
        >
          <section
            className="group relative flex aspect-square items-center justify-center overflow-hidden rounded"
            data-swapy-item={productImages[2].id}
          >
            <section className="handle absolute left-[2px] top-[2px] hidden group-hover:block">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                }}
                className="hover: h-auto border bg-background p-2 text-foreground"
              >
                <FontAwesomeIcon className="icon" icon={faUpDownLeftRight} />
              </Button>
            </section>
            <section className="absolute right-[2px] top-[2px] hidden group-hover:block">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  removeProductImage(productImages[2].id);
                }}
                className="h-auto border-destructive bg-destructive p-2 text-destructive-foreground hover:bg-destructive"
              >
                <FontAwesomeIcon className="icon" icon={faTrash} />
              </Button>
            </section>
            <Image
              src={productImages[2].image}
              height={400}
              width={400}
              alt="Main Product Image"
            />
          </section>
        </section>
      )}
      {productImages.length > 3 && (
        <section
          className="slot col-start-1 row-start-4 aspect-square md:col-start-5 md:row-start-1"
          data-swapy-slot="4"
        >
          <section
            className="relative flex aspect-square items-center justify-center overflow-hidden rounded"
            data-swapy-item={productImages[3].id}
          >
            <section
              className="handle absolute left-[2px] top-[2px]"
              data-swapy-handle
            >
              <Button
                size="sm"
                className="hover: h-auto border bg-background p-2 text-foreground"
              >
                <FontAwesomeIcon className="icon" icon={faUpDownLeftRight} />
              </Button>
            </section>
            <section className="absolute right-[2px] top-[2px]">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  removeProductImage(productImages[3].id);
                }}
                className="h-auto border-destructive bg-destructive p-2 text-destructive-foreground hover:bg-destructive"
              >
                <FontAwesomeIcon className="icon" icon={faTrash} />
              </Button>
            </section>
            <Image
              src={productImages[3].image}
              height={400}
              width={400}
              alt="Main Product Image"
            />
          </section>
        </section>
      )}
      {productImages.length > 4 && (
        <section
          className="slot col-start-2 row-start-4 aspect-square md:col-start-3 md:row-start-2"
          data-swapy-slot="5"
        >
          <section
            className="group relative flex aspect-square items-center justify-center overflow-hidden rounded"
            data-swapy-item={productImages[4].id}
          >
            <section className="handle absolute left-[2px] top-[2px] hidden group-hover:block">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                }}
                className="hover: h-auto border bg-background p-2 text-foreground"
              >
                <FontAwesomeIcon className="icon" icon={faUpDownLeftRight} />
              </Button>
            </section>
            <section className="absolute right-[2px] top-[2px] hidden group-hover:block">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  removeProductImage(productImages[4].id);
                }}
                className="h-auto border-destructive bg-destructive p-2 text-destructive-foreground hover:bg-destructive"
              >
                <FontAwesomeIcon className="icon" icon={faTrash} />
              </Button>
            </section>
            <Image
              src={productImages[4].image}
              height={400}
              width={400}
              alt="Main Product Image"
            />
          </section>
        </section>
      )}
      {productImages.length > 5 && (
        <section
          className="slot col-start-1 row-start-5 aspect-square md:col-start-4 md:row-start-2"
          data-swapy-slot="6"
        >
          <section
            className="group relative flex aspect-square items-center justify-center overflow-hidden rounded"
            data-swapy-item={productImages[5].id}
          >
            <section className="handle absolute left-[2px] top-[2px] hidden group-hover:block">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                }}
                className="hover: h-auto border bg-background p-2 text-foreground"
              >
                <FontAwesomeIcon className="icon" icon={faUpDownLeftRight} />
              </Button>
            </section>
            <section className="absolute right-[2px] top-[2px] hidden group-hover:block">
              <Button
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  removeProductImage(productImages[5].id);
                }}
                className="h-auto border-destructive bg-destructive p-2 text-destructive-foreground hover:bg-destructive"
              >
                <FontAwesomeIcon className="icon" icon={faTrash} />
              </Button>
            </section>
            <Image
              src={productImages[5].image}
              height={400}
              width={400}
              alt="Main Product Image"
            />
          </section>
        </section>
      )}

      {productImages.length === 2 && (
        <section className="col-start-2 row-start-3 aspect-square md:col-start-4 md:row-start-1">
          <section className="relative flex aspect-square items-center justify-center overflow-hidden rounded">
            <Button
              onClick={(event) => {
                event.preventDefault();
                props.uploadRef.current?.click();
              }}
              className="hover: h-full w-full rounded text-foreground"
            >
              <p className="text-4xl">
                <FontAwesomeIcon className="icon" icon={faUpload} />
              </p>
            </Button>
          </section>
        </section>
      )}
      {productImages.length === 3 && (
        <section className="col-start-1 row-start-4 aspect-square md:col-start-5 md:row-start-1">
          <section className="relative flex aspect-square items-center justify-center overflow-hidden rounded">
            <Button
              onClick={(event) => {
                event.preventDefault();
                props.uploadRef.current?.click();
              }}
              className="hover: h-full w-full rounded text-foreground"
            >
              <p className="text-4xl">
                <FontAwesomeIcon className="icon" icon={faUpload} />
              </p>
            </Button>
          </section>
        </section>
      )}
      {productImages.length === 4 && (
        <section className="col-start-2 row-start-4 aspect-square md:col-start-3 md:row-start-2">
          <section className="relative flex aspect-square items-center justify-center overflow-hidden rounded">
            <Button
              onClick={(event) => {
                event.preventDefault();
                props.uploadRef.current?.click();
              }}
              className="hover: h-full w-full rounded text-foreground"
            >
              <p className="text-4xl">
                <FontAwesomeIcon className="icon" icon={faUpload} />
              </p>
            </Button>
          </section>
        </section>
      )}
      {productImages.length === 5 && (
        <section className="col-start-1 row-start-5 aspect-square md:col-start-4 md:row-start-2">
          <section className="relative flex aspect-square items-center justify-center overflow-hidden rounded">
            <Button
              onClick={(event) => {
                event.preventDefault();
                props.uploadRef.current?.click();
              }}
              className="hover: h-full w-full rounded text-foreground"
            >
              <p className="text-4xl">
                <FontAwesomeIcon className="icon" icon={faUpload} />
              </p>
            </Button>
          </section>
        </section>
      )}
    </section>
  );
}
