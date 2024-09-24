import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  faCloudArrowDown,
  faImagePortrait,
  faSquarePlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export const AddProductButton = (props: {
  copy: string;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
  size?: 'default' | 'icon' | 'lg' | 'sm' | null | undefined;
  className?: string | '';
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          asChild
          variant={props.variant}
          size={props.size}
          className={props.className}
        >
          <div>
            <FontAwesomeIcon
              className="icon mr-2 h-4 w-4"
              icon={faSquarePlus}
            />
            {props.copy}
          </div>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogHeader className="flex w-full flex-row items-center justify-between">
            <AlertDialogTitle>Choose product type to add</AlertDialogTitle>
            <AlertDialogCancel className="m-0 border-0 p-0" asChild>
              <FontAwesomeIcon className="icon h-4 w-4" icon={faXmark} />
            </AlertDialogCancel>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <section className="flex w-full gap-8 pt-8">
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-auto flex-1 py-4"
                  asChild
                >
                  <Link
                    href="/dashboard/products/new-digital"
                    className="group flex flex-col items-center"
                  >
                    <FontAwesomeIcon
                      className="icon pb-4 text-6xl text-foreground group-hover:text-primary"
                      icon={faCloudArrowDown}
                    />
                    <p className="text-xs text-foreground">
                      <b>Digital Product</b>
                    </p>
                  </Link>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-auto flex-1 py-4"
                  asChild
                >
                  <Link
                    href="/dashboard/products/new-self-made"
                    className="group flex flex-col items-center"
                  >
                    <FontAwesomeIcon
                      className="icon pb-4 text-6xl text-foreground group-hover:text-primary"
                      icon={faImagePortrait}
                    />
                    <p className="text-xs text-foreground">
                      <b>My Own Product</b>
                    </p>
                  </Link>
                </Button>
              </AlertDialogTrigger>
            </section>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
