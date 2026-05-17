import { NextResponse } from "next/server";

export const parsePositiveInt = (value: string | null, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

export const notFoundResponse = (resource: string) =>
  NextResponse.json({ error: `${resource} not found` }, { status: 404 });

