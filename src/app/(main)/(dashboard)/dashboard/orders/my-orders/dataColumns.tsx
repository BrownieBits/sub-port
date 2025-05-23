'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import {
  faArrowDown,
  faArrowUp,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { revalidate } from './actions';

export type Order = {
  id: string;
  order_id: string;
  name: string;
  amount: number;
  status: string;
  order_date: Date;
  item_count: number;
  store_id: string[];
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
    accessorKey: 'amount',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Amount
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
            Amount
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
          Amount
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
    accessorKey: 'status',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Fulfillment Status
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
            Fulfillment Status
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
          Fulfillment Status
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (
        row.getValue('status') === 'Unfulfilled' ||
        row.getValue('status') === 'Partially Fulfilled'
      ) {
        return (
          <span className="bg-warning text-warning-foreground mr-2 rounded px-2.5 py-0.5 text-xs font-medium">
            {row.getValue('status')}
          </span>
        );
      }
      if (
        row.getValue('status') === 'Fulfilled' ||
        row.getValue('status') === 'Fulfilled Digital'
      ) {
        return (
          <span className="bg-success text-success-foreground mr-2 rounded px-2.5 py-0.5 text-xs font-medium">
            {row.getValue('status')}
          </span>
        );
      }
      if (
        row.getValue('status') === 'Cancelled' ||
        row.getValue('status') === 'Refunded'
      ) {
        return (
          <span className="bg-destructive text-destructive-foreground mr-2 rounded px-2.5 py-0.5 text-xs font-medium">
            {row.getValue('status')}
          </span>
        );
      }
      return <></>;
    },
  },
  {
    accessorKey: 'item_count',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="text-foreground bg-inherit p-0 hover:bg-inherit"
          >
            Item Count
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
            Item Count
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
          Item Count
          <FontAwesomeIcon
            className="icon text-muted-foreground hover:text-foreground ml-[5px]"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <>{row.getValue('item_count')}</>;
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;

      return (
        <section className="flex items-center justify-end gap-4">
          <Button
            variant="link"
            title="View Order"
            className="text-foreground p-0"
            asChild
          >
            <Link href={`/dashboard/orders/my-orders/${id}`}>
              <FontAwesomeIcon className="icon" icon={faEye} />
            </Link>
          </Button>
        </section>
      );
    },
  },
];
