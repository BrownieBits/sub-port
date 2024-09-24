'use client';

import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import React from 'react';

export default function ProductComments(props: {}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  React.useEffect(() => {}, []);

  if (isDesktop) {
    return <></>;
  }
  return <></>;
}
