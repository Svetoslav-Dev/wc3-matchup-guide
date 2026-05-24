import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { MobileNav } from "./mobile-nav";
import { colors } from "../lib/theme";

type Props = {
  children: ReactNode;
};

export function ScreenShell({ children }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Link href="/" asChild>
          <Pressable style={styles.logo}>
            <Text style={styles.logoText}>WC3</Text>
            <Text style={styles.logoSub}>Matchup Guide</Text>
          </Pressable>
        </Link>
        <MobileNav />
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.inner}>{children}</View>
        <Text style={styles.disclaimer}>
          Unofficial fan project for educational purposes. Warcraft is a trademark of Blizzard Entertainment.
        </Text>
        <Text style={styles.credit}>© Svetoslav Dichkov {new Date().getFullYear()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.bgSoft,
  },
  logo: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  logoText: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },
  logoSub: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  inner: {
    padding: 20,
    gap: 16,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 4,
    opacity: 0.6,
  },
  credit: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    opacity: 0.4,
  },
});
