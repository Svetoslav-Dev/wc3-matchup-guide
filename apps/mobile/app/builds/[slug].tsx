import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GhostBadge, PageIntro, PageTitle, SectionLabel } from "../../components/mobile-ui";
import { ScreenShell } from "../../components/screen-shell";
import { useAuth } from "../../lib/auth-context";
import { mobileApi } from "../../lib/api";
import { useBuildContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";

export default function BuildDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
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

  return (
    <ScreenShell>
      <SectionLabel>{build.strategyType}</SectionLabel>
      <PageTitle>{build.title}</PageTitle>
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
      {build.steps.map((step) => (
        <View
          key={step.stepNumber}
          style={styles.stepCard}
        >
          <GhostBadge>
            Step {step.stepNumber} · {step.supply} supply · {step.timing}
          </GhostBadge>
          <Text style={{ color: "#a7b4cd", lineHeight: 22 }}>{step.instruction}</Text>
        </View>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
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
    gap: 8,
  },
});
