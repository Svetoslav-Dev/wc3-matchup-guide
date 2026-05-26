"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type Props = { placeholder?: string };

export function AdminSearchInput({ placeholder = "Search…" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  const push = (v: string) => {
    const qs = new URLSearchParams(searchParams.toString());
    if (v.trim()) qs.set("q", v.trim());
    else qs.delete("q");
    router.replace(`${pathname}?${qs.toString()}`);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => push(v), 300);
  };

  return (
    <div className="admin-toolbar__search">
      <input
        className="admin-toolbar__input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}
