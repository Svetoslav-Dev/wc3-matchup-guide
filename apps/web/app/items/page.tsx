import { listItems } from "../../lib/content";
import { ItemsClient } from "../../components/items-client";

export const revalidate = 3600;

type Props = {
  searchParams?: Promise<{ tab?: string }>;
};

export default async function ItemsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const initialTab = params.tab ?? "all";
  const items = await listItems();

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Item Reference</p>
        <h1 className="page-title">Items that turn the tide of fights</h1>
        <p className="page-intro">
          Browse creep-drop loot, faction shop stock, and neutral market inventories in one place.
        </p>
      </div>
      <ItemsClient items={items} initialTab={initialTab} />
    </div>
  );
}
