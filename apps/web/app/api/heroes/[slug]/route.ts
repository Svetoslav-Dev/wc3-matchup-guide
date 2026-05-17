import { NextResponse } from "next/server";
import { getHeroBySlug } from "../../../../lib/content";
import { notFoundResponse } from "../../../../lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  const { slug } = await params;
  const hero = await getHeroBySlug(slug);

  if (!hero) {
    return notFoundResponse("Hero");
  }

  return NextResponse.json({ data: hero });
}
