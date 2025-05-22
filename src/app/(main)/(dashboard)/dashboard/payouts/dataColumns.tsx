'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { revalidate } from './actions';
import { PayoutBadge } from './payoutBadge';

export type Order = {
  id: string;
  order_id: string;
  name: string;
  amount: number;
  status: string;
  order_date: Date;
  item_count: number;
  store_id: string;
  payout_status: string;
  payout_total: number;
  payout_date?: Date;
  tax_fees: number;
  filter: string;
};

export async function ChangeStatus(
  action: string | boolean,
  id: string,
  item: 'status' | 'show',
  store_id: string
) {
  const docRef = doc(db, `stores/${store_id}/promotions`, id);
  if (action === 'Delete') {
    await deleteDoc(docRef);
    revalidate('/dashboard/orders');
    return;
  }
  if (item === 'status') {
    await updateDoc(docRef, {
      status: action,
    });
    revalidate('/dashboard/orders');
  } else {
    await updateDoc(docRef, {
      show_in_banner: action,
    });
    revalidate('/dashboard/orders');
  }
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'filter',
    header: () => <div className="hidden">Filter</div>,
    cell: ({ row }) => <div className="hidden">{row.getValue('filter')}</div>,
  },
  {
    accessorKey: 'store_id',
    header: () => <div className="hidden"></div>,
    cell: ({ row }) => <div className="hidden"></div>,
  },
  {
    accessorKey: 'id',
    header: () => <div className="hidden"></div>,
    cell: ({ row }) => <div className="hidden"></div>,
  },
  {
    accessorKey: 'order_id',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Order ID
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Order ID
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="bg-inherit p-0 hover:bg-inherit"
        >
          Order ID
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p>
          <b>{row.getValue('order_id')}</b>
        </p>
      );
    },
  },
  {
    accessorKey: 'order_date',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Order Date
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Order Date
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="bg-inherit p-0 hover:bg-inherit"
        >
          Order Date
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{format(row.getValue('order_date'), 'LLL dd, yyyy')}</p>;
    },
  },
  {
    accessorKey: 'payout_date',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Payout Date
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Payout Date
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="bg-inherit p-0 hover:bg-inherit"
        >
          Payout Date
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (
        row.getValue('payout_date') === undefined ||
        row.getValue('payout_date') === null
      ) {
        return;
      }
      return <p>{format(row.getValue('payout_date'), 'LLL dd, yyyy')}</p>;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Order Total
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Order Total
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="bg-inherit p-0 hover:bg-inherit"
        >
          Order Total
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format((row.getValue('amount') as number) / 100)}
        </p>
      );
    },
  },
  {
    accessorKey: 'tax_fees',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Taxes & Fees
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Taxes & Fees
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="bg-inherit p-0 hover:bg-inherit"
        >
          Taxes & Fees
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format((row.getValue('tax_fees') as number) / 100)}
        </p>
      );
    },
  },
  {
    accessorKey: 'payout_total',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Payout Total
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Payout Total
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
          </Button>
        );
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="bg-inherit p-0 hover:bg-inherit"
        >
          Payout Total
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="font-bold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format((row.getValue('payout_total') as number) / 100)}
        </p>
      );
    },
  },
  {
    accessorKey: 'payout_status',
    header: ({ column }) => {
      return (
        <section className="flex items-center justify-end">
          {column.getIsSorted() === 'asc' && (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="text-foreground bg-inherit p-0 hover:bg-inherit"
            >
              Payout Status
              <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
            </Button>
          )}
          {column.getIsSorted() === 'desc' && (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="text-foreground bg-inherit p-0 hover:bg-inherit"
            >
              Payout Status
              <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowUp} />
            </Button>
          )}
          {column.getIsSorted() !== 'asc' &&
            column.getIsSorted() !== 'desc' && (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc')
                }
                className="bg-inherit p-0 hover:bg-inherit"
              >
                Payout Status
                <FontAwesomeIcon
                  className="icon text-muted-foreground hover:text-foreground ml-[5px]"
                  icon={faArrowDown}
                />
              </Button>
            )}
        </section>
      );
    },
    cell: ({ row }) => {
      return (
        <section className="flex items-center justify-end">
          <PayoutBadge
            payout_status={row.getValue('payout_status') as string}
          />
        </section>
      );
    },
  },
  // {
  //   accessorKey: 'actions',
  //   header: '',
  //   cell: ({ row }) => {
  //     const id = row.getValue('id') as string;

  //     return (
  //       <section className="flex items-center justify-end gap-4">
  //         <Button
  //           variant="link"
  //           title="View Order"
  //           className="text-foreground p-0"
  //           asChild
  //         >
  //           <Link href={`/dashboard/payouts/${id}`}>
  //             <FontAwesomeIcon className="icon" icon={faEye} />
  //           </Link>
  //         </Button>
  //       </section>
  //     );
  //   },
  // },
];
