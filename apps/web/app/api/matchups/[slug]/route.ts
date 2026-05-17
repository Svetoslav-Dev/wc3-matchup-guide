import { NextResponse } from "next/server";
import { getMatchupBySlug } from "../../../../lib/content";
import { notFoundResponse } from "../../../../lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  const { slug } = await params;
  const matchup = await getMatchupBySlug(slug);

  if (!matchup) {
    return notFoundResponse("Matchup");
  }

  return NextResponse.json({ data: matchup });
}
