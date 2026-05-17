import { NextResponse } from "next/server";
import { getRaceBySlug } from "../../../../lib/content";
import { notFoundResponse } from "../../../../lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  const { slug } = await params;
  const race = await getRaceBySlug(slug);

  if (!race) {
    return notFoundResponse("Race");
  }

  return NextResponse.json({ data: race });
}
