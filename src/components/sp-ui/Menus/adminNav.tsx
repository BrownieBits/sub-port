import { ScrollArea } from '@/components/ui/scroll-area';
import { admin_nav_items } from './adminNavItems';
import { MenuItems } from './menuItems';
import { _NavSection } from './types';

type Props = {
  inSheet: boolean;
};
export const AdminNav = async (props: Props) => {
  return (
    <ScrollArea className="flex h-full w-full flex-col rounded-md">
      {admin_nav_items.map((item: _NavSection) => {
        return (
          <MenuItems
            inSheet={props.inSheet}
            items={item.items}
            key={`menu-item-${item.name}`}
          />
        );
      })}
    </ScrollArea>
  );
};
