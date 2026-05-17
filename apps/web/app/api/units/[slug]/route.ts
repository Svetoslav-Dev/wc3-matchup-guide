import { NextResponse } from "next/server";
import { notFoundResponse } from "../../../../lib/api";
import { getUnitBySlug } from "../../../../lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  const { slug } = await params;
  const unit = await getUnitBySlug(slug);

  if (!unit) {
    return notFoundResponse("Unit");
  }

  return NextResponse.json({ data: unit });
}
