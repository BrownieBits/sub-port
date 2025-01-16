'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { db } from '@/lib/firebase';
import { faFedex, faUps, faUsps } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowDown,
  faArrowUp,
  faEnvelope,
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
  delivery_methods: string[];
  store_id: string;
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
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
    accessorKey: 'name',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Customer Name
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Customer Name
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
          Customer Name
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{row.getValue('name')}</p>;
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
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
          }).format(row.getValue('amount'))}
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.getValue('status') === 'Unfulfilled') {
        return (
          <span className="mr-2 rounded bg-warning px-2.5 py-0.5 text-xs font-medium text-warning-foreground">
            {row.getValue('status')}
          </span>
        );
      }
      if (row.getValue('status') === 'Fulfilled') {
        return (
          <span className="mr-2 rounded bg-success px-2.5 py-0.5 text-xs font-medium text-success-foreground">
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
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
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
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
    accessorKey: 'delivery_methods',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Delivery Methods
            <FontAwesomeIcon className="icon ml-[5px]" icon={faArrowDown} />
          </Button>
        );
      } else if (column.getIsSorted() === 'desc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Delivery Methods
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
          Delivery Methods
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const deliveryMethods: string[] = row.getValue('delivery_methods');
      return (
        <section className="flex items-center gap-2">
          {deliveryMethods.includes('digital') && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-lg">
                  <FontAwesomeIcon className="icon" icon={faEnvelope} />
                </p>
              </TooltipTrigger>
              <TooltipContent>Digital</TooltipContent>
            </Tooltip>
          )}
          {deliveryMethods.includes('usps') && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-lg">
                  <FontAwesomeIcon className="icon" icon={faUsps} />
                </p>
              </TooltipTrigger>
              <TooltipContent>USPS</TooltipContent>
            </Tooltip>
          )}
          {deliveryMethods.includes('fedex') && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-lg">
                  <FontAwesomeIcon className="icon" icon={faFedex} />
                </p>
              </TooltipTrigger>
              <TooltipContent>Fedex</TooltipContent>
            </Tooltip>
          )}
          {deliveryMethods.includes('ups') && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-lg">
                  <FontAwesomeIcon className="icon" icon={faUps} />
                </p>
              </TooltipTrigger>
              <TooltipContent>Fedex</TooltipContent>
            </Tooltip>
          )}
        </section>
      );
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
            className="p-0 text-foreground"
            asChild
          >
            <Link href={`/dashboard/orders/${id}`}>
              <FontAwesomeIcon className="icon" icon={faEye} />
            </Link>
          </Button>
        </section>
      );
    },
  },
];
