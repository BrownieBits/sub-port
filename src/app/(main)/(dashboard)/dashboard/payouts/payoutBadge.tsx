'use client';

import { Badge } from '@/components/ui/badge';

export const PayoutBadge = ({ payout_status }: { payout_status: string }) => {
  if (payout_status === 'Pending') {
    return <Badge variant="warning">Payout {payout_status}</Badge>;
  } else if (payout_status === 'Paid') {
    return <Badge variant="success">Payout {payout_status}</Badge>;
  }
  return <Badge variant="destructive">{payout_status}</Badge>;
};
