import { Link, usePathname } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "../lib/theme";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/races", label: "Races" },
  { href: "/matchups", label: "Matchups" },
  { href: "/builds", label: "Builds" },
  { href: "/heroes", label: "Heroes" },
  { href: "/favorites", label: "Favorites" },
  { href: "/profile", label: "Profile" },
];

const isActiveRoute = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function MobileNav() {
  const pathname = usePathname();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.shell}
    >
      {navItems.map((item) => {
        const active = isActiveRoute(pathname, item.href);

        return (
          <Link key={item.href} href={item.href as never} asChild>
            <Pressable style={[styles.item, active ? styles.itemActive : null]}>
              <Text style={[styles.label, active ? styles.labelActive : null]}>{item.label}</Text>
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexGrow: 0,
  },
  content: {
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  item: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  itemActive: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
  },
  label: {
    color: colors.muted,
    fontWeight: "700",
  },
  labelActive: {
    color: colors.gold,
  },
});
