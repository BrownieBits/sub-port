'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { _NavItem } from '@/lib/types';
import userStore from '@/stores/userStore';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MarketplaceSection } from './marketplace_menu';

export function NavSection({
  name,
  items,
}: {
  name: string;
  items: _NavItem[];
}) {
  const pathname = usePathname();
  const user_id = userStore((state) => state.user_id);

  if (name === 'Marketplace') {
    return <MarketplaceSection />;
  }
  return (
    <SidebarGroup>
      {name !== 'Main' && <SidebarGroupLabel>{name}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (item.needs_user && user_id === '') {
              return (
                <SidebarMenuItem key={`menu_item_${item.name}`}>
                  <SidebarMenuButton
                    tooltip={`Sign In to Access ${item.name}`}
                    asChild
                  >
                    <Link
                      href={`/sign-in?redirect=${item.url}`}
                      aria-label={`Sign In to Access ${item.name}`}
                      className="text-muted-foreground flex w-full justify-start"
                    >
                      <p>
                        <i className={`${item.icon} mr-2 h-4 w-4`}></i>
                      </p>
                      <p>{item.name}</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }
            if (item.sub_menu.length > 0) {
              return (
                <DropdownMenu key={`menu_item_${item.name}`}>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.name}
                      isActive={pathname.startsWith(item.url)}
                      className="flex w-full justify-start"
                    >
                      <p>
                        <i className={`${item.icon} mr-2 h-4 w-4`}></i>
                      </p>
                      <p className="flex-1">{item.name}</p>
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    {item.sub_menu.map((subItem) => (
                      <DropdownMenuItem key={`sub_menu_item_${subItem.name}`}>
                        <Link
                          href={subItem.url}
                          aria-label={subItem.name}
                          className="flex w-full justify-start"
                        >
                          <p>{subItem.name}</p>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <SidebarMenuItem key={`menu_item_${item.name}`}>
                <SidebarMenuButton
                  asChild
                  isActive={item.url === pathname}
                  tooltip={item.name}
                >
                  <Link
                    href={item.url}
                    aria-label={item.name}
                    className="flex w-full justify-start"
                  >
                    <p>
                      <i className={`${item.icon} mr-2 h-4 w-4`}></i>
                    </p>
                    <p>{item.name}</p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
