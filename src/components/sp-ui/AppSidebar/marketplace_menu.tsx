'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { db } from '@/lib/firebase';
import { _NavItem } from '@/lib/types';
import {
  collection,
  CollectionReference,
  getDocs,
  orderBy,
  query,
  Query,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function MarketplaceSection() {
  const pathname = usePathname();
  const [items, setItems] = React.useState<_NavItem[]>([]);

  React.useEffect(() => {
    const fetchItems = async () => {
      const categoriesRef: CollectionReference = collection(
        db,
        'marketplace_categories'
      );
      const categoriesQuery: Query = query(
        categoriesRef,
        where('in_menu', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(categoriesQuery);
      const fetchedItems: _NavItem[] = [];
      querySnapshot.forEach((doc) => {
        const menuItem: _NavItem = {
          name: doc.data().name,
          url: `/${doc.id}`,
          icon: doc.data().icon,
          needs_user: false,
          required_plans: [],
          sub_menu: [],
        };
        fetchedItems.push(menuItem);
      });
      setItems(fetchedItems);
    };
    fetchItems();
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Marketplace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
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
