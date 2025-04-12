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
import { _FooterNavItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconLogo, WordLogo } from '../Logo';
import {
  adminNavSections,
  dashboardNavSections,
  footerNavItems,
  marketNavSections,
} from './navItems';
import { NavSection } from './navSection';
import { NavUser } from './navUser';

export function AppSidebar() {
  const pathname = usePathname();
  const { state, open, isMobile } = useSidebar();
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
                className={cn('w-8', {
                  'w-full': !open && !isMobile,
                })}
              >
                <IconLogo />
              </Link>
              <Link
                href="/"
                className={cn('w-24', {
                  block: open,
                  hidden: !open && !isMobile,
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
        {pathname.startsWith('/admin') && (
          <>
            {adminNavSections.map((section) => (
              <NavSection
                name={section.name}
                items={section.items}
                key={`navigation_section_${section.name}`}
              />
            ))}
          </>
        )}
        {!pathname.startsWith('/dashboard') &&
          !pathname.startsWith('/admin') && (
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
                      <SidebarMenuButton className="hover:bg-sidebar h-auto p-0">
                        <Link
                          href={link.url}
                          className={cn(
                            'hover:bg-none" text-foreground px-0 py-0 text-xs',
                            index !== footerNavItems.length - 1 &&
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
