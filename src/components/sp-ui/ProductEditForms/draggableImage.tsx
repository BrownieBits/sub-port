'use client';

import { Button } from '@/components/ui/button';
import { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import Image from 'next/image';
import React from 'react';

type Props = {
  index: number;
  image: ProductImage;
  draggableSnapshot: DraggableStateSnapshot;
  draggableProvided: DraggableProvided;
  removeProductImage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
};

export default function DraggableImage(props: Props) {
  return (
    <section
      className={cn(
        'group relative aspect-square cursor-pointer overflow-hidden rounded border',
        {
          'bg-layer-two': !props.draggableSnapshot.isDragging,
          'left-auto top-auto bg-layer-three':
            props.draggableSnapshot.isDragging,
        }
      )}
      {...props.draggableProvided.draggableProps}
      {...props.draggableProvided.dragHandleProps}
      ref={props.draggableProvided.innerRef}
    >
      <Button
        variant="destructive"
        size="sm"
        onClick={(event) => {
          props.removeProductImage(event, props.index);
        }}
        className="absolute right-0 top-0 hidden group-hover:block"
      >
        <p>
          <FontAwesomeIcon className="icon" icon={faTrash} />
        </p>
      </Button>

      <section className="flex h-full items-center">
        <Image
          src={props.image.image}
          alt={props.image.id.toString()}
          width={300}
          height={300}
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </section>
    </section>
  );
}
