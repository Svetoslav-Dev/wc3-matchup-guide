import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { GhostBadge, PageIntro, PageTitle, getRaceDisplayName, getRaceIconUri } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useAuth } from "../../lib/auth-context";
import { mobileApi } from "../../lib/api";
import { useBuildContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

export default function BuildDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { apiReady, token, user } = useAuth();
  const { data: build, loading } = useBuildContent(slug);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [favoritePending, setFavoritePending] = useState(false);

  useEffect(() => {
    if (!apiReady || !token || !build) {
      setFavoriteId(null);
      setFavoriteError(null);
      setFavoriteLoading(false);
      return;
    }

    let cancelled = false;

    const loadFavoriteState = async () => {
      setFavoriteLoading(true);
      setFavoriteError(null);

      try {
        const response = await mobileApi.getFavorites(token);
        const favorite = response.data.find((entry) => entry.build.slug === build.slug);

        if (!cancelled) {
          setFavoriteId(favorite?.id ?? null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setFavoriteError(
            loadError instanceof Error ? loadError.message : "Unable to load favorite state.",
          );
        }
      } finally {
        if (!cancelled) {
          setFavoriteLoading(false);
        }
      }
    };

    void loadFavoriteState();

    return () => {
      cancelled = true;
    };
  }, [apiReady, build, token]);

  if (!build) {
    return (
      <ScreenShell>
        <PageTitle>Build not found.</PageTitle>
      </ScreenShell>
    );
  }

  const raceName = getRaceDisplayName(build.raceSlug);
  const displayTitle = build.title.startsWith(raceName + " ")
    ? build.title.slice(raceName.length + 1)
    : build.title;

  return (
    <ScreenShell>
      <Pressable
        onPress={() => router.back()}
        style={({ hovered, pressed }) => [styles.backBtn, (hovered || pressed) ? styles.backBtnActive : null]}
      >
        <Text style={styles.backText}>← Builds</Text>
      </Pressable>

      {/* Race + title hero */}
      <View style={styles.hero}>
        <Image source={{ uri: getRaceIconUri(build.raceSlug) }} style={styles.raceIcon} />
        <View style={styles.heroText}>
          <Text style={styles.raceLabel}>{raceName}</Text>
          <Text style={styles.heroTitle}>{displayTitle}</Text>
        </View>
      </View>

      {/* Tags row */}
      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{build.strategyType}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{build.difficulty}</Text>
        </View>
      </View>

      <PageIntro>{build.summary}</PageIntro>
      {loading ? <Text style={{ color: colors.muted }}>Refreshing build order…</Text> : null}
      {apiReady && user ? (
        <View style={styles.actionPanel}>
          <GhostBadge>Favorites</GhostBadge>
          {favoriteError ? <Text style={styles.metaCopy}>{favoriteError}</Text> : null}
          {favoriteLoading ? <Text style={styles.metaCopy}>Checking saved state…</Text> : null}
          <Pressable
            disabled={favoritePending || favoriteLoading}
            onPress={async () => {
              if (!token) {
                return;
              }

              setFavoritePending(true);
              setFavoriteError(null);

              try {
                if (favoriteId) {
                  await mobileApi.removeFavorite(token, favoriteId);
                  setFavoriteId(null);
                } else {
                  const response = await mobileApi.addFavorite(token, build.slug);
                  setFavoriteId(response.data.id);
                }
              } catch (mutationError) {
                setFavoriteError(
                  mutationError instanceof Error
                    ? mutationError.message
                    : "Unable to update favorite.",
                );
              } finally {
                setFavoritePending(false);
              }
            }}
            style={[styles.favoriteButton, favoritePending || favoriteLoading ? styles.favoriteButtonDisabled : null]}
          >
            <Text style={styles.favoriteButtonText}>
              {favoritePending
                ? "Updating…"
                : favoriteId
                  ? "Remove from Favorites"
                  : "Save to Favorites"}
            </Text>
          </Pressable>
        </View>
      ) : null}
      {apiReady && !user ? (
        <Text style={styles.metaCopy}>Log in from Profile to save this build to mobile favorites.</Text>
      ) : null}
      <GhostBadge>Build Order</GhostBadge>
      {build.steps.map((step) => (
        <View key={step.stepNumber} style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNumText}>{step.stepNumber}</Text>
            </View>
            <View style={styles.stepMeta}>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>🍖 {step.supply}</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>⏱ {step.timing}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.stepInstruction}>{step.instruction}</Text>
        </View>
      ))}
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
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  raceIcon: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  raceLabel: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.85,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  actionPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  metaCopy: {
    color: colors.muted,
    lineHeight: 22,
  },
  favoriteButton: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 12,
  },
  favoriteButtonDisabled: {
    opacity: 0.7,
  },
  favoriteButtonText: {
    color: colors.bg,
    fontWeight: "800",
  },
  stepCard: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepNumBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "800",
  },
  stepMeta: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  metaChip: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaChipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  stepInstruction: {
    color: "#a7b4cd",
    lineHeight: 22,
    fontSize: 14,
  },
});
