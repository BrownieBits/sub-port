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
import { format } from 'date-fns';
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { revalidate } from './actions';

export type Product = {
  id: string;
  banner_url: string;
  body: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  status: string;
  filter: string;
};

async function ChangeStatus(action: string, id: string) {
  const docRef = doc(db, 'blog', id);
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
    accessorKey: 'banner_url',
    header: () => <div className="w-[60px] max-w-[60px]"></div>,
    cell: ({ row }) => {
      if (row.getValue('banner_url') === '') {
        return <></>;
      }

      return (
        <section className="jusitfy-center flex aspect-square w-[60px] max-w-[60px] items-center overflow-hidden rounded border">
          <Image
            src={row.getValue('banner_url')}
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
    accessorKey: 'created_at',
    header: ({ column }) => {
      if (column.getIsSorted() === 'asc') {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="bg-inherit p-0 text-foreground hover:bg-inherit"
          >
            Created
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
            Created
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
          Created
          <FontAwesomeIcon
            className="icon ml-[5px] text-muted-foreground hover:text-foreground"
            icon={faArrowDown}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (
        row.getValue('created_at') === undefined ||
        row.getValue('created_at') === null
      ) {
        return <></>;
      }
      return <p>{format(row.getValue('created_at'), 'LLL dd, yyyy')}</p>;
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return (
        <section className="flex justify-end gap-4">
          <Button asChild variant="link" className="p-0 text-foreground">
            <Link href={`/admin/blog/${id}`} aria-label="Edit Post">
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
