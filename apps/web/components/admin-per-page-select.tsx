"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPTIONS = [20, 50, 100] as const;

export function AdminPerPageSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = Number(searchParams.get("perPage")) || 20;

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("perPage", e.target.value);
    qs.delete("loaded");
    router.replace(`${pathname}?${qs.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={onChange}
      aria-label="Results per page"
      style={{
        width: "auto",
        cursor: "pointer",
        fontSize: "0.75rem",
        padding: "0.25rem 0.5rem",
        borderRadius: "8px",
        border: "1px solid var(--color-line)",
        background: "rgba(255,255,255,0.04)",
        color: "var(--color-muted)",
      }}
    >
      {OPTIONS.map((n) => (
        <option key={n} value={n}>{n} per page</option>
      ))}
    </select>
  );
}
