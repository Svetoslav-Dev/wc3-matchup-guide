import { ReactNode } from "react";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../lib/theme";

export function SectionLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function PageIntro({ children }: { children: ReactNode }) {
  return <Text style={styles.intro}>{children}</Text>;
}

export function Panel({ children }: { children: ReactNode }) {
  return <View style={styles.panel}>{children}</View>;
}

export function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function ListCard({
  title,
  eyebrow,
  description,
  href,
}: {
  title: string;
  eyebrow: string;
  description: string;
  href?: string;
}) {
  const body = (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardBody}>{description}</Text>
    </View>
  );

  if (!href) {
    return body;
  }

  return (
    <Link href={href as never} asChild>
      <Pressable>{body}</Pressable>
    </Link>
  );
}

export function GhostBadge({ children }: { children: ReactNode }) {
  return <Text style={styles.badge}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    color: colors.gold,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "800",
  },
  intro: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  statRow: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  statValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  eyebrow: {
    color: colors.gold,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 11,
    fontWeight: "700",
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  cardBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  badge: {
    alignSelf: "flex-start",
    color: colors.gold,
    backgroundColor: colors.goldSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },
});

