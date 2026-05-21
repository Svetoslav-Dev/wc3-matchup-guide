import { ScreenShell } from "../../components/screen-shell";
import { PageIntro, PageTitle, RaceCard, SectionLabel } from "../../components/mobile-ui";
import { useRacesContent } from "../../lib/live-content";
import { colors } from "../../lib/theme";
import { Text } from "react-native";

export default function RacesScreen() {
  const { data: races, loading } = useRacesContent();
  const playableRaces = races.filter((r) => r.slug !== "neutral");

  return (
    <ScreenShell>
      <PageTitle>Pick your poison.</PageTitle>
      <PageIntro>
        Want to spam footmen and feel righteous? Play Human. Prefer grunts and screaming into the mic? Orc. Enjoy watching your enemy's army melt before you even show up? Undead. Like trees, bears, and winning by doing absolutely nothing wrong? Night Elf.{"\n\n"}Seriously though — pick the race whose win condition clicks with how you think. If you like economic pressure and timings, go Human or Orc. If you prefer patience and comebacks, Undead or Night Elf reward the long game. No race is free — they all have hard matchups.
      </PageIntro>
      <SectionLabel>Races</SectionLabel>
      {loading ? <Text style={{ color: colors.muted }}>Loading races…</Text> : null}
      {playableRaces.map((race) => (
        <RaceCard
          key={race.slug}
          slug={race.slug}
          identity={race.identity}
          badge={race.badge}
        />
      ))}
    </ScreenShell>
  );
}
