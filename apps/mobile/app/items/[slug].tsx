import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { GhostBadge, SectionLabel, gameImageUri } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { items } from "@warcraft3-guide-hub/shared";
import { colors } from "../../lib/theme";

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
  "Tome of Strength":                 { notSellable: true, consumeNote: "Auto-consumed on hero pickup — permanently adds +1 Strength", dropsFrom: ["Level 5–8 camps", "High-level creeps on Turtle Rock, Last Refuge, Concealed Hill"] },
  "Tome of Agility":                  { notSellable: true, consumeNote: "Auto-consumed on hero pickup — permanently adds +1 Agility", dropsFrom: ["Level 5–8 camps"] },
  "Tome of Intelligence":             { notSellable: true, consumeNote: "Auto-consumed on hero pickup — permanently adds +1 Intelligence", dropsFrom: ["Level 5–8 camps"] },
  "Tome of Experience":               { notSellable: true, consumeNote: "Auto-consumed on hero pickup — grants bonus experience points", dropsFrom: ["Level 4–7 camps on most maps"] },
};

const SHOP_DISPLAY: Record<string, string> = {
  human:            "Arcane Vault",
  orc:              "Voodoo Lounge",
  undead:           "Tomb of Relics",
  "night-elf":      "Ancient of Wonders",
  "goblin-merchant":"Goblin Merchant",
  "creep-drop":     "Creep Drop",
};

const CATEGORY_COLOR: Record<string, string> = {
  permanent:  colors.gold,
  consumable: colors.green,
  tome:       "#a78bfa",
};

const panelStyle = {
  backgroundColor: colors.panel,
  borderColor: colors.line,
  borderWidth: 1,
  borderRadius: 18,
  padding: 16,
  gap: 12,
} as const;

export default function ItemDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const item = items.find((i) => slugify(i.name) === slug);

  if (!item) {
    return (
      <ScreenShell>
        <Text style={{ color: colors.muted }}>Item not found.</Text>
      </ScreenShell>
    );
  }

  const detail = ITEM_DETAIL[item.name];
  const catColor = CATEGORY_COLOR[item.category] ?? colors.muted;
  const shopSources = item.shops.filter((s) => s !== "creep-drop");
  const isCreepDrop = item.shops.includes("creep-drop");

  return (
    <ScreenShell>
      <Pressable
        onPress={() => router.canGoBack() ? router.back() : router.push("/items")}
        style={({ hovered, pressed }) => [styles.backBtn, (hovered || pressed) ? styles.backBtnActive : null]}
      >
        <Text style={styles.backText}>← Items</Text>
      </Pressable>

      <SectionLabel>Item Guide</SectionLabel>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Image
            source={{ uri: gameImageUri(`/images/Items/${item.imageFile}.png`) }}
            style={styles.icon}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.categoryLabel, { color: catColor }]}>{item.category}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={panelStyle}>
        <GhostBadge>Description</GhostBadge>
        <Text style={styles.bodyText}>{item.description}</Text>
      </View>

      {/* Cost & sell price */}
      {detail ? (
        <View style={panelStyle}>
          <GhostBadge>Economy</GhostBadge>
          {detail.consumeNote ? (
            <View style={styles.consumeNote}>
              <Text style={styles.consumeNoteText}>{detail.consumeNote}</Text>
            </View>
          ) : null}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Buy Price</Text>
              {detail.goldCost !== undefined ? (
                <Text style={styles.statValue}>🪙 {detail.goldCost}g</Text>
              ) : (
                <Text style={[styles.statValue, { color: colors.red, fontSize: 14 }]}>Not sold</Text>
              )}
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Sell Price</Text>
              {detail.notSellable ? (
                <Text style={[styles.statValue, { color: colors.red, fontSize: 14 }]}>Not sellable</Text>
              ) : detail.sellPrice !== undefined ? (
                <Text style={styles.statValue}>🪙 {detail.sellPrice}g</Text>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}

      {/* Where to obtain */}
      {(shopSources.length > 0 || isCreepDrop) ? (
        <View style={panelStyle}>
          <GhostBadge>Where to Obtain</GhostBadge>
          {shopSources.length > 0 ? (
            <View style={styles.obtainSection}>
              <Text style={styles.obtainSectionLabel}>Shops</Text>
              {shopSources.map((s) => (
                <View key={s} style={styles.obtainRow}>
                  <View style={styles.obtainDot} />
                  <Text style={styles.bodyText}>{SHOP_DISPLAY[s] ?? s}</Text>
                </View>
              ))}
            </View>
          ) : null}
          {isCreepDrop && detail?.dropsFrom ? (
            <View style={styles.obtainSection}>
              <Text style={styles.obtainSectionLabel}>Creep Drops</Text>
              {detail.dropsFrom.map((d) => (
                <View key={d} style={styles.obtainRow}>
                  <View style={[styles.obtainDot, { backgroundColor: colors.red }]} />
                  <Text style={styles.bodyText}>{d}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  backBtnActive: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.gold,
  },
  backText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  iconWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    backgroundColor: colors.bgSoft,
    flexShrink: 0,
  },
  icon: {
    width: 72,
    height: 72,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 26,
  },
  bodyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  consumeNote: {
    backgroundColor: "rgba(167,139,250,0.1)",
    borderColor: "#a78bfa",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  consumeNoteText: {
    color: "#a78bfa",
    fontSize: 13,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
    alignItems: "center",
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statValue: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "800",
  },
  obtainSection: {
    gap: 8,
  },
  obtainSectionLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  obtainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  obtainDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
    marginTop: 8,
    flexShrink: 0,
  },
});
