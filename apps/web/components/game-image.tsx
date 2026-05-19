"use client";

import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

export function GameImage({ src, alt, className, width = 256, height = 256 }: Props) {
  const [errored, setErrored] = useState(false);
  const resolvedSrc = !src || errored ? "/images/placeholder.svg" : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className ?? "game-image"}
      onError={() => setErrored(true)}
    />
  );
}
