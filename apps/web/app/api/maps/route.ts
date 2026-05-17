import { NextRequest, NextResponse } from "next/server";
import { parsePositiveInt } from "../../../lib/api";
import { listMaps } from "../../../lib/content";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(searchParams.get("pageSize"), 20);

  return NextResponse.json(await listMaps(page, pageSize));
}
