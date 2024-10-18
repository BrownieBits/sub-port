'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { auth, db } from '@/lib/firebase';
import userStore from '@/stores/userStore';
import {
  faBrush,
  faColumns,
  faGlobe,
  faLanguage,
  faRepeat,
  faShirt,
  faSignOut,
  faStore,
  faToolbox,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

type StoreInfo = {
  avatar_url: string;
  store_name: string;
};
export const UserDropdown = () => {
  const user_loaded = userStore((state) => state.user_loaded);
  const user_name = userStore((state) => state.user_name);
  const user_store = userStore((state) => state.user_store);
  const user_plan = userStore((state) => state.user_plan);
  const user_role = userStore((state) => state.user_role);
  const [storeInfo, setStoreInfo] = React.useState<StoreInfo | null>(null);
  const { push } = useRouter();
  const { setTheme } = useTheme();

  async function onSubmit() {
    await auth.signOut();
    push('/sign-in');
  }

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

  React.useEffect(() => {
    if (user_loaded) {
      getStore();
    }
  }, [user_loaded]);

  if (!user_loaded || storeInfo === null) {
    return <Skeleton className="h-[29px] w-[29px] rounded-full" />;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="bg-layer-one p-0 hover:bg-layer-one">
          <Avatar className="h-[29px] w-[29px] bg-secondary text-foreground">
            <AvatarImage
              src={storeInfo.avatar_url}
              alt={storeInfo.store_name}
            />
            <AvatarFallback className="border-primary bg-primary text-foreground">
              <b>{storeInfo.store_name.slice(0, 1).toUpperCase()}</b>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuGroup className="space-y-0 py-4">
          <DropdownMenuItem className="px-4 py-1">
            <p>
              <b>{user_name}</b>
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
          >
            <Link href={`/store/${user_store}`} aria-label="Store">
              @{user_store}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-0 py-4">
          {user_plan !== 'free' && (
            <DropdownMenuItem
              asChild
              className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
            >
              <Link href={`/switch-stores`} aria-label="Switch Store">
                <FontAwesomeIcon className="icon mr-4" icon={faRepeat} />
                Swtich Stores
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
          >
            <form action={onSubmit}>
              <button type="submit" className="w-full text-left">
                <FontAwesomeIcon className="icon mr-4" icon={faSignOut} />
                Sign Out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-0 py-4">
          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
          >
            <Link href={`/dashboard`} className="w-full" aria-label="Store">
              <FontAwesomeIcon className="icon mr-4" icon={faColumns} />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
          >
            <Link
              href={`/dashboard/products`}
              className="w-full"
              aria-label="Store"
            >
              <FontAwesomeIcon className="icon mr-4" icon={faShirt} />
              My Products
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
          >
            <Link
              href={`/dashboard/preferences`}
              className="w-full"
              aria-label="Store"
            >
              <FontAwesomeIcon className="icon mr-4" icon={faStore} />
              Preferences
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-0 py-4">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three">
              <FontAwesomeIcon className="icon mr-4" icon={faBrush} />
              Appearance
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="space-y-0 py-4">
                <DropdownMenuItem
                  className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
                  onClick={() => setTheme('light')}
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
                  onClick={() => setTheme('system')}
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three">
              <FontAwesomeIcon className="icon mr-4" icon={faLanguage} />
              Language
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="space-y-0 py-4">
                <DropdownMenuItem
                  className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
                  onClick={() => setTheme('light')}
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
                  onClick={() => setTheme('system')}
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three">
              <FontAwesomeIcon className="icon mr-4" icon={faGlobe} />
              Location
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="space-y-0 py-4">
                <DropdownMenuItem
                  className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
                  onClick={() => setTheme('light')}
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
                  onClick={() => setTheme('system')}
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {user_role === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-0 py-4">
              <DropdownMenuItem
                asChild
                className="w-full cursor-pointer bg-layer-one px-4 py-1 focus:bg-layer-three"
              >
                <Link href={`/admin`} aria-label="Admin">
                  <FontAwesomeIcon className="icon mr-4" icon={faToolbox} />
                  Admin
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
