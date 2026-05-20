import Link from "next/link";
import { GameImage } from "../../components/game-image";

type Building = {
  name: string;
  race: string;
  description: string;
  imageFile: string;
};

const buildings: Building[] = [
  // Human
  { name: "Town Hall", race: "human", description: "Primary base structure that trains Peasants and manages gold.", imageFile: "TownHall" },
  { name: "Keep", race: "human", description: "Tier 2 upgrade that unlocks advanced buildings and units.", imageFile: "Keep" },
  { name: "Castle", race: "human", description: "Tier 3 upgrade granting access to the full Human army roster.", imageFile: "Castle" },
  { name: "Farm", race: "human", description: "Provides food supply for Human armies.", imageFile: "Farm" },
  { name: "Barracks", race: "human", description: "Trains Footmen, Riflemen, Mortar Teams, and Knights.", imageFile: "HumanBarracks" },
  { name: "Blacksmith", race: "human", description: "Researches weapon and armor upgrades for Human ground units.", imageFile: "Blacksmith" },
  { name: "Lumber Mill", race: "human", description: "Researches lumber harvesting and unlocks tier two structures.", imageFile: "LumberMill" },
  { name: "Scout Tower", race: "human", description: "Base defense tower that can upgrade into Guard, Cannon, or Arcane.", imageFile: "ScoutTower" },
  { name: "Guard Tower", race: "human", description: "Ground-focused defense tower upgraded from Scout Tower.", imageFile: "GuardTower" },
  { name: "Arcane Tower", race: "human", description: "Anti-magic defense tower that mana burns spellcasters.", imageFile: "ArcaneTower" },
  { name: "Cannon Tower", race: "human", description: "Siege-capable tower that fires splash damage at ground units.", imageFile: "CannonTower" },
  { name: "Workshop", race: "human", description: "Trains Flying Machines, Mortar Teams, and Siege Engines.", imageFile: "Workshop" },
  { name: "Gryphon Aviary", race: "human", description: "Trains Gryphon Riders and Dragonhawk Riders.", imageFile: "GryphonAviary" },
  { name: "Arcane Sanctum", race: "human", description: "Trains Priests, Sorceresses, and Spell Breakers.", imageFile: "ArcaneSanctum" },
  { name: "Arcane Vault", race: "human", description: "Sells permanent and consumable items for Human heroes.", imageFile: "ArcaneVault" },
  { name: "Altar of Kings", race: "human", description: "Summons and revives Human heroes.", imageFile: "AltarOfKings" },
  // Orc
  { name: "Great Hall", race: "orc", description: "Primary base that trains Peons and manages gold.", imageFile: "OrcGreatHall" },
  { name: "Stronghold", race: "orc", description: "Tier 2 upgrade unlocking advanced Orc structures.", imageFile: "Stronghold" },
  { name: "Fortress", race: "orc", description: "Tier 3 upgrade granting the full Orc army tech tree.", imageFile: "Fortress" },
  { name: "Orc Burrow", race: "orc", description: "Provides food supply and acts as a defensive structure when burrowed.", imageFile: "OrcBurrow" },
  { name: "War Mill", race: "orc", description: "Researches weapon and armor upgrades for Orc units.", imageFile: "WarMill" },
  { name: "Barracks", race: "orc", description: "Trains Grunts, Headhunters, Raiders, and Troll Batriders.", imageFile: "Beastiary" },
  { name: "Spirit Lodge", race: "orc", description: "Trains Shamans, Witch Doctors, and Spirit Walkers.", imageFile: "SpiritLodge" },
  { name: "Watch Tower", race: "orc", description: "Defensive tower that protects Orc bases.", imageFile: "WatchTower" },
  { name: "Goblin Laboratory", race: "orc", description: "Trains Goblin Sappers and Goblin Zeppelins.", imageFile: "GoblinLaboratory" },
  { name: "Tauren Totem", race: "orc", description: "Trains Tauren warriors and researches upgrades.", imageFile: "TaurenTotem" },
  { name: "Voodoo Lounge", race: "orc", description: "Sells items and consumables for Orc heroes.", imageFile: "VoodooLounge" },
  { name: "Altar of Storms", race: "orc", description: "Summons and revives Orc heroes.", imageFile: "AltarOfStorms" },
  // Undead
  { name: "Necropolis", race: "undead", description: "Primary base that trains Acolytes and haunts gold mines.", imageFile: "Necropolis" },
  { name: "Halls of the Dead", race: "undead", description: "Tier 2 upgrade unlocking advanced Undead structures.", imageFile: "HallsOfTheDead" },
  { name: "Black Citadel", race: "undead", description: "Tier 3 upgrade giving access to the full Undead tech tree.", imageFile: "BlackCitadel" },
  { name: "Ziggurat", race: "undead", description: "Provides food and can upgrade into a Spirit or Frost Tower.", imageFile: "Ziggurat" },
  { name: "Spirit Tower", race: "undead", description: "Ranged defense tower upgraded from Ziggurat.", imageFile: "SpiritTower" },
  { name: "Frost Tower", race: "undead", description: "Slow-debuff tower that snares attackers.", imageFile: "FrostTower" },
  { name: "Crypt", race: "undead", description: "Trains Ghouls, Crypt Fiends, Gargoyles, and Abominations.", imageFile: "Crypt" },
  { name: "Graveyard", race: "undead", description: "Researches weapon and armor upgrades for Undead units.", imageFile: "Graveyard" },
  { name: "Temple of the Damned", race: "undead", description: "Trains Death Knights and Liches.", imageFile: "TempleOfTheDamned" },
  { name: "Slaughterhouse", race: "undead", description: "Trains Abominations and researches upgrades.", imageFile: "Slaughterhouse" },
  { name: "Boneyard", race: "undead", description: "Trains Frost Wyrms.", imageFile: "Boneyard" },
  { name: "Altar of Darkness", race: "undead", description: "Summons and revives Undead heroes.", imageFile: "AltarOfDarkness" },
  { name: "Tomb of Relics", race: "undead", description: "Sells permanent and consumable items for Undead heroes.", imageFile: "TombOfRelics" },
  { name: "Sacrificial Pit", race: "undead", description: "Trains Banshees and converts them into Destroyers.", imageFile: "SacrificialPit" },
  // Night Elf
  { name: "Tree of Life", race: "night-elf", description: "Primary base that trains Wisps and harvests with ancient trees.", imageFile: "TreeOfLife" },
  { name: "Tree of Ages", race: "night-elf", description: "Tier 2 upgrade unlocking advanced Night Elf structures.", imageFile: "TreeOfAges" },
  { name: "Tree of Eternity", race: "night-elf", description: "Tier 3 upgrade giving the full Night Elf tech tree.", imageFile: "TreeOfEternity" },
  { name: "Moon Well", race: "night-elf", description: "Provides food supply and regenerates mana and health during the day.", imageFile: "MoonWell" },
  { name: "Ancient of War", race: "night-elf", description: "Trains Archers, Huntresses, and Glaive Throwers.", imageFile: "AncientOfWar" },
  { name: "Ancient of Wind", race: "night-elf", description: "Trains Hippogryphs, Faerie Dragons, and Chimaeras.", imageFile: "AncientOfWind" },
  { name: "Ancient of Lore", race: "night-elf", description: "Trains Druids of the Claw and Druids of the Talon.", imageFile: "AncientOfLore" },
  { name: "Ancient of Wonders", race: "night-elf", description: "Sells items and consumables for Night Elf heroes.", imageFile: "AncientOfWonders" },
  { name: "Ancient Protector", race: "night-elf", description: "Defensive tower that can uproot and move.", imageFile: "AncientProtector" },
  { name: "Hunter's Hall", race: "night-elf", description: "Researches weapon, armor, and special Night Elf upgrades.", imageFile: "HuntersHall" },
  { name: "Chimaera Roost", race: "night-elf", description: "Trains Chimaeras and researches Chimaera upgrades.", imageFile: "ChimaeraRoost" },
  { name: "Altar of Elders", race: "night-elf", description: "Summons and revives Night Elf heroes.", imageFile: "AltarOfElders" },
  // Neutral
  { name: "Tavern", race: "neutral", description: "Allows any race to hire neutral Tavern heroes.", imageFile: "Tavern" },
  { name: "Mercenary Camp", race: "neutral", description: "Hires neutral mercenary units available on many maps.", imageFile: "MercenaryCamp" },
  { name: "Marketplace", race: "neutral", description: "Sells a rotating selection of powerful items.", imageFile: "Marketplace" },
  { name: "Fountain of Health", race: "neutral", description: "Regenerates hit points for nearby friendly units.", imageFile: "FountainOfHealth" },
  { name: "Fountain of Mana", race: "neutral", description: "Regenerates mana for nearby friendly units.", imageFile: "FountainOfMana" },
];

const raceFilters = [
  { slug: "human", label: "Human" },
  { slug: "orc", label: "Orc" },
  { slug: "undead", label: "Undead" },
  { slug: "night-elf", label: "Night Elf" },
  { slug: "neutral", label: "Neutral" },
];

type Props = {
  searchParams?: Promise<{ race?: string }>;
};

export default async function BuildingsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const activeRace = params.race ?? "human";
  const visible = buildings.filter((b) => b.race === activeRace);

  return (
    <div className="page-shell page-stack">
      <div className="section-head">
        <p className="section-label">Building Reference</p>
        <h1 className="page-title">Every structure, its role, and its unlock.</h1>
        <p className="page-intro">
          Browse the complete building roster for each race — from base tiers and production
          structures to defense towers and item shops.
        </p>
      </div>

      <nav className="filter-bar" aria-label="Race filter">
        {raceFilters.map((f) => (
          <Link
            key={f.slug}
            href={`/buildings?race=${f.slug}`}
            className={`filter-btn${activeRace === f.slug ? " filter-btn--active" : ""}`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      <div className="icon-grid">
        {visible.map((building) => (
          <div key={building.imageFile} className="icon-card">
            <GameImage
              src={`/images/Buildings/${building.imageFile}.png`}
              alt={building.name}
              width={64}
              height={64}
              className="game-image--icon"
            />
            <div className="icon-card__body">
              <p className="icon-card__name">{building.name}</p>
              <p className="icon-card__desc">{building.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
