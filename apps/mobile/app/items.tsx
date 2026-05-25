import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenShell } from "../components/screen-shell";
import { GhostBadge, SectionLabel } from "../components/mobile-ui";
import { items } from "@warcraft3-guide-hub/shared";
import { colors } from "../lib/theme";

function slugify(name: string): string {
  return name.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const CATEGORY_OPTIONS = [
  { slug: "all",        label: "All" },
  { slug: "permanent",  label: "Permanent" },
  { slug: "consumable", label: "Consumable" },
  { slug: "tome",       label: "Tomes" },
];

const SHOP_OPTIONS = [
  { slug: "all",             label: "All Shops" },
  { slug: "human",           label: "Arcane Vault" },
  { slug: "orc",             label: "Voodoo Lounge" },
  { slug: "undead",          label: "Tomb of Relics" },
  { slug: "night-elf",       label: "Ancient of Wonders" },
  { slug: "goblin-merchant", label: "Goblin Merchant" },
  { slug: "creep-drop",      label: "Creep Drop" },
];

const CATEGORY_COLOR: Record<string, string> = {
  permanent:  colors.gold,
  consumable: colors.green,
  tome:       "#a78bfa",
};

export default function ItemsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [shopFilter, setShopFilter] = useState("all");

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesShop =
      shopFilter === "all" ||
      (shopFilter === "creep-drop" ? item.shops.includes("creep-drop") : item.shops.includes(shopFilter));
    const matchesSearch =
      normalizedSearch.length === 0 ||
      item.name.toLowerCase().includes(normalizedSearch) ||
      item.description.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesShop && matchesSearch;
  });

  return (
    <ScreenShell>
      <SectionLabel>Items</SectionLabel>

      <View style={styles.filterPanel}>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Search by name or description"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
        />
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {CATEGORY_OPTIONS.map((opt) => {
              const active = opt.slug === categoryFilter;
              return (
                <Pressable
                  key={opt.slug}
                  onPress={() => setCategoryFilter(opt.slug)}
                  style={[styles.chip, active ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <Text style={styles.filterLabel}>Shop</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {SHOP_OPTIONS.map((opt) => {
              const active = opt.slug === shopFilter;
              return (
                <Pressable
                  key={opt.slug}
                  onPress={() => setShopFilter(opt.slug)}
                  style={[styles.chip, active ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <GhostBadge>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</GhostBadge>

      {filtered.map((item) => {
        const catColor = CATEGORY_COLOR[item.category] ?? colors.muted;
        const imgUri = `/images/Items/${item.imageFile}.png`;
        return (
          <Pressable key={item.name} onPress={() => router.push(`/items/${slugify(item.name)}` as never)} style={({ hovered, pressed }) => [styles.card, (hovered || pressed) ? styles.cardHovered : null]}>
            <View style={styles.cardRow}>
              <Image
                source={{ uri: imgUri }}
                style={styles.itemImg}
                defaultSource={{ uri: "/images/placeholder.svg" }}
              />
              <View style={styles.cardText}>
                <Text style={[styles.categoryPill, { color: catColor }]}>{item.category}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              </View>
            </View>
            {item.shops.length > 0 ? (
              <Text style={styles.shops}>Available: {item.shops.join(", ")}</Text>
            ) : null}
          </Pressable>
        );
      })}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  filterPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  filterLabel: { color: colors.text, fontWeight: "700", fontSize: 13 },
  searchInput: {
    color: colors.text,
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.bgSoft,
  },
  chipActive: { borderColor: colors.gold, backgroundColor: colors.goldSoft },
  chipText: { color: colors.muted, fontWeight: "700", fontSize: 13 },
  chipTextActive: { color: colors.gold },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  cardHovered: { backgroundColor: colors.bgSoft },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemImg: { width: 48, height: 48, borderRadius: 8 },
  cardText: { flex: 1, gap: 3 },
  categoryPill: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  name: { color: colors.text, fontSize: 15, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  shops: { color: colors.muted, fontSize: 12, fontStyle: "italic" },
});
