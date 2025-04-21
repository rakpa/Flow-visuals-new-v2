import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Plus,
  Tag,
  CalendarRange,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface NavbarProps {
  closeSidebar?: () => void;
}

const Navbar = ({ closeSidebar }: NavbarProps) => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <nav className="flex-1 overflow-auto py-6 px-4">
      <ul className="space-y-2">
        <li>
          <Link
            to="/"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
              currentPath === '/'
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/transactions"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
              currentPath === '/transactions'
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Plus className="h-5 w-5" />
            <span>Transactions</span>
          </Link>
        </li>
        <li>
          <Link
            to="/categories"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
              currentPath === '/categories'
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Tag className="h-5 w-5" />
            <span>Categories</span>
          </Link>
        </li>
        <li>
          <Link
            to="/monthly-summary"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
              currentPath === '/monthly-summary'
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <CalendarRange className="h-5 w-5" />
            <span>Monthly Summary</span>
          </Link>
        </li>
        <li>
          <Link
            to="/summary"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
              currentPath === '/summary'
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <CalendarRange className="h-5 w-5" />
            <span>Summary</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  text: string;
  active?: boolean;
  onClick: () => void;
}


const NavItem = ({ icon: Icon, text, active, onClick }: NavItemProps) => {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{text}</span>
    </button>
  );
};

export default Navbar;