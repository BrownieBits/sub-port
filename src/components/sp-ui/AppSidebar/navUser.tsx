'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { auth, db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import {
  faBrush,
  faCog,
  faColumns,
  faShirt,
  faSignOut,
  faStore,
  faToolbox,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import { ChevronsUpDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

type StoreInfo = {
  avatar_url: string;
  store_name: string;
};
export function NavUser() {
  const [storeInfo, setStoreInfo] = React.useState<StoreInfo | null>(null);
  const user_loaded = userStore((state) => state.user_loaded);
  const user_id = userStore((state) => state.user_id);
  const user_store = userStore((state) => state.user_store);
  const user_name = userStore((state) => state.user_name);
  const user_role = userStore((state) => state.user_role);
  const { isMobile } = useSidebar();
  const { push } = useRouter();
  const { setTheme } = useTheme();

  async function getStore() {
    const storeRef: DocumentReference = doc(db, 'stores', user_store);
    const storeDoc: DocumentData = await getDoc(storeRef);

    if (storeDoc.exists()) {
      setStoreInfo({
        avatar_url: storeDoc.data().avatar_url,
        store_name: storeDoc.data().name,
      });
    }
  }

  async function logout() {
    await auth.signOut();
    push('/sign-in');
  }

  React.useEffect(() => {
    if (user_loaded && user_id !== '') {
      getStore();
    }
  }, [user_loaded]);

  if (user_loaded && user_id === '') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            asChild
          >
            <Link href="/sign-in" aria-label="Creator Login">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary">
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Button className="w-full">
                <span>Sign In</span>
              </Button>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  if (!user_loaded || storeInfo === null) {
    return (
      <section className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            <Skeleton className="h-[17px] w-24" />
          </span>
          <span className="truncate text-xs">
            <Skeleton className="h-[15px] w-16" />
          </span>
        </div>
      </section>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={storeInfo.avatar_url}
                  alt={storeInfo.store_name}
                />
                <AvatarFallback className="rounded-lg">
                  <b>{storeInfo.store_name.slice(0, 1).toUpperCase()}</b>
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user_name}</span>
                <span className="truncate text-xs">@{user_store}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <Link
                href={`/store/${user_store}`}
                aria-label="Store"
                className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={storeInfo.avatar_url} alt={user_name} />
                  <AvatarFallback className="rounded-lg">
                    <b>{storeInfo.store_name.slice(0, 1).toUpperCase()}</b>
                  </AvatarFallback>
                </Avatar>
                <section className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user_name}</span>
                  <span className="truncate text-xs">@{user_store}</span>
                </section>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard`} className="w-full" aria-label="Store">
                  <FontAwesomeIcon className="icon mr-2" icon={faColumns} />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/products`}
                  className="w-full"
                  aria-label="My Products"
                >
                  <FontAwesomeIcon className="icon mr-2" icon={faShirt} />
                  My Products
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/preferences`}
                  className="w-full"
                  aria-label="Preferences"
                >
                  <FontAwesomeIcon className="icon mr-2" icon={faStore} />
                  Preferences
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FontAwesomeIcon className="icon mr-2" icon={faBrush} />
                  Appearance
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* <DropdownMenuSub>
                <DropdownMenuSubTrigger className="w-full cursor-pointer  px-4 py-1 focus:">
                  <FontAwesomeIcon className="icon mr-4" icon={faLanguage} />
                  Language
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="space-y-0 py-4">
                    <DropdownMenuItem
                      className="w-full cursor-pointer  px-4 py-1 focus:"
                      onClick={() => setTheme('light')}
                    >
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="w-full cursor-pointer  px-4 py-1 focus:"
                      onClick={() => setTheme('dark')}
                    >
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="w-full cursor-pointer  px-4 py-1 focus:"
                      onClick={() => setTheme('system')}
                    >
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="w-full cursor-pointer  px-4 py-1 focus:">
                  <FontAwesomeIcon className="icon mr-4" icon={faGlobe} />
                  Location
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="space-y-0 py-4">
                    <DropdownMenuItem
                      className="w-full cursor-pointer  px-4 py-1 focus:"
                      onClick={() => setTheme('light')}
                    >
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="w-full cursor-pointer  px-4 py-1 focus:"
                      onClick={() => setTheme('dark')}
                    >
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="w-full cursor-pointer  px-4 py-1 focus:"
                      onClick={() => setTheme('system')}
                    >
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/settings`}
                  className="w-full"
                  aria-label="Settings"
                >
                  <FontAwesomeIcon className="icon mr-2" icon={faCog} />
                  Settings
                </Link>
              </DropdownMenuItem>
              {user_role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href={`/admin`} className="w-full" aria-label="Admin">
                    <FontAwesomeIcon className="icon mr-2" icon={faToolbox} />
                    Admin
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Button
                variant="link"
                onClick={logout}
                className="flex h-auto w-full justify-start p-0"
              >
                <FontAwesomeIcon className="icon mr-2" icon={faSignOut} />
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
