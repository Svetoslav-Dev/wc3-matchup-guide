import { listUnits } from "../../lib/content";
import { UnitsFilterClient } from "../../components/units-filter-client";

export default async function UnitsPage() {
  const result = await listUnits(1, 500);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Unit Library</p>
        <h1 className="page-title">Core units define timing, control, and counters.</h1>
        <p className="page-intro">
          Filter by race to browse a faction's full roster. Mercenary covers neutral camp
          hireables available to any race on the map.
        </p>
      </div>
      <UnitsFilterClient units={result.data} />
    </div>
  );
}
