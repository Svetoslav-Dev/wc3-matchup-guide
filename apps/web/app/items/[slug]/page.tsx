import { notFound } from "next/navigation";
import Link from "next/link";
import { items } from "../../../lib/static-content";
import { GameImage } from "../../../components/game-image";

function slugify(name: string): string {
  return name.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type ItemDetail = {
  goldCost?: number;
  sellPrice?: number;
  notSellable?: boolean;
  consumeNote?: string;
  dropsFrom?: string[];
};

const ITEM_DETAIL: Record<string, ItemDetail> = {
  "Potion of Healing":                { goldCost: 150,  sellPrice: 75 },
  "Potion of Mana":                   { goldCost: 150,  sellPrice: 75 },
  "Scroll of Town Portal":            { goldCost: 135,  sellPrice: 67 },
  "Staff of Sanctuary":               { goldCost: 150,  sellPrice: 75 },
  "Orb of Fire":                      { goldCost: 275,  sellPrice: 137 },
  "Healing Salve":                    { goldCost: 100,  sellPrice: 50 },
  "Orb of Lightning":                 { goldCost: 275,  sellPrice: 137 },
  "Orb of Corruption":                { goldCost: 275,  sellPrice: 137 },
  "Staff of Preservation":            { goldCost: 150,  sellPrice: 75 },
  "Orb of Venom":                     { goldCost: 275,  sellPrice: 137 },
  "Boots of Speed":                   { goldCost: 250,  sellPrice: 125 },
  "Circlet of Nobility":              { goldCost: 125,  sellPrice: 62,  dropsFrom: ["Level 2–3 camps on most ladder maps", "Common on Echo Isles and Twisted Meadows"] },
  "Periapt of Vitality":              { goldCost: 300,  sellPrice: 150, dropsFrom: ["Level 5 orange camps on most maps", "Turtle Rock, Last Refuge main camps"] },
  "Potion of Invisibility":           { goldCost: 100,  sellPrice: 50 },
  "Potion of Lesser Invulnerability": { goldCost: 75,   sellPrice: 37 },
  "Scroll of Healing":                { goldCost: 200,  sellPrice: 100 },
  "Scroll of Protection":             { goldCost: 200,  sellPrice: 100 },
  "Staff of Teleportation":           { goldCost: 150,  sellPrice: 75 },
  "Tome of Retraining":               { goldCost: 300,  sellPrice: 150 },
  "Claws of Attack +6":               { sellPrice: 37,  dropsFrom: ["Level 1–2 creep camps on all ladder maps"] },
  "Claws of Attack +9":               { sellPrice: 50,  dropsFrom: ["Level 3–4 camps on all ladder maps"] },
  "Gauntlets of Ogre Strength":       { sellPrice: 50,  dropsFrom: ["Level 1–3 camps on all ladder maps"] },
  "Slippers of Agility":              { sellPrice: 50,  dropsFrom: ["Level 1–3 camps on all ladder maps"] },
  "Mantle of Intelligence":           { sellPrice: 50,  dropsFrom: ["Level 1–3 camps on all ladder maps"] },
  "Ring of Protection":               { sellPrice: 50,  dropsFrom: ["Level 2–4 camps on most maps"] },
  "Gloves of Haste":                  { sellPrice: 100, dropsFrom: ["Level 4–5 camps (Gnolls on Echo Isles, Murlocs on Turtle Rock, Bandits on Concealed Hill)"] },
  "Crystal Ball":                     { sellPrice: 75,  dropsFrom: ["Level 3–5 camps on most maps"] },
  "Robe of the Magi":                 { sellPrice: 100, dropsFrom: ["Level 4–6 camps (Golems, Satyrs, Spider camps)"] },
  "Runed Bracers":                    { sellPrice: 100, dropsFrom: ["Level 4–6 camps on most maps"] },
  "Sobi Mask":                        { sellPrice: 100, dropsFrom: ["Level 3–5 camps, common on Twisted Meadows and Echo Isles"] },
  "Belt of Giant Strength":           { sellPrice: 150, dropsFrom: ["Level 5–7 orange camps", "Centaur camps on Lost Temple, Turtle Rock"] },
  "Boots of Quel'Thalas":             { sellPrice: 175, dropsFrom: ["Level 6–8 orange camps", "Naga and Dragon camps on Concealed Hill, Last Refuge"] },
  "Lion Horn of Stormwind":           { sellPrice: 225, dropsFrom: ["Level 7–9 red camps", "Throne of Turtle Rock, Lost Temple main camp"] },
  "Ancient Janggo of Endurance":      { sellPrice: 225, dropsFrom: ["Level 6–9 camps (Murlocs, Gnolls, Bandits at high tier)"] },
  "Helm of Valor":                    { sellPrice: 225, dropsFrom: ["Level 6–8 orange camps on most maps"] },
  "Khadgar's Pipe of Insight":        { sellPrice: 225, dropsFrom: ["Level 6–8 camps (Undead, Golems, Spiders)"] },
  "Medallion of Courage":             { sellPrice: 225, dropsFrom: ["Level 7–9 red camps", "Final camps on Echo Isles, Twisted Meadows"] },
  "Wand of Illusion":                 { sellPrice: 75,  dropsFrom: ["Level 3–5 camps on most maps"] },
  "Scroll of the Beast":              { sellPrice: 100, dropsFrom: ["Level 4–6 camps on most maps"] },
  "Wand of Mana Stealing":            { sellPrice: 75,  dropsFrom: ["Level 3–5 camps on most maps"] },
  "Potion of Greater Healing":        { sellPrice: 100, dropsFrom: ["Level 4–6 camps on most maps"] },
  "Potion of Greater Mana":           { sellPrice: 100, dropsFrom: ["Level 4–6 camps on most maps"] },
  "Greater Invulnerability Potion":   { sellPrice: 100, dropsFrom: ["Level 4–6 camps on most maps"] },
  "Tome of Strength":     { notSellable: true, dropsFrom: ["Level 5–8 camps", "High-level creeps on Turtle Rock, Last Refuge, Concealed Hill"] },
  "Tome of Agility":      { notSellable: true, dropsFrom: ["Level 5–8 camps"] },
  "Tome of Intelligence": { notSellable: true, dropsFrom: ["Level 5–8 camps"] },
  "Tome of Experience":   { notSellable: true, dropsFrom: ["Level 4–7 camps on most maps"] },
};

const TOME_STAT: Record<string, { amount: string; stat: string; color: string }> = {
  "Tome of Strength":     { amount: "+1", stat: "Strength",     color: "#f97316" },
  "Tome of Agility":      { amount: "+1", stat: "Agility",      color: "#22c55e" },
  "Tome of Intelligence": { amount: "+1", stat: "Intelligence", color: "#60a5fa" },
  "Tome of Experience":   { amount: "+XP", stat: "Experience",  color: "#a78bfa" },
};

const SHOP_DISPLAY: Record<string, string> = {
  human:             "Arcane Vault",
  orc:               "Voodoo Lounge",
  undead:            "Tomb of Relics",
  "night-elf":       "Ancient of Wonders",
  "goblin-merchant": "Goblin Merchant",
};

const SHOP_ICON: Record<string, string> = {
  human:             "/images/Buildings/ArcaneVault.png",
  orc:               "/images/Buildings/VoodooLounge.png",
  undead:            "/images/Buildings/TombOfRelics.png",
  "night-elf":       "/images/Buildings/AncientOfWonders.png",
  "goblin-merchant": "/images/Buildings/GoblinLaboratory.png",
};

const CATEGORY_LABEL: Record<string, string> = {
  permanent:  "Permanent",
  consumable: "Consumable",
  tome:       "Tome",
};

type Props = { params: Promise<{ slug: string }> };

export default async function ItemDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = items.find((i) => slugify(i.name) === slug);

  if (!item) notFound();

  const detail = ITEM_DETAIL[item.name];
  const shopSources = item.shops.filter((s) => s !== "creep-drop");
  const isCreepDrop = item.shops.includes("creep-drop");
  const isTome = item.category === "tome";
  const tomeStat = isTome ? TOME_STAT[item.name] : null;

  return (
    <div className="page-shell page-stack">

      <div className="flex justify-start pt-1">
        <Link href="/items" className="button button--ghost button--sm">← Back to Items</Link>
      </div>

      {/* Hero */}
      <div className="flex items-stretch gap-6 flex-wrap">
        <GameImage
          src={`/images/Items/${item.imageFile}.png`}
          alt={item.name}
          width={80}
          height={80}
          className="object-contain shrink-0"
        />
        <div className="flex flex-col gap-2 flex-1 min-w-0 justify-center">
          <p className="section-label m-0">{CATEGORY_LABEL[item.category] ?? item.category}</p>
          <h1 className="page-title m-0">{item.name}</h1>
          <p className="page-intro m-0">{item.description}</p>
        </div>

        {/* Tome stat card */}
        {isTome && tomeStat ? (
          <article className="detail-panel unit-stats-card shrink-0" style={{ minWidth: 180 }}>
            <p className="section-label">Pickup Effect</p>
            <div className="flex items-baseline gap-2" style={{ margin: "0.25rem 0 0.875rem" }}>
              <span style={{ fontSize: "2.75rem", fontWeight: 900, color: tomeStat.color, lineHeight: 1 }}>
                {tomeStat.amount}
              </span>
              <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text)" }}>
                {tomeStat.stat}
              </span>
            </div>
            <div style={{ borderTop: "1px solid var(--color-line)", paddingTop: "0.75rem" }} className="unit-stats-card__costs">
              <div className="unit-stat-row">
                <span className="unit-stat-row__label">On Pickup</span>
                <span className="unit-stat-row__value" style={{ color: "#c9a35b" }}>Auto-consumed</span>
              </div>
              <div className="unit-stat-row">
                <span className="unit-stat-row__label">Tradeable</span>
                <span className="unit-stat-row__value" style={{ color: "#f87171" }}>No</span>
              </div>
            </div>
          </article>
        ) : (
          /* Economy card for non-tomes */
          <article className="detail-panel unit-stats-card shrink-0" style={{ minWidth: 180 }}>
            <p className="section-label">Economy</p>
            <div className="unit-stats-card__costs">
              <div className="unit-stat-row">
                <span className="unit-stat-row__label flex items-center gap-2">
                  <span aria-hidden="true">🪙</span> Buy
                </span>
                <span className="unit-stat-row__value">
                  {detail?.goldCost !== undefined
                    ? `${detail.goldCost}g`
                    : <span style={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>Creep drop only</span>}
                </span>
              </div>
              <div className="unit-stat-row">
                <span className="unit-stat-row__label flex items-center gap-2">
                  <span aria-hidden="true">🪙</span> Sell
                </span>
                <span className="unit-stat-row__value">
                  {detail?.sellPrice !== undefined ? `${detail.sellPrice}g` : "—"}
                </span>
              </div>
            </div>
          </article>
        )}
      </div>

      {/* Detail panels */}
      <div className="detail-grid">
        {(shopSources.length > 0 || isCreepDrop) ? (
          <article className="detail-panel" style={isTome ? { gridColumn: "1 / -1" } : undefined}>
            <h2 className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-80" style={{ color: "#60a5fa" }}>
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Where to Obtain
            </h2>

            {shopSources.length > 0 ? (
              <>
                <p className="section-label" style={{ fontSize: "0.7rem", marginBottom: "0.5rem" }}>Shops</p>
                <ul className="list-none pl-0 flex flex-col gap-2 mb-4">
                  {shopSources.map((s) => (
                    <li key={s} className="flex items-center gap-3">
                      {SHOP_ICON[s] ? (
                        <GameImage src={SHOP_ICON[s]} alt={SHOP_DISPLAY[s] ?? s} width={24} height={24} className="rounded-[4px] shrink-0 object-contain" />
                      ) : null}
                      <span className="text-muted" style={{ fontSize: "0.9rem" }}>{SHOP_DISPLAY[s] ?? s}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {isCreepDrop && detail?.dropsFrom ? (
              <>
                <p className="section-label" style={{ fontSize: "0.7rem", marginBottom: "0.5rem" }}>Creep Drops</p>
                <ul className="list-none pl-0 flex flex-col gap-2">
                  {detail.dropsFrom.map((d) => (
                    <li key={d} className="flex items-center gap-3">
                      <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-[4px] border border-line" style={{ fontSize: "0.75rem" }}>💀</span>
                      <span className="text-muted" style={{ fontSize: "0.9rem" }}>{d}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </article>
        ) : null}
      </div>

    </div>
  );
}
