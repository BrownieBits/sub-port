import { MenuItem } from './menuItem';
import { _NavItem } from './types';

type Props = {
  inSheet: boolean;
  items: _NavItem[];
};
export const MenuItems = async (props: Props) => {
  return (
    <ul className={`flex flex-col border-b-[1px] border-b-border py-4`}>
      {props.items.map((item: _NavItem, index: number) => {
        return (
          <li key={`nav_item_${item.name}`}>
            <MenuItem item={item} inSheet={props.inSheet} />
          </li>
        );
      })}
    </ul>
  );
};
