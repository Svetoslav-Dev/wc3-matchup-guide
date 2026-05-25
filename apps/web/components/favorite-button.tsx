"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { saveFavoriteAction, removeFavoriteAction } from "../app/builds/[slug]/favorite-actions";

const HeartSvg = ({ filled }: { filled: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

type Props = {
  buildSlug: string;
  isFavorite: boolean;
  isLoggedIn: boolean;
};

export function FavoriteButton({ buildSlug, isFavorite, isLoggedIn }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorite);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setOptimisticFavorite(isFavorite);
  }, [isFavorite]);

  const handleClick = () => {
    if (!isLoggedIn) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("auth", "login");
      router.push(`${pathname}?${params}`);
      return;
    }

    const nextFavorite = !optimisticFavorite;
    setOptimisticFavorite(nextFavorite);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("buildSlug", buildSlug);

        if (nextFavorite) {
          await saveFavoriteAction(fd);
        } else {
          await removeFavoriteAction(fd);
        }

        router.refresh();
      } catch (error) {
        setOptimisticFavorite(!nextFavorite);
        throw error;
      }
    });
  };

  return (
    <button
      className={`heart-btn heart-btn--detail${optimisticFavorite ? " heart-btn--filled" : ""}`}
      type="button"
      aria-label={optimisticFavorite ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={optimisticFavorite}
      onClick={handleClick}
      disabled={isPending}
    >
      <HeartSvg filled={optimisticFavorite} />
    </button>
  );
}
