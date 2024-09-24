import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { footer_nav_items } from './footerNavItems';
import { market_nav_items } from './marketNavItems';
import { MenuItems } from './menuItems';
import { _FooterNavItem, _NavSection } from './types';

export const MarketNav = async ({ inSheet }: { inSheet: boolean }) => {
  return (
    <ScrollArea className="flex h-full flex-col rounded-md">
      {market_nav_items.map((item: _NavSection) => {
        return (
          <MenuItems
            inSheet={inSheet}
            items={item.items}
            key={`menu-item-${item.name}`}
          />
        );
      })}
      <section className={`flex flex-wrap items-center gap-x-2 gap-y-4 p-4`}>
        {footer_nav_items.map((link: _FooterNavItem, index: number) => {
          if (inSheet) {
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
