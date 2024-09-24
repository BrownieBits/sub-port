'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { useDocument } from 'react-firebase-hooks/firestore';

export default function StoreCard({ id }: { id: string }) {
  const docRef = doc(db, 'stores', id);
  const [value, loading, error] = useDocument(docRef);

  if (loading) {
    return (
      <div className="flex flex-col items-start space-x-4">
        <Skeleton className="aspect-square w-full rounded-full" />
        <div className="space-y-2">
          <Skeleton className="mt-4 h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (error || !value?.exists()) {
    return <></>;
  }

  return (
    <>
      <Link
        href={`/store/${id}`}
        className="group flex w-full flex-col items-center justify-center"
      >
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full">
          <Avatar className="aspect-square h-full w-full">
            <AvatarImage
              src={value?.data()?.avatar_url!}
              alt={value?.data()?.name}
            />
            <AvatarFallback className="border-background bg-foreground text-background">
              {value?.data()?.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <p className="mt-[10px] text-lg font-bold">{value?.data()?.name}</p>
        <p className="text-muted-foreground">
          {value?.data()?.subscription_count} subscriber
          {value?.data()?.subscribers > 1 ? <>s</> : <></>}
        </p>
      </Link>
    </>
  );
}
