import Link from "next/link";
import { JSX } from "react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  options?: React.ReactNode;
}

const triggerStyle = (isActive: boolean) => {
  return `
      ${isActive ? "bg-accent font-semibold text-blue-300 hover:text-blue-300" : ""}
      hover:bg-accent
    `;
};

const NavComponent = ({
  item,
  pathname,
  className,
}: {
  item: NavItem;
  pathname: string;
  className?: string;
}) => {
  return (
    <div className="flex items-center justify-between w-full group">
      <Link
        href={item.href}
        className={`flex items-center flex-1 min-w-0 ${triggerStyle(pathname === item.href)} ${className}`}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        <span className="ml-2 truncate">{item.title}</span>
      </Link>
      {item.options && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {item.options}
        </div>
      )}
    </div>
  );
};

export default NavComponent;
