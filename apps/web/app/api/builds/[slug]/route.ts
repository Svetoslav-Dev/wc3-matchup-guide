import { NextResponse } from "next/server";
import { getBuildBySlug } from "../../../../lib/content";
import { notFoundResponse } from "../../../../lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  const { slug } = await params;
  const build = await getBuildBySlug(slug);

  if (!build) {
    return notFoundResponse("Build");
  }

  return NextResponse.json({ data: build });
}
