import { Logo } from '@/components/sp-ui/Logo';
import { UserDropdown } from '@/components/sp-ui/UserDropdown';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AdminNav } from './adminNav';

export const AdminHeader = () => {
  return (
    <header className="flex h-[56px] items-center justify-between border-b-[1px] border-b-border px-4">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger className="flex xl:hidden" asChild>
            <Button variant="outline" size="sm" className="hover:">
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetTitle className="hidden"></SheetTitle>
            <nav className={`flex h-[100vh] pt-8`}>
              <AdminNav inSheet={true} />
            </nav>
          </SheetContent>
        </Sheet>
        <section className="w-[40px] md:w-[120px]">
          <Logo url="/admin" />
        </section>
      </div>
      <ul className="flex items-center gap-4 md:gap-8">
        {/* <li>
          <Button asChild variant="link" size="sm" className="px-0">
            <Link href="/" aria-label="Spring by Amaze">
              <FontAwesomeIcon icon={faBell} />
            </Link>
          </Button>
        </li>
        <li>
          <AddProductButton
            copy="Create"
            variant="outline"
            size="sm"
            className=" hover:"
          />
        </li> */}
        <li>
          <UserDropdown />
        </li>
      </ul>
    </header>
  );
};
