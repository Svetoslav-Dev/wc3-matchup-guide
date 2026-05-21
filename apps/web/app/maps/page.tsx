import { listMaps } from "../../lib/content";
import { MapsClient } from "../../components/maps-client";

export const revalidate = 3600;

type Props = {
  searchParams?: Promise<{ mode?: string }>;
};

export default async function MapsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const allMaps = (await listMaps(1, 200)).data;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Map Library</p>
        <h1 className="page-title">Map shape changes every timing window.</h1>
        <p className="page-intro">
          Toggle between classic solo, team, and free-for-all pools from one page. Each map still
          opens its own guide with creep and expansion notes.
        </p>
      </div>
      <MapsClient allMaps={allMaps} initialMode={params.mode} />
    </div>
  );
}
