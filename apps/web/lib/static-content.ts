export type Building = {
  name: string;
  race: string;
  description: string;
  imageFile: string;
};

export const buildings: Building[] = [
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

export type Item = {
  name: string;
  category: "permanent" | "consumable" | "tome";
  shops: string[];
  description: string;
  imageFile: string;
};

const ALL_RACE_SHOPS = ["human", "orc", "undead", "night-elf"];

export const items: Item[] = [
  { name: "Potion of Healing", category: "consumable", shops: ALL_RACE_SHOPS, description: "Restores hit points to the hero.", imageFile: "PotionOfHealing" },
  { name: "Potion of Mana", category: "consumable", shops: ALL_RACE_SHOPS, description: "Restores mana to the hero.", imageFile: "PotionOfMana" },
  { name: "Scroll of Town Portal", category: "consumable", shops: ALL_RACE_SHOPS, description: "Teleports the hero to a friendly town hall.", imageFile: "ScrollOfTownPortal" },
  { name: "Staff of Sanctuary", category: "consumable", shops: ["human"], description: "Makes a target friendly unit temporarily invulnerable.", imageFile: "StaffOfPreservation" },
  { name: "Orb of Fire", category: "permanent", shops: ["human"], description: "Adds a fiery attack that burns targets over time.", imageFile: "OrbOfFire" },
  { name: "Healing Salve", category: "consumable", shops: ["orc"], description: "Regenerates hit points of a target unit over time.", imageFile: "PotionOfHealing" },
  { name: "Orb of Lightning", category: "permanent", shops: ["orc"], description: "Adds chain lightning to the hero's attacks.", imageFile: "OrbOfLightning" },
  { name: "Orb of Corruption", category: "permanent", shops: ["undead"], description: "Adds a corrosive attack that reduces the target's armor.", imageFile: "OrbOfCorruption" },
  { name: "Staff of Preservation", category: "consumable", shops: ["night-elf"], description: "Teleports a target friendly unit to a safe location.", imageFile: "StaffOfPreservation" },
  { name: "Orb of Venom", category: "permanent", shops: ["night-elf"], description: "Adds a venomous poison effect to the hero's attacks.", imageFile: "OrbOfVenom" },
  { name: "Boots of Speed", category: "permanent", shops: ["goblin-merchant"], description: "Increases the hero's movement speed.", imageFile: "BootsOfSpeed" },
  { name: "Circlet of Nobility", category: "permanent", shops: ["goblin-merchant", "creep-drop"], description: "Increases all attributes of the hero.", imageFile: "CircletOfNobility" },
  { name: "Periapt of Vitality", category: "permanent", shops: ["goblin-merchant", "creep-drop"], description: "Increases the hero's maximum hit points.", imageFile: "PeriaptOfVitality" },
  { name: "Potion of Invisibility", category: "consumable", shops: ["goblin-merchant"], description: "Renders the hero invisible for a short duration.", imageFile: "GreaterInvulnerabilityPotion" },
  { name: "Potion of Lesser Invulnerability", category: "consumable", shops: ["goblin-merchant"], description: "Briefly makes the hero invulnerable.", imageFile: "GreaterInvulnerabilityPotion" },
  { name: "Scroll of Healing", category: "consumable", shops: ["goblin-merchant"], description: "Heals nearby friendly units.", imageFile: "ScrollOfHealing" },
  { name: "Scroll of Protection", category: "consumable", shops: ["goblin-merchant"], description: "Grants bonus armor to nearby friendly units.", imageFile: "ScrollOfProtection" },
  { name: "Staff of Teleportation", category: "consumable", shops: ["goblin-merchant"], description: "Teleports the hero to a targeted location on the map.", imageFile: "StaffOfTeleportation" },
  { name: "Claws of Attack +6", category: "permanent", shops: ["creep-drop"], description: "Increases the hero's attack damage. Drops from level 1 camps.", imageFile: "ClawsOfAttack" },
  { name: "Claws of Attack +9", category: "permanent", shops: ["creep-drop"], description: "Increases the hero's attack damage. Drops from level 2 camps.", imageFile: "ClawsOfAttack" },
  { name: "Gauntlets of Ogre Strength", category: "permanent", shops: ["creep-drop"], description: "Increases the hero's Strength. Drops from level 1 camps.", imageFile: "GauntletsOfOgreStrength" },
  { name: "Slippers of Agility", category: "permanent", shops: ["creep-drop"], description: "Increases the hero's Agility. Drops from level 1 camps.", imageFile: "SlippersOfAgility" },
  { name: "Mantle of Intelligence", category: "permanent", shops: ["creep-drop"], description: "Increases the hero's Intelligence. Drops from level 1 camps.", imageFile: "MantleOfIntelligence" },
  { name: "Ring of Protection", category: "permanent", shops: ["creep-drop"], description: "Increases the hero's armor. Drops from various creep camps.", imageFile: "RingOfProtection" },
  { name: "Gloves of Haste", category: "permanent", shops: ["creep-drop"], description: "Increases the hero's attack speed. Drops from level 2 camps.", imageFile: "GlovesOfHaste" },
  { name: "Crystal Ball", category: "permanent", shops: ["creep-drop"], description: "Grants True Sight near the hero. Drops from level 3 camps.", imageFile: "CrystalBall" },
  { name: "Robe of the Magi", category: "permanent", shops: ["creep-drop"], description: "Increases the hero's Intelligence. Drops from level 4 camps.", imageFile: "RobeOfTheMagi" },
  { name: "Runed Bracers", category: "permanent", shops: ["creep-drop"], description: "Reduces magic damage taken. Drops from level 4 camps.", imageFile: "RunedBracers" },
  { name: "Sobi Mask", category: "permanent", shops: ["creep-drop"], description: "Increases mana regeneration. Drops from level 4 camps.", imageFile: "SobiMask" },
  { name: "Belt of Giant Strength", category: "permanent", shops: ["creep-drop"], description: "Increases the hero's Strength. Drops from level 4 camps.", imageFile: "BeltOfGiantStrength" },
  { name: "Boots of Quel'Thalas", category: "permanent", shops: ["creep-drop"], description: "Greatly increases movement speed. Drops from level 4 camps.", imageFile: "BootsOfQuelThalas" },
  { name: "Lion Horn of Stormwind", category: "permanent", shops: ["creep-drop"], description: "Armor aura for nearby friendly units. Drops from level 4 camps.", imageFile: "LionHornOfStormwind" },
  { name: "Ancient Janggo of Endurance", category: "permanent", shops: ["creep-drop"], description: "Speed and attack aura. Drops from level 5 camps.", imageFile: "AncientJanggoOfEndurance" },
  { name: "Helm of Valor", category: "permanent", shops: ["creep-drop"], description: "Strength and life regen. Drops from level 5 camps.", imageFile: "HelmOfValor" },
  { name: "Khadgar's Pipe of Insight", category: "permanent", shops: ["creep-drop"], description: "Mana regen aura for nearby friendly units. Drops from level 5 camps.", imageFile: "KhadgarsPipeOfInsight" },
  { name: "Medallion of Courage", category: "permanent", shops: ["creep-drop"], description: "Reduces armor of a target enemy. Drops from level 5 camps.", imageFile: "MedallionOfCourage" },
  { name: "Wand of Illusion", category: "consumable", shops: ["creep-drop"], description: "Creates illusions of a target unit. Drops from level 2 camps.", imageFile: "WandOfIllusion" },
  { name: "Scroll of the Beast", category: "consumable", shops: ["creep-drop"], description: "Increases attack damage of nearby friendly units. Drops from level 3 camps.", imageFile: "ScrollOfTheBeast" },
  { name: "Wand of Mana Stealing", category: "consumable", shops: ["creep-drop"], description: "Drains mana from a target unit. Drops from level 3 camps.", imageFile: "WandOfManaStealing" },
  { name: "Potion of Greater Healing", category: "consumable", shops: ["creep-drop"], description: "Restores a large amount of hit points. Drops from level 3 camps.", imageFile: "PotionOfGreaterHealing" },
  { name: "Potion of Greater Mana", category: "consumable", shops: ["creep-drop"], description: "Restores a large amount of mana. Drops from level 3 camps.", imageFile: "PotionOfGreaterMana" },
  { name: "Greater Invulnerability Potion", category: "consumable", shops: ["creep-drop"], description: "Makes the hero temporarily invulnerable. Drops from artifact-level camps.", imageFile: "GreaterInvulnerabilityPotion" },
  { name: "Tome of Strength", category: "tome", shops: [], description: "Permanently increases the hero's Strength by 1.", imageFile: "TomeOfStrength" },
  { name: "Tome of Agility", category: "tome", shops: [], description: "Permanently increases the hero's Agility by 1.", imageFile: "TomeOfAgility" },
  { name: "Tome of Intelligence", category: "tome", shops: [], description: "Permanently increases the hero's Intelligence by 1.", imageFile: "TomeOfIntelligence" },
  { name: "Tome of Experience", category: "tome", shops: [], description: "Grants the hero bonus experience points.", imageFile: "TomeOfExperience" },
  { name: "Tome of Retraining", category: "tome", shops: ["goblin-merchant"], description: "Allows the hero to reassign all spent skill points.", imageFile: "TomeOfRetraining" },
];
