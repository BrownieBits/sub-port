'use client';

import { Button } from '@/components/ui/button';
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
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCookie } from 'cookies-next';
import { doc } from 'firebase/firestore';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignOut } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
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

export const UserDropdown = () => {
  const user_name = userStore((state) => state.user_name);
  const user_store = userStore((state) => state.user_store);
  const user_plan = userStore((state) => state.user_plan);
  const default_store = getCookie('default_store') || 'f';
  const docRef = doc(db, 'stores', default_store!);
  const [value, loadingDoc, docError] = useDocument(docRef);
  const [signOut, loading, error] = useSignOut(auth);
  const { push } = useRouter();
  const { setTheme } = useTheme();

  async function onSubmit() {
    push('/sign-in');
    await signOut();
  }

  if (user_store === '') {
    return <></>;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="bg-layer-one p-0 hover:bg-layer-one">
          <Avatar className="h-[29px] w-[29px] bg-secondary text-foreground">
            <AvatarImage
              src={value?.data()?.avatar_url}
              alt={value?.data()?.name}
            />
            <AvatarFallback className="border-primary bg-primary text-foreground">
              <b>{value?.data()?.name.slice(0, 1).toUpperCase()}</b>
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
              @{default_store}
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
              <Link href={`/switch-stores`} aria-label="Store">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
