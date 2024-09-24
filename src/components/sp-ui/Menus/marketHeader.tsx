import { Logo } from '@/components/sp-ui/Logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CartIcon } from './cartIcon';
import { MarketNav } from './marketNav';
import { UserIcon } from './userIcon';

export const MarketHeader = () => {
  return (
    <nav className="bg-layer-one flex h-[56px] items-center justify-between border-b-[1px] border-b-border px-4">
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
            <SheetDescription>
              <nav className={`bg-layer-one flex h-[100vh] pt-8`}>
                <MarketNav inSheet={true} />
              </nav>
            </SheetDescription>
          </SheetContent>
        </Sheet>
        <section className="w-[40px] md:w-[120px]">
          <Logo url="/" />
        </section>
      </div>
      <ul className="flex items-center gap-4">
        <li>
          <CartIcon />
        </li>
        <li>
          <UserIcon />
        </li>
      </ul>
    </nav>
  );
};
