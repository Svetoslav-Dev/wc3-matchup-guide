import Link from "next/link";
import { GameImage } from "../../components/game-image";

type Item = {
  name: string;
  type: "Permanent" | "Consumable" | "Power-up" | "Artifact" | "Charged";
  description: string;
  imageFile: string;
};

const items: Item[] = [
  // Permanent
  { name: "Ancient Janggo of Endurance", type: "Permanent", description: "Grants an aura that increases movement and attack speed of nearby friendly units.", imageFile: "AncientJanggoOfEndurance" },
  { name: "Belt of Giant Strength", type: "Permanent", description: "Increases the hero's Strength attribute.", imageFile: "BeltOfGiantStrength" },
  { name: "Boots of Quel'Thalas", type: "Permanent", description: "Greatly increases the hero's movement speed.", imageFile: "BootsOfQuelThalas" },
  { name: "Boots of Speed", type: "Permanent", description: "Increases the hero's movement speed.", imageFile: "BootsOfSpeed" },
  { name: "Circlet of Nobility", type: "Permanent", description: "Increases all attributes of the hero.", imageFile: "CircletOfNobility" },
  { name: "Claws of Attack", type: "Permanent", description: "Increases the hero's attack damage.", imageFile: "ClawsOfAttack" },
  { name: "Crystal Ball", type: "Permanent", description: "Grants True Sight, revealing invisible units near the hero.", imageFile: "CrystalBall" },
  { name: "Gauntlets of Ogre Strength", type: "Permanent", description: "Increases the hero's Strength attribute.", imageFile: "GauntletsOfOgreStrength" },
  { name: "Gloves of Haste", type: "Permanent", description: "Increases the hero's attack speed.", imageFile: "GlovesOfHaste" },
  { name: "Helm of Valor", type: "Permanent", description: "Increases the hero's Strength and provides life regeneration.", imageFile: "HelmOfValor" },
  { name: "Khadgar's Pipe of Insight", type: "Permanent", description: "Grants an aura that increases mana regeneration of nearby friendly units.", imageFile: "KhadgarsPipeOfInsight" },
  { name: "Lion Horn of Stormwind", type: "Permanent", description: "Grants an aura that increases armor of nearby friendly units.", imageFile: "LionHornOfStormwind" },
  { name: "Mantle of Intelligence", type: "Permanent", description: "Increases the hero's Intelligence attribute.", imageFile: "MantleOfIntelligence" },
  { name: "Medallion of Courage", type: "Permanent", description: "Reduces the armor of a target enemy unit.", imageFile: "MedallionOfCourage" },
  { name: "Orb of Corruption", type: "Permanent", description: "Adds a corrosive attack that reduces the target's armor.", imageFile: "OrbOfCorruption" },
  { name: "Orb of Fire", type: "Permanent", description: "Adds a fiery attack that deals bonus damage over time.", imageFile: "OrbOfFire" },
  { name: "Orb of Lightning", type: "Permanent", description: "Adds chain lightning to the hero's attacks.", imageFile: "OrbOfLightning" },
  { name: "Orb of Venom", type: "Permanent", description: "Adds a venomous poison effect to the hero's attacks.", imageFile: "OrbOfVenom" },
  { name: "Periapt of Vitality", type: "Permanent", description: "Increases the hero's maximum hit points.", imageFile: "PeriaptOfVitality" },
  { name: "Ring of Protection", type: "Permanent", description: "Increases the hero's armor.", imageFile: "RingOfProtection" },
  { name: "Robe of the Magi", type: "Permanent", description: "Increases the hero's Intelligence attribute.", imageFile: "RobeOfTheMagi" },
  { name: "Runed Bracers", type: "Permanent", description: "Reduces magic damage taken by the hero.", imageFile: "RunedBracers" },
  { name: "Slippers of Agility", type: "Permanent", description: "Increases the hero's Agility attribute.", imageFile: "SlippersOfAgility" },
  { name: "Sobi Mask", type: "Permanent", description: "Increases the hero's mana regeneration rate.", imageFile: "SobiMask" },
  // Consumable / Charged
  { name: "Greater Invulnerability Potion", type: "Consumable", description: "Makes the hero temporarily invulnerable.", imageFile: "GreaterInvulnerabilityPotion" },
  { name: "Potion of Greater Healing", type: "Consumable", description: "Restores a large amount of hit points to the hero.", imageFile: "PotionOfGreaterHealing" },
  { name: "Potion of Greater Mana", type: "Consumable", description: "Restores a large amount of mana to the hero.", imageFile: "PotionOfGreaterMana" },
  { name: "Potion of Healing", type: "Consumable", description: "Restores hit points to the hero.", imageFile: "PotionOfHealing" },
  { name: "Potion of Mana", type: "Consumable", description: "Restores mana to the hero.", imageFile: "PotionOfMana" },
  { name: "Scroll of Healing", type: "Consumable", description: "Heals nearby friendly units.", imageFile: "ScrollOfHealing" },
  { name: "Scroll of Protection", type: "Consumable", description: "Grants bonus armor to nearby friendly units.", imageFile: "ScrollOfProtection" },
  { name: "Scroll of the Beast", type: "Consumable", description: "Increases attack damage of nearby friendly units.", imageFile: "ScrollOfTheBeast" },
  { name: "Scroll of Town Portal", type: "Consumable", description: "Teleports the hero to a friendly town hall.", imageFile: "ScrollOfTownPortal" },
  { name: "Staff of Preservation", type: "Consumable", description: "Teleports a target friendly unit to a safe location.", imageFile: "StaffOfPreservation" },
  { name: "Staff of Teleportation", type: "Consumable", description: "Teleports the hero to a targeted location on the map.", imageFile: "StaffOfTeleportation" },
  { name: "Wand of Illusion", type: "Charged", description: "Creates illusions of a target unit.", imageFile: "WandOfIllusion" },
  { name: "Wand of Mana Stealing", type: "Charged", description: "Drains mana from a target unit.", imageFile: "WandOfManaStealing" },
  // Power-ups
  { name: "Tome of Agility", type: "Power-up", description: "Permanently increases the hero's Agility by 1.", imageFile: "TomeOfAgility" },
  { name: "Tome of Experience", type: "Power-up", description: "Grants the hero bonus experience points.", imageFile: "TomeOfExperience" },
  { name: "Tome of Intelligence", type: "Power-up", description: "Permanently increases the hero's Intelligence by 1.", imageFile: "TomeOfIntelligence" },
  { name: "Tome of Retraining", type: "Power-up", description: "Allows the hero to reassign all spent skill points.", imageFile: "TomeOfRetraining" },
  { name: "Tome of Strength", type: "Power-up", description: "Permanently increases the hero's Strength by 1.", imageFile: "TomeOfStrength" },
];

const typeFilters: Array<{ slug: string; label: string }> = [
  { slug: "all", label: "All Items" },
  { slug: "Permanent", label: "Permanent" },
  { slug: "Consumable", label: "Consumable" },
  { slug: "Charged", label: "Charged" },
  { slug: "Power-up", label: "Power-ups" },
];

type Props = {
  searchParams?: Promise<{ type?: string }>;
};

export default async function ItemsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const activeType = params.type ?? "all";
  const visible = activeType === "all" ? items : items.filter((i) => i.type === activeType);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Item Reference</p>
        <h1 className="page-title">Items that turn the tide of fights.</h1>
        <p className="page-intro">
          Permanent items scale your hero every game. Consumables win the fight you're in.
          Power-ups give lasting stat gains from creep camp drops.
        </p>
      </div>

      <nav className="filter-bar" aria-label="Item type filter">
        {typeFilters.map((f) => (
          <Link
            key={f.slug}
            href={f.slug === "all" ? "/items" : `/items?type=${f.slug}`}
            className={`filter-btn${activeType === f.slug ? " filter-btn--active" : ""}`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      <div className="icon-grid">
        {visible.map((item) => (
          <div key={item.imageFile} className="icon-card">
            <GameImage
              src={`/images/Items/${item.imageFile}.png`}
              alt={item.name}
              width={64}
              height={64}
              className="game-image--icon"
            />
            <div className="icon-card__body">
              <p className="icon-card__name">{item.name}</p>
              <p className="icon-card__type">{item.type}</p>
              <p className="icon-card__desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
