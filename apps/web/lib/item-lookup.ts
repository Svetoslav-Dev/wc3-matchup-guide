export type ItemSource = "Shop" | "Drop" | "Drop / Shop";

export type ItemInfo = {
  imageFile: string | null;
  source: ItemSource;
};

export const itemLookup: Record<string, ItemInfo> = {
  "Ancient Janggo of Endurance": { imageFile: "AncientJanggoOfEndurance", source: "Drop / Shop" },
  "Belt of Giant Strength": { imageFile: "BeltOfGiantStrength", source: "Drop" },
  "Boots of Quel'Thalas": { imageFile: "BootsOfQuelThalas", source: "Drop" },
  "Boots of Speed": { imageFile: "BootsOfSpeed", source: "Shop" },
  "Circlet of Nobility": { imageFile: "CircletOfNobility", source: "Shop" },
  "Clarity Potion": { imageFile: "PotionOfMana", source: "Shop" },
  "Claws of Attack +3": { imageFile: "ClawsOfAttack", source: "Shop" },
  "Claws of Attack +6": { imageFile: "ClawsOfAttack", source: "Shop" },
  "Claws of Attack +9": { imageFile: "ClawsOfAttack", source: "Drop" },
  "Claws of Attack +12": { imageFile: "ClawsOfAttack", source: "Drop" },
  "Claws of Attack +15": { imageFile: "ClawsOfAttack", source: "Drop" },
  "Crystal Ball": { imageFile: "CrystalBall", source: "Shop" },
  "Gauntlets of Ogre Strength": { imageFile: "GauntletsOfOgreStrength", source: "Shop" },
  "Gloves of Haste": { imageFile: "GlovesOfHaste", source: "Shop" },
  "Greater Invulnerability Potion": { imageFile: "GreaterInvulnerabilityPotion", source: "Drop" },
  "Healing Salve": { imageFile: null, source: "Shop" },
  "Helm of Valor": { imageFile: "HelmOfValor", source: "Drop / Shop" },
  "Khadgar's Gem of Health": { imageFile: null, source: "Drop" },
  "Khadgar's Pipe of Insight": { imageFile: "KhadgarsPipeOfInsight", source: "Drop / Shop" },
  "Lion Horn of Stormwind": { imageFile: "LionHornOfStormwind", source: "Drop / Shop" },
  "Mantle of Intelligence": { imageFile: "MantleOfIntelligence", source: "Shop" },
  "Mask of Death": { imageFile: null, source: "Drop" },
  "Medallion of Courage": { imageFile: "MedallionOfCourage", source: "Shop" },
  "Orb of Corruption": { imageFile: "OrbOfCorruption", source: "Drop" },
  "Orb of Fire": { imageFile: "OrbOfFire", source: "Drop" },
  "Orb of Frost": { imageFile: "OrbOfLightning", source: "Drop" },
  "Orb of Lightning": { imageFile: "OrbOfLightning", source: "Drop" },
  "Orb of Venom": { imageFile: "OrbOfVenom", source: "Drop" },
  "Periapt of Vitality": { imageFile: "PeriaptOfVitality", source: "Shop" },
  "Potion of Greater Healing": { imageFile: "PotionOfGreaterHealing", source: "Shop" },
  "Potion of Greater Mana": { imageFile: "PotionOfGreaterMana", source: "Shop" },
  "Potion of Healing": { imageFile: "PotionOfHealing", source: "Shop" },
  "Potion of Mana": { imageFile: "PotionOfMana", source: "Shop" },
  "Ring of Protection": { imageFile: "RingOfProtection", source: "Shop" },
  "Robe of the Magi": { imageFile: "RobeOfTheMagi", source: "Shop" },
  "Runed Bracers": { imageFile: "RunedBracers", source: "Drop" },
  "Scroll of Healing": { imageFile: "ScrollOfHealing", source: "Shop" },
  "Scroll of Protection": { imageFile: "ScrollOfProtection", source: "Shop" },
  "Scroll of the Beast": { imageFile: "ScrollOfTheBeast", source: "Drop / Shop" },
  "Scroll of Town Portal": { imageFile: "ScrollOfTownPortal", source: "Shop" },
  "Slippers of Agility": { imageFile: "SlippersOfAgility", source: "Shop" },
  "Sobi Mask": { imageFile: "SobiMask", source: "Shop" },
  "Staff of Preservation": { imageFile: "StaffOfPreservation", source: "Shop" },
  "Staff of Sanctuary": { imageFile: "StaffOfPreservation", source: "Shop" },
  "Staff of Teleportation": { imageFile: "StaffOfTeleportation", source: "Shop" },
  "Wand of Illusion": { imageFile: "WandOfIllusion", source: "Drop / Shop" },
  "Wand of Mana Stealing": { imageFile: "WandOfManaStealing", source: "Drop / Shop" },
};

export const getItemInfo = (name: string): ItemInfo =>
  itemLookup[name] ?? { imageFile: null, source: "Drop / Shop" };
