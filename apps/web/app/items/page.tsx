import { GameImage } from "../../components/game-image";
import { items } from "../../lib/static-content";

type BannerInfo = { label: string; sublabel: string; icon: string };

const SHOP_BANNERS: Partial<Record<string, BannerInfo>> = {
  "human":          { label: "Faction Shop", sublabel: "Arcane Vault",       icon: "/images/Buildings/ArcaneVault.png" },
  "orc":            { label: "Faction Shop", sublabel: "Voodoo Lounge",      icon: "/images/Buildings/VoodooLounge.png" },
  "undead":         { label: "Faction Shop", sublabel: "Tomb of Relics",     icon: "/images/Buildings/TombOfRelics.png" },
  "night-elf":      { label: "Faction Shop", sublabel: "Ancient of Wonders", icon: "/images/Buildings/AncientOfWonders.png" },
  "goblin-merchant":{ label: "Neutral Shop", sublabel: "Goblin Merchant",    icon: "/images/Buildings/GoblinLaboratory.png" },
};

type FilterDef = { slug: string; label: string };

const filters: FilterDef[] = [
  { slug: "creep-drop",      label: "Creep Drops" },
  { slug: "tome",            label: "Tomes" },
  { slug: "goblin-merchant", label: "Goblin Merchant" },
  { slug: "human",           label: "Arcane Vault" },
  { slug: "orc",             label: "Voodoo Lounge" },
  { slug: "undead",          label: "Tomb of Relics" },
  { slug: "night-elf",       label: "Ancient of Wonders" },
];

const SHOP_BUILDING_ICONS: Record<string, string> = {
  "human":     "/images/Buildings/ArcaneVault.png",
  "orc":       "/images/Buildings/VoodooLounge.png",
  "undead":    "/images/Buildings/TombOfRelics.png",
  "night-elf": "/images/Buildings/AncientOfWonders.png",
};

function filterIcon(slug: string): string | null {
  if (slug in SHOP_BUILDING_ICONS) return SHOP_BUILDING_ICONS[slug];
  if (slug === "goblin-merchant") return "/images/Buildings/GoblinLaboratory.png";
  if (slug === "tome")            return "/images/Items/TomeOfStrength.png";
  return null;
}

function getVisible(filter: string) {
  if (filter === "tome")       return items.filter((i) => i.category === "tome");
  if (filter === "creep-drop") return items.filter((i) => i.shops.includes("creep-drop"));
  return items.filter((i) => i.shops.includes(filter));
}

type Props = {
  searchParams?: Promise<{ tab?: string }>;
};

export default async function ItemsPage({ searchParams }: Props) {
  const params    = (await searchParams) ?? {};
  const activeTab = params.tab ?? "creep-drop";
  const visible   = getVisible(activeTab);
  const banner    = SHOP_BANNERS[activeTab] ?? null;

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Item Reference</p>
        <h1 className="page-title">Items that turn the tide of fights.</h1>
        <p className="page-intro">
          Browse creep-drop loot, faction shop stock, and neutral market inventories in one place.
        </p>
      </div>

      <nav className="filter-bar" aria-label="Item filter">
        {filters.map((f) => {
          const icon = filterIcon(f.slug);
          return (
            <a
              key={f.slug}
              href={`/items?tab=${f.slug}`}
              className={`filter-btn filter-btn--race${activeTab === f.slug ? " filter-btn--active" : ""}`}
            >
              {f.slug === "creep-drop" ? (
                <span className="gold-coin" aria-hidden="true" />
              ) : icon ? (
                <GameImage src={icon} alt="" width={18} height={18} className="filter-btn__icon" />
              ) : null}
              {f.label}
            </a>
          );
        })}
      </nav>

      {banner ? (
        <div className="shop-banner">
          <GameImage src={banner.icon} alt={banner.sublabel} width={40} height={40} className="game-image--icon" />
          <div>
            <p className="shop-banner__label">{banner.label}</p>
            <p className="shop-banner__name">{banner.sublabel}</p>
          </div>
        </div>
      ) : null}

      <div className="icon-grid">
        {visible.map((item) => (
          <div key={`${item.name}-${activeTab}`} className="icon-card">
            <GameImage
              src={`/images/Items/${item.imageFile}.png`}
              alt={item.name}
              width={64}
              height={64}
              className="game-image--icon"
            />
            <div className="icon-card__body">
              <p className="icon-card__name">{item.name}</p>
              <p className="icon-card__type">
                {item.category === "tome" ? "Tome" : item.category === "permanent" ? "Permanent" : "Consumable"}
              </p>
              <p className="icon-card__desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
