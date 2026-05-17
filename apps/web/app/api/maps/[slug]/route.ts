import { NextResponse } from "next/server";
import { notFoundResponse } from "../../../../lib/api";
import { getMapBySlug } from "../../../../lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  const { slug } = await params;
  const map = await getMapBySlug(slug);

  if (!map) {
    return notFoundResponse("Map");
  }

  return NextResponse.json({ data: map });
}
