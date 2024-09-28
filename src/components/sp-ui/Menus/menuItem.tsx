'use client';

import { SheetClose } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import userStore from '@/stores/userStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { _NavItem } from './types';

type Props = {
  item: _NavItem;
  inSheet: boolean;
};
export const MenuItem = (props: Props) => {
  const userID = userStore((state) => state.user_id);
  const pathname = usePathname();

  if (props.item.needs_user && userID === '') {
    if (props.inSheet) {
      return (
        <SheetClose asChild>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <Link
                href={`/sign-in?redirect=${props.item.url}`}
                aria-label={`Sign In to Access ${props.item.name}`}
                className="flex w-full justify-start bg-layer-one px-4 py-2 text-muted-foreground hover:bg-layer-two hover:no-underline"
              >
                <p>
                  <i className={`${props.item.icon} mr-2 h-4 w-4`}></i>
                </p>
                {props.item.name}
              </Link>
            </TooltipTrigger>
            <TooltipContent>Sign In to Access</TooltipContent>
          </Tooltip>
        </SheetClose>
      );
    }
    return (
      <Tooltip>
        <TooltipTrigger className="w-full">
          <Link
            href={`/sign-in?redirect=${props.item.url}`}
            aria-label={`Sign In to Access ${props.item.name}`}
            className="flex w-full justify-start bg-layer-one px-4 py-2 text-muted-foreground hover:bg-layer-two hover:no-underline"
          >
            <p>
              <i className={`${props.item.icon} mr-2 h-4 w-4`}></i>
            </p>
            {props.item.name}
          </Link>
        </TooltipTrigger>
        <TooltipContent>Sign In to Access</TooltipContent>
      </Tooltip>
    );
  }

  if (props.inSheet) {
    return (
      <SheetClose asChild>
        <Link
          href={props.item.url}
          aria-label={props.item.name}
          className={cn(
            'flex w-full justify-start px-4 py-2 text-foreground hover:no-underline',
            {
              'bg-layer-two hover:bg-layer-three': pathname === props.item.url,
              'bg-layer-one hover:bg-layer-two': pathname !== props.item.url,
            }
          )}
        >
          <p>
            <i className={`${props.item.icon} mr-2 h-4 w-4`}></i>
          </p>
          <p>{props.item.name}</p>
        </Link>
      </SheetClose>
    );
  }
  return (
    <Link
      href={props.item.url}
      aria-label={props.item.name}
      className={cn(
        'flex w-full justify-start px-4 py-2 text-foreground hover:no-underline',
        {
          'bg-layer-two hover:bg-layer-three': pathname === props.item.url,
          'bg-layer-one hover:bg-layer-two': pathname !== props.item.url,
        }
      )}
    >
      <p>
        <i className={`${props.item.icon} mr-2 h-4 w-4`}></i>
      </p>
      <p>{props.item.name}</p>
    </Link>
  );
};
