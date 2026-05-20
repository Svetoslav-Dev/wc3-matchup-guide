"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "../app/auth-actions";

type Props = {
  username: string;
};

export function UserMenu({ username }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="user-menu" ref={ref}>
      <button
        className="user-menu__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {username}
      </button>
      {open ? (
        <div className="user-menu__dropdown">
          <Link href="/favorites" className="user-menu__item" onClick={() => setOpen(false)}>
            Favorites
          </Link>
          <Link href="/builds/my-builds" className="user-menu__item" onClick={() => setOpen(false)}>
            My Builds
          </Link>
          <Link href="/builds/submit" className="user-menu__item" onClick={() => setOpen(false)}>
            Submit a Build
          </Link>
          <form action={logoutAction}>
            <button className="user-menu__item user-menu__item--danger" type="submit">
              Log Out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
