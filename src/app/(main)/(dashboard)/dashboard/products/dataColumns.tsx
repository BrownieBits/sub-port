'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowDown,
  faArrowUp,
  faEye,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { revalidate } from './actions';

export type Product = {
  id: string;
  colors: string[];
  price: number;
  compare_at: number;
  currency: string;
  inventory: number;
  track_inventory: boolean;
  is_featured: boolean;
  like_count: number;
  name: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  revenue: number;
  tags: string[];
  product_type: string;
  units_sold: number;
  owner_id: string;
  view_count: number;
  status: 'Private' | 'Public';
  store_id: string;
  images: string[];
};

async function ChangeStatus(action: string, id: string) {
  const docRef = doc(db, 'products', id);
  if (action === 'Delete') {
    await updateDoc(docRef, {
      status: 'archived',
      updated_at: Timestamp.fromDate(new Date()),
    });
  } else {
    await updateDoc(docRef, {
      status: action,
      updated_at: Timestamp.fromDate(new Date()),
    });
  }
  revalidate();
}

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'currency',
    header: () => <div className="hidden"></div>,
    cell: ({ row }) => <div className="hidden"></div>,
  },
  {
    accessorKey: 'images',
    header: () => <div className="w-[60px] max-w-[60px]"></div>,
    cell: ({ row }) => {
      const imgs: string[] = row.getValue('images');

      return (
        <section className="jusitfy-center flex aspect-square w-[60px] max-w-[60px] items-center overflow-hidden rounded border">
          <Image
            src={imgs[0]}
            width="60"
            height="60"
            alt="Product Image"
            className="w-full"
          />
        </section>
      );
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
            Product
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
            Product
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
          Product
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'product_type',
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
            className="icon text-muted-foregroun ml-[5px] hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
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
            className="icon text-muted-foregroun ml-[5px] hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.getValue('status') === 'Public' ? (
        <span className="mr-2 rounded bg-success px-2.5 py-0.5 text-xs font-medium text-success-foreground">
          {row.getValue('status')}
        </span>
      ) : (
        <span className="mr-2 rounded bg-destructive px-2.5 py-0.5 text-xs font-medium text-destructive-foreground">
          {row.getValue('status')}
        </span>
      );
    },
  },
  {
    accessorKey: 'units_sold',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Units Sold
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
            Units Sold
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
          Units Sold
          <FontAwesomeIcon
            className="icon text-muted-foregroun ml-[5px] hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'view_count',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Views
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
            Views
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
          Views
          <FontAwesomeIcon
            className="icon text-muted-foregroun ml-[5px] hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'like_count',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Likes
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
            Likes
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
          Likes
          <FontAwesomeIcon
            className="icon text-muted-foregroun ml-[5px] hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'revenue',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Revenue
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
            Revenue
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
          Revenue
          <FontAwesomeIcon
            className="icon text-muted-foregroun ml-[5px] hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const currency = row.getValue('currency') as string;
      const amount = parseFloat(row.getValue('revenue'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      const store_id = row.getValue('store_id') as string;
      return (
        <section className="flex justify-end gap-4">
          <Button asChild variant="link" className="p-0 text-foreground">
            <Link href={`/dashboard/products/${id}`} aria-label="Edit Product">
              <FontAwesomeIcon className="icon" icon={faPenToSquare} />
            </Link>
          </Button>
          {row.getValue('status') === 'Public' ? (
            <Button
              variant="link"
              title="Make Private"
              onClick={() => ChangeStatus('Private', id)}
              className="p-0 text-foreground"
            >
              <FontAwesomeIcon className="icon" icon={faEyeSlash} />
            </Button>
          ) : (
            <Button
              variant="link"
              title="Make Public"
              onClick={() => ChangeStatus('Public', id)}
              className="p-0 text-foreground"
            >
              <FontAwesomeIcon className="icon" icon={faEye} />
            </Button>
          )}
          <Button
            variant="link"
            title="Delte"
            onClick={() => ChangeStatus('Delete', id)}
            className="p-0 text-foreground"
          >
            <FontAwesomeIcon className="icon" icon={faTrash} />
          </Button>
        </section>
      );
    },
  },
];
