import Link from "next/link";
import { JSX } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon: JSX.ElementType;
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
    <Link
      href={item.href}
      className={triggerStyle(pathname === item.href) + className}
    >
      <item.icon />
      <span className="ml-2">{item.title}</span>
    </Link>
  );
};

export default NavComponent;
