"use client";

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
          <form action={logoutAction}>
            <button className="user-menu__item" type="submit">
              Log Out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
