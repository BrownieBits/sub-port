'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import userStore from '@/stores/userStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../../ui/button';
import { _NavItem } from './types';

type Props = {
  item: _NavItem;
};
export const MenuItem = (props: Props) => {
  const userID = userStore((state) => state.user_id);
  const pathname = usePathname();

  if (props.item.needs_user && userID === '') {
    return (
      <Tooltip>
        <TooltipTrigger className="w-full">
          <Button
            asChild
            variant="link"
            className="w-full justify-start rounded-none px-4 py-0 text-muted-foreground"
          >
            <Link
              href={`/sign-in?redirect=${props.item.url}`}
              aria-label={`Sign In to Access ${props.item.name}`}
              className="bg-layer-one hover:bg-layer-two hover:no-underline"
            >
              <p>
                <i className={`${props.item.icon} mr-2 h-4 w-4`}></i>
              </p>
              {props.item.name}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign In to Access</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      asChild
      variant="link"
      className="w-full justify-start rounded-none px-4 py-0 text-foreground"
    >
      <Link
        href={props.item.url}
        aria-label={props.item.name}
        className={cn('hover:no-underline', {
          'bg-layer-two hover:bg-layer-three': pathname === props.item.url,
          'bg-layer-one hover:bg-layer-two': pathname !== props.item.url,
        })}
      >
        <p>
          <i className={`${props.item.icon} mr-2 h-4 w-4`}></i>
        </p>
        <p>{props.item.name}</p>
      </Link>
    </Button>
  );
};
