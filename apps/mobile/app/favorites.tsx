import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { FavoriteBuild } from "@warcraft3-guide-hub/shared";
import { ScreenShell } from "../components/screen-shell";
import { GhostBadge, ListCard, PageIntro, PageTitle, SectionLabel } from "../components/mobile-ui";
import { useAuth } from "../lib/auth-context";
import { mobileApi } from "../lib/api";
import { mobileData } from "../lib/mobile-data";
import { colors } from "../lib/theme";

export default function FavoritesScreen() {
  const { apiReady, token, user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteBuild[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!apiReady || !token) {
      setFavorites([]);
      return;
    }

    let cancelled = false;

    const loadFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await mobileApi.getFavorites(token);

        if (!cancelled) {
          setFavorites(response.data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load favorites.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [apiReady, reloadKey, token]);

  return (
    <ScreenShell>
      <SectionLabel>Favorites</SectionLabel>
      <PageTitle>Saved plans for quick recall.</PageTitle>
      <PageIntro>
        Favorites now read from the protected API when mobile auth is configured. Fallback data still keeps the screen useful in local UI-only mode.
      </PageIntro>
      {!apiReady ? (
        <View style={styles.panel}>
          <GhostBadge>API offline</GhostBadge>
          <Text style={styles.heading}>Showing fallback favorites.</Text>
          <Text style={styles.copy}>Set `EXPO_PUBLIC_API_URL` to load the authenticated favorites list.</Text>
        </View>
      ) : null}
      {apiReady && !user ? (
        <View style={styles.panel}>
          <GhostBadge>Sign in required</GhostBadge>
          <Text style={styles.heading}>Log in from the Profile screen to sync favorites.</Text>
          <Text style={styles.copy}>The protected favorites endpoint requires a valid user token.</Text>
        </View>
      ) : null}
      {apiReady && token && loading ? (
        <View style={styles.panel}>
          <Text style={styles.copy}>Loading favorites…</Text>
        </View>
      ) : null}
      {apiReady && token && error ? (
        <View style={styles.panel}>
          <GhostBadge>Request failed</GhostBadge>
          <Text style={styles.copy}>{error}</Text>
          <Pressable
            onPress={() => {
              setError(null);
              setReloadKey((value) => value + 1);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
      {apiReady && token && !loading && !error && favorites.length === 0 ? (
        <View style={styles.panel}>
          <GhostBadge>Empty</GhostBadge>
          <Text style={styles.heading}>No saved builds yet.</Text>
          <Text style={styles.copy}>Save a build from the mobile or web build detail page and it will appear here for the signed-in user.</Text>
        </View>
      ) : null}
      {(apiReady && token ? favorites.map((favorite) => favorite.build) : mobileData.favoriteBuilds).map((build) => (
        <ListCard
          key={build.slug}
          eyebrow={build.raceName}
          title={build.title}
          description={build.summary}
          href={`/builds/${build.slug}`}
        />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  heading: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  copy: {
    color: colors.muted,
    lineHeight: 22,
  },
  button: {
    alignSelf: "flex-start",
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.bgSoft,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "700",
  },
});
