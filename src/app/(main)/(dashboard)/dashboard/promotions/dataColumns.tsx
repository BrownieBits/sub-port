'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { db } from '@/lib/firebase';
import {
  faArrowDown,
  faArrowUp,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import { getCookie } from 'cookies-next';
import { format } from 'date-fns';
import { Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { revalidate } from './actions';
import { EditPromotionButton } from './editPromotionButton';

export type Promotion = {
  id: string;
  amount: number;
  name: string;
  minimum_order_value: number;
  number_of_uses: number;
  times_used: number;
  type: string;
  user_id: string;
  expiration_date: Timestamp | undefined;
  status: 'Active' | 'Inactive';
  store_id: string;
};

export async function ChangeStatus(
  action: string | boolean,
  id: string,
  item: 'status' | 'show'
) {
  const store_id = getCookie('default_store');
  const docRef = doc(db, 'stores', store_id!, 'promotions', id);
  if (action === 'Delete') {
    await deleteDoc(docRef);
    revalidate();
    return;
  }
  if (item === 'status') {
    await updateDoc(docRef, {
      status: action,
    });
    revalidate();
  } else {
    await updateDoc(docRef, {
      show_in_banner: action,
    });
    revalidate();
  }
}

export const columns: ColumnDef<Promotion>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Code
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
            Code
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
          Code
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
          <b>{row.getValue('name')}</b>
        </p>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Type
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
            Type
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
          Type
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
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
      const type = row.getValue('type') as string;
      if (type === 'Flat Amount') {
        return (
          <p>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(row.getValue('amount'))}
          </p>
        );
      }
      return <p>{row.getValue('amount')}%</p>;
    },
  },
  {
    accessorKey: 'times_used',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            # of Times Used
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
            # of Times Used
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
          # of Times Used
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'minimum_order_value',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Min Order Value
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
            Min Order Value
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
          Min Order Value
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.getValue('minimum_order_value') === 0) {
        return <></>;
      }
      return (
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(row.getValue('minimum_order_value'))}
        </p>
      );
    },
  },
  {
    accessorKey: 'expiration_date',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Expiration Date
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
            Expiration Date
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
          Expiration Date
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (
        row.getValue('expiration_date') === undefined ||
        row.getValue('expiration_date') === null
      ) {
        return <></>;
      }
      const timestamp = row.getValue('expiration_date') as Timestamp;
      return (
        <p>{format(new Date(timestamp.seconds * 1000), 'LLL dd, yyyy')}</p>
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
            Status
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
            Status
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
          Status
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const store_id = row.getValue('store_id') as string;
      const on = row.getValue('status') === 'Active' ? true : false;
      return (
        <Switch
          id="status"
          aria-label={`Status ${row.getValue('status')}`}
          title={`Status ${row.getValue('status')}`}
          checked={on}
          onCheckedChange={(event) => {
            if (event) {
              ChangeStatus('Active', id, 'status');
            } else {
              ChangeStatus('Inactive', id, 'status');
            }
          }}
        />
      );
    },
  },
  {
    accessorKey: 'show_in_banner',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Show In Banner
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
            Show In Banner
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
          Show In Banner
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const store_id = row.getValue('store_id') as string;
      return (
        <Switch
          id="status"
          aria-label={`Status ${row.getValue('show_in_banner')}`}
          title={`Status ${row.getValue('show_in_banner')}`}
          checked={row.getValue('show_in_banner')}
          onCheckedChange={(event) => {
            if (event) {
              ChangeStatus(true, id, 'show');
            } else {
              ChangeStatus(false, id, 'show');
            }
          }}
        />
      );
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const name = row.getValue('name') as string;
      const min_order_value = row.getValue('minimum_order_value') as number;
      const amount = row.getValue('amount') as number;
      const type = row.getValue('type') as
        | 'Flat Amount'
        | 'Percentage'
        | undefined;
      const store_id = row.getValue('store_id') as string;
      const expiration_date = row.getValue('expiration_date') as Timestamp;
      return (
        <section className="flex items-center justify-end gap-4">
          <EditPromotionButton
            id={id}
            name={name}
            minimum_order_value={min_order_value}
            amount={amount}
            type={type}
            expiration_date={expiration_date}
          />
          <Button
            variant="link"
            title="Make Active"
            onClick={() => ChangeStatus('Delete', id, 'show')}
            className="p-0 text-foreground"
          >
            <FontAwesomeIcon className="icon" icon={faTrash} />
          </Button>
        </section>
      );
    },
  },
];
