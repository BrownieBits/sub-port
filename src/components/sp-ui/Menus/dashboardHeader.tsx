import { AddProductButton } from '@/components/sp-ui/AddProductButton';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export const DashboardHeader = () => {
  return (
    <nav className="flex h-[56px] items-center justify-between border-b-[1px] border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>
      <ul className="flex items-center gap-4">
        <li>
          <Button asChild variant="link" size="sm" className="px-0">
            <Link href="/" aria-label="Spring by Amaze">
              <FontAwesomeIcon icon={faBell} />
            </Link>
          </Button>
        </li>
        <li>
          <AddProductButton copy="Create" variant="outline" size="sm" />
        </li>
      </ul>
    </nav>
  );
};
