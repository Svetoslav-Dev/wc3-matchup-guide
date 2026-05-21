import { ReactNode } from "react";
import { Link, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getApiBaseUrl } from "../lib/api";
import { colors } from "../lib/theme";

const NORMALIZE_DIFFICULTY: Record<string, string> = {
  "Easy":            "Easy",
  "Medium":          "Medium",
  "Hard":            "Hard",
  "Very Hard":       "Very Hard",
  "Technical":       "Medium",
  "Demanding":       "Hard",
  "High pressure":   "Hard",
  "Tight margins":   "Hard",
  "Execution heavy": "Hard",
  "Sharp timing":    "Hard",
  "Punishing":       "Very Hard",
  "Volatile":        "Very Hard",
  "Timing critical": "Hard",
  "Razor-thin":      "Very Hard",
};

const RACE_ICON: Record<string, string> = {
  "human":     "Humans_Icon.png",
  "orc":       "Orcs_Icon.png",
  "undead":    "Undead_Icon.png",
  "night-elf": "Night_Elves_Icon.png",
  "neutral":   "Neutral.png",
};

const RACE_LABEL: Record<string, string> = {
  "human":     "Human",
  "orc":       "Orc",
  "undead":    "Undead",
  "night-elf": "Night Elf",
  "neutral":   "Mercenaries",
};

export function getRaceDisplayName(slug: string): string {
  return RACE_LABEL[slug] ?? slug;
}

export function getRaceIconUri(slug: string): string {
  return raceIconUri(slug);
}

function raceIconUri(raceSlug: string) {
  const base = getApiBaseUrl() ?? "";
  return `${base}/images/Races/${RACE_ICON[raceSlug] ?? "Neutral.png"}`;
}

function parseRaces(slug: string): [string, string] {
  const parts = slug.split("-vs-");
  return [parts[0] ?? "", parts[1] ?? ""];
}

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
  difficulty,
}: {
  title: string;
  eyebrow: string;
  description: string;
  href?: string;
  difficulty?: string;
}) {
  const body = (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={[styles.eyebrow, { flex: 1 }]}>{eyebrow}</Text>
        {difficulty ? <DifficultyBadge value={difficulty} /> : null}
      </View>
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

export function MatchupCard({ slug, difficulty, summary }: { slug: string; difficulty: string; summary: string }) {
  const router = useRouter();
  const [race1, race2] = parseRaces(slug);
  const normalized = NORMALIZE_DIFFICULTY[difficulty] ?? difficulty;
  const dotColor = DIFFICULTY_COLORS[normalized];

  return (
    <Pressable
      onPress={() => router.push(`/matchups/${slug}` as never)}
      style={({ hovered, pressed }) => [
        matchupStyles.card,
        (hovered || pressed) ? matchupStyles.cardHovered : null,
      ]}
    >
      <View style={matchupStyles.racesRow}>
        <View style={matchupStyles.raceGroup}>
          <Image source={{ uri: raceIconUri(race1) }} style={matchupStyles.raceIcon} />
          <Text style={matchupStyles.raceName}>{RACE_LABEL[race1] ?? race1}</Text>
        </View>
        <Text style={matchupStyles.vs}>vs</Text>
        <View style={matchupStyles.raceGroup}>
          <Image source={{ uri: raceIconUri(race2) }} style={matchupStyles.raceIcon} />
          <Text style={matchupStyles.raceName}>{RACE_LABEL[race2] ?? race2}</Text>
        </View>
      </View>
      <View style={matchupStyles.tagsRow}>
        <View style={[matchupStyles.diffTag, dotColor ? { borderColor: dotColor } : null]}>
          {dotColor ? <View style={[matchupStyles.diffDot, { backgroundColor: dotColor }]} /> : null}
          <Text style={[matchupStyles.diffTagText, dotColor ? { color: dotColor } : null]}>
            {normalized}
          </Text>
        </View>
      </View>
      <Text style={matchupStyles.summary} numberOfLines={2}>{summary}</Text>
    </Pressable>
  );
}

const matchupStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  cardHovered: {
    backgroundColor: colors.bgSoft,
  },
  racesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  raceGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  raceIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  raceName: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
  vs: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
  },
  diffTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  diffDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  diffTagText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  summary: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});

export function BuildCard({
  slug,
  raceSlug,
  raceName,
  difficulty,
  title,
  summary,
}: {
  slug: string;
  raceSlug: string;
  raceName: string;
  difficulty: string;
  title: string;
  summary: string;
}) {
  const router = useRouter();
  const dotColor = DIFFICULTY_COLORS[difficulty];

  return (
    <Pressable
      onPress={() => router.push(`/builds/${slug}` as never)}
      style={({ hovered, pressed }) => [
        matchupStyles.card,
        (hovered || pressed) ? matchupStyles.cardHovered : null,
      ]}
    >
      <View style={matchupStyles.raceGroup}>
        <Image source={{ uri: raceIconUri(raceSlug) }} style={matchupStyles.raceIcon} />
        <Text style={matchupStyles.raceName}>{raceName}</Text>
      </View>
      <Text style={buildStyles.title}>{title}</Text>
      <View style={matchupStyles.tagsRow}>
        <View style={[matchupStyles.diffTag, dotColor ? { borderColor: dotColor } : null]}>
          {dotColor ? <View style={[matchupStyles.diffDot, { backgroundColor: dotColor }]} /> : null}
          <Text style={[matchupStyles.diffTagText, dotColor ? { color: dotColor } : null]}>
            {difficulty}
          </Text>
        </View>
      </View>
      <Text style={matchupStyles.summary} numberOfLines={2}>{summary}</Text>
    </Pressable>
  );
}

const buildStyles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});

export function RaceCard({
  slug,
  identity,
  badge,
}: {
  slug: string;
  identity: string;
  badge: string;
}) {
  const router = useRouter();
  const displayName = getRaceDisplayName(slug);

  return (
    <Pressable
      onPress={() => router.push(`/races/${slug}` as never)}
      style={({ hovered, pressed }) => [
        raceCardStyles.card,
        (hovered || pressed) ? matchupStyles.cardHovered : null,
      ]}
    >
      <View style={raceCardStyles.header}>
        <Image source={{ uri: raceIconUri(slug) }} style={raceCardStyles.icon} />
        <View style={raceCardStyles.headerText}>
          <Text style={raceCardStyles.name}>{displayName}</Text>
          <Text style={raceCardStyles.badge}>{badge}</Text>
        </View>
      </View>
      <Text style={matchupStyles.summary} numberOfLines={2}>{identity}</Text>
    </Pressable>
  );
}

const raceCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  badge: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});

export function GhostBadge({ children }: { children: ReactNode }) {
  return <Text style={styles.badge}>{children}</Text>;
}

export const DIFFICULTY_COLORS: Record<string, string> = {
  "Easy":      "#4ade80",
  "Medium":    "#facc15",
  "Hard":      "#f97316",
  "Very Hard": "#ef4444",
};

export function DifficultyBadge({ value }: { value: string }) {
  const dotColor = DIFFICULTY_COLORS[value];
  return (
    <View style={diffStyles.row}>
      {dotColor ? <View style={[diffStyles.dot, { backgroundColor: dotColor }]} /> : null}
      <Text style={diffStyles.label}>{value}</Text>
    </View>
  );
}

const diffStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
});

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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
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

