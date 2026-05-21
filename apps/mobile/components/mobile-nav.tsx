import { useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";
import { useAuth } from "../lib/auth-context";

const BASE_NAV_ITEMS = [
  { href: "/", label: "Homepage" },
  { href: "/races", label: "Races" },
  { href: "/heroes", label: "Heroes" },
  { href: "/units", label: "Units" },
  { href: "/buildings", label: "Buildings" },
  { href: "/items", label: "Items" },
  { href: "/maps", label: "Maps" },
  { href: "/matchups", label: "Matchups" },
  { href: "/builds", label: "Builds" },
];

const isActiveRoute = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const navItems = user
    ? [...BASE_NAV_ITEMS, { href: "/favorites", label: "Favorites" }]
    : BASE_NAV_ITEMS;

  const current = navItems.find((item) => isActiveRoute(pathname, item.href));

  return (
    <View style={styles.shell}>
      <Pressable onPress={() => setOpen(true)} style={styles.trigger}>
        <Text style={styles.triggerLabel}>{current?.label ?? "Menu"}</Text>
        <Text style={styles.chevron}>{open ? "▴" : "▾"}</Text>
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}
      >
        <Pressable onPress={() => setOpen(false)} style={styles.backdrop}>
          <View style={styles.dropdown}>
            {navItems.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              return (
                <Pressable
                  key={item.href}
                  onPress={() => { setOpen(false); router.push(item.href as never); }}
                  style={({ hovered, pressed }) => [
                    styles.item,
                    active ? styles.itemActive : null,
                    !active && (hovered || pressed) ? styles.itemHovered : null,
                  ]}
                >
                  <Text style={[styles.itemLabel, active ? styles.itemLabelActive : null]}>
                    {item.label}
                  </Text>
                  {active ? <Text style={styles.activeDot}>●</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexShrink: 0,
  },
  trigger: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  triggerLabel: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
  chevron: {
    color: colors.muted,
    fontSize: 10,
  },
  backdrop: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
    backgroundColor: "rgba(8, 16, 24, 0.7)",
  },
  dropdown: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    overflow: "hidden",
    maxWidth: 320,
    alignSelf: "flex-end",
    width: "70%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
  },
  itemActive: {
    backgroundColor: colors.goldSoft,
  },
  itemHovered: {
    backgroundColor: colors.bgSoft,
  },
  itemLabel: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 15,
  },
  itemLabelActive: {
    color: colors.gold,
  },
  activeDot: {
    color: colors.gold,
    fontSize: 8,
  },
});
