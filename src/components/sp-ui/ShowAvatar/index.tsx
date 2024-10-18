'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';

export const ShowAvatar = ({
  store_id,
  size,
}: {
  store_id: string;
  size?: 'sm' | 'md' | 'lg' | undefined;
}) => {
  const docRef = doc(db, 'stores', store_id!);
  const [value, loadingDoc, docError] = useDocument(docRef); // TODO REMOVE
  if (
    loadingDoc ||
    (value?.exists() &&
      value.data().avatar_url === undefined &&
      value.data().avatar_url === '')
  ) {
    return (
      <Avatar
        className={cn('bg-foreground text-background', {
          'h-[45px] w-[45px] md:h-[75px] md:w-[75px]': size === undefined,
          'h-[75px] w-[75px] md:h-[100px] md:w-[100px]': size === 'lg',
          'h-[32px] w-[32px] md:h-[50px] md:w-[50px]': size === 'md',
          'h-[32px] w-[32px]': size === 'sm',
        })}
      >
        <AvatarFallback className="border-background bg-foreground text-background">
          {store_id.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }
  return (
    <Avatar
      className={cn('bg-foreground text-background', {
        'h-[45px] w-[45px] md:h-[75px] md:w-[75px]': size === undefined,
        'h-[75px] w-[75px] md:h-[100px] md:w-[100px]': size === 'lg',
        'h-[32px] w-[32px] md:h-[50px] md:w-[50px]': size === 'md',
        'h-[32px] w-[32px]': size === 'sm',
      })}
    >
      <AvatarImage src={value?.data()?.avatar_url} alt={store_id} />
      <AvatarFallback className="border-background bg-foreground text-background">
        {store_id.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
