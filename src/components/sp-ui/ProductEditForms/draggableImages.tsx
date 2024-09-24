'use client';

import { ProductImage } from '@/lib/types';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import React from 'react';
import DraggableImage from './draggableImage';

type Props = {
  product_images: ProductImage[];
  product_image_files: File[];
  product_images_removals: string[];
  remove: (images: ProductImage[], files: File[], removals: string[]) => void;
};

export default function DraggableImages(props: Props) {
  const [productImages, setProductImages] = React.useState<ProductImage[]>([]);

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.index === source.index) {
      return;
    }
    const newProductImages = productImages.slice(0);
    const element = newProductImages[source.index];
    const fileElement = props.product_image_files[source.index];
    newProductImages.splice(source.index, 1);
    newProductImages.splice(destination.index, 0, element);
    props.product_image_files.splice(source.index, 1);
    props.product_image_files.splice(destination.index, 0, fileElement);
    props.remove(
      newProductImages,
      props.product_image_files,
      props.product_images_removals
    );
    setProductImages(props.product_images);
  }
  function removeProductImage(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) {
    event.preventDefault();
    const newProductImages = productImages.slice(0);
    if (
      newProductImages[index].image.includes('firebasestorage.googleapis.com')
    ) {
      props.product_images_removals.push(props.product_images[index].image);
    }
    newProductImages.splice(index, 1);
    props.product_image_files.splice(index, 1);

    setProductImages(newProductImages);
    props.remove(
      newProductImages,
      props.product_image_files,
      props.product_images_removals
    );
  }

  React.useEffect(() => {
    setProductImages(props.product_images);
  }, [props.product_images]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="images"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={true}
        direction="horizontal"
        renderClone={(draggableProvided, draggableSnapshot, rubric) => (
          <DraggableImage
            index={rubric.source.index}
            image={productImages[rubric.source.index]}
            draggableProvided={draggableProvided}
            draggableSnapshot={draggableSnapshot}
            removeProductImage={removeProductImage}
          />
        )}
      >
        {(droppableProvided) => (
          <>
            {productImages.length <= 0 && (
              <>
                <p>
                  <b>No Images Yet</b>
                </p>
                <p className="text-sm">Add images to show off your product.</p>
              </>
            )}
            <section
              className="grid w-full min-w-[900px] grid-cols-6 items-center gap-8"
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {productImages.map((image, index) => (
                <Draggable
                  key={`${index}-${image.id.toString()}`}
                  draggableId={`${index}-${image.id.toString()}`}
                  index={index}
                >
                  {(draggableProvided, draggableSnapshot) => {
                    return (
                      <DraggableImage
                        index={index}
                        image={image}
                        draggableProvided={draggableProvided}
                        draggableSnapshot={draggableSnapshot}
                        removeProductImage={removeProductImage}
                      />
                    );
                  }}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </section>
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
}
