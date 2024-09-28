import { AddProductButton } from '@/components/sp-ui/AddProductButton';
import { Logo } from '@/components/sp-ui/Logo';
import { UserDropdown } from '@/components/sp-ui/UserDropdown';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { DashboardNav } from './dashboardNav';

export const DashboardHeader = () => {
  return (
    <header className="flex h-[56px] items-center justify-between border-b-[1px] border-b-border bg-layer-one px-4">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger className="flex xl:hidden" asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-layer-one hover:bg-layer-two"
            >
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetTitle className="hidden"></SheetTitle>
            <nav className={`flex h-[100vh] bg-layer-one pt-8`}>
              <DashboardNav inSheet={true} />
            </nav>
          </SheetContent>
        </Sheet>
        <section className="w-[40px] md:w-[120px]">
          <Logo url="/dashboard" />
        </section>
      </div>
      <ul className="flex items-center gap-4 md:gap-8">
        <li>
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
            className="bg-layer-one hover:bg-layer-two"
          />
        </li>
        <li>
          <UserDropdown />
        </li>
      </ul>
    </header>
  );
};
