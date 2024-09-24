'use client';

import { auth } from '@/lib/firebase';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '../../ui/button';
import { UserDropdown } from '../UserDropdown';

export const UserIcon = () => {
  const [user, userLoading, userError] = useAuthState(auth);
  return (
    <>
      {user ? (
        <UserDropdown />
      ) : (
        <Button
          asChild
          variant="outline"
          className="bg-layer-one hover:bg-layer-two"
        >
          <Link href="/sign-in" aria-label="Creator Login">
            <FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
      )}
    </>
  );
};
