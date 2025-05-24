'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

type Props = {
  name: string;
  avatar_url: string;
  subscription_count: number;
  id: string;
};
export default function StoreCard(props: Props) {
  return (
    <>
      <Link
        href={`/store/${props.id}`}
        className="group flex w-full flex-col items-center justify-center gap-2"
      >
        <section className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full">
          <Avatar className="aspect-square h-full w-full">
            <AvatarImage src={props.avatar_url!} alt={props.name} />
            <AvatarFallback className="border-background bg-primary text-primary-foreground">
              <p className="text-6xl font-bold">
                {props.name.slice(0, 1).toUpperCase()}
              </p>
            </AvatarFallback>
          </Avatar>
        </section>
        <section className="flex w-full flex-col items-center justify-center">
          <p className="font-bold">{props.name}</p>
          <p className="text-muted-foreground">
            {props.subscription_count} subscriber
            {props.subscription_count > 1 && <>s</>}
          </p>
        </section>
      </Link>
    </>
  );
}
