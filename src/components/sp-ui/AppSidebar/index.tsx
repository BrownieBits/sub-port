'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconLogo, WordLogo } from '../Logo';
import { footer_nav_items } from '../Menus/footerNavItems';
import {
  dashboardNavSections,
  footerNavItems,
  marketNavSections,
} from './navItems';
import { NavSection } from './navSection';
import { NavUser } from './navUser';
import { _FooterNavItem } from './types';

export function AppSidebar() {
  const pathname = usePathname();
  const { state, open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link
                href="/"
                className={cn('w-10', {
                  'w-full': !open,
                })}
              >
                <IconLogo />
              </Link>
              <Link
                href="/"
                className={cn('w-16', {
                  block: open,
                  hidden: !open,
                })}
              >
                <WordLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {pathname.startsWith('/dashboard') && (
          <>
            {dashboardNavSections.map((section) => (
              <NavSection
                name={section.name}
                items={section.items}
                key={`navigation_section_${section.name}`}
              />
            ))}
          </>
        )}
        {!pathname.startsWith('/dashboard') && (
          <>
            {marketNavSections.map((section) => (
              <NavSection
                name={section.name}
                items={section.items}
                key={`navigation_section_${section.name}`}
              />
            ))}
          </>
        )}
        {open && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-row flex-wrap items-center gap-x-2 gap-y-4 px-2">
                {footerNavItems.map((link: _FooterNavItem, index: number) => {
                  return (
                    <SidebarMenuItem key={`menu_item_${link.name}`}>
                      <SidebarMenuButton className="h-auto p-0">
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
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
