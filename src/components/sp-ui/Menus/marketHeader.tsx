import { SidebarTrigger } from '@/components/ui/sidebar';
import { CartIcon } from './cartIcon';

export const MarketHeader = () => {
  return (
    <nav className="flex h-[56px] items-center justify-between border-b-[1px] border-border bg-sidebar/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
      <ul className="flex items-center gap-4">
        <li>
          <CartIcon />
        </li>
      </ul>
    </nav>
  );
};
