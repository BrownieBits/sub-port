import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { dashboard_nav_items } from './dashboardNavItems';
import { footer_nav_items } from './footerNavItems';
import { MenuItems } from './menuItems';
import { _FooterNavItem, _NavSection } from './types';

type Props = {
  inSheet: boolean;
};
export const DashboardNav = async (props: Props) => {
  return (
    <ScrollArea className="flex h-full flex-col rounded-md">
      {dashboard_nav_items.map((item: _NavSection) => {
        return (
          <MenuItems
            inSheet={props.inSheet}
            items={item.items}
            key={`menu-item-${item.name}`}
          />
        );
      })}
      <section className={`flex flex-wrap items-center gap-x-2 gap-y-4 p-4`}>
        {footer_nav_items.map((link: _FooterNavItem, index: number) => {
          if (props.inSheet) {
            return (
              <SheetClose asChild key={link.name}>
                <Link
                  href={link.url}
                  className={cn(
                    'px-0 py-0 text-xs text-foreground',
                    index !== footer_nav_items.length - 1 &&
                      "after:pl-2 after:content-['|']"
                  )}
                  aria-label={link.name}
                >
                  {link.name}
                </Link>
              </SheetClose>
            );
          }
          return (
            <Link
              href={link.url}
              className={cn(
                'px-0 py-0 text-xs text-foreground',
                index !== footer_nav_items.length - 1 &&
                  "after:pl-2 after:content-['|']"
              )}
              aria-label={link.name}
              key={link.name}
            >
              {link.name}
            </Link>
          );
        })}
      </section>
    </ScrollArea>
  );
};
