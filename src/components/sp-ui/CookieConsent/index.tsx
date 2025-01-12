'use client';

import { Button } from '@/components/ui/button';
import { hasCookie, setCookie } from 'cookies-next/client';
import React from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = React.useState(true);

  React.useEffect(() => {
    setShowConsent(hasCookie('localConsent'));
  }, []);

  const acceptCookie = () => {
    const today = new Date();
    const expires = new Date(today.setMonth(today.getMonth() + 3));
    setShowConsent(true);
    setCookie('localConsent', 'true', {
      secure: true,
      expires: expires,
    });
  };

  if (showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 bg-background/75">
      <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-between gap-8 border-t-[1px] bg-background p-4 md:flex-row">
        <p className="text-foreground">
          This website uses cookies to improve user experience. By using our
          website you consent to all cookies in accordance with our Cookie
          Policy.
        </p>
        <div className="flex gap-8">
          <Button onClick={() => acceptCookie()}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
