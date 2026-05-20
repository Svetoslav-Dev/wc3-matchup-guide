"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  god?: boolean;
};

const isActiveRoute = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Main">
      {items.map((item) => {
        const active = isActiveRoute(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "nav__link",
              active ? "nav__link--active" : "",
              item.god ? "nav__link--god" : "",
            ].filter(Boolean).join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
