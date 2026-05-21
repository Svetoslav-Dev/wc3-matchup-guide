"use client";

type Props = {
  activeRace?: string;
  activeMatchup?: string;
  activeDifficulty?: string;
  onRaceChange?: (race: string | undefined) => void;
  onDifficultyChange?: (difficulty: string | undefined) => void;
};

const raceFilters = [
  { slug: "all",       name: "All" },
  { slug: "human",     name: "Human" },
  { slug: "orc",       name: "Orc" },
  { slug: "undead",    name: "Undead" },
  { slug: "night-elf", name: "Night Elf" },
];

const difficultyFilters = [
  { slug: "all",       name: "All",       color: null },
  { slug: "Easy",      name: "Easy",      color: "#4ade80" },
  { slug: "Medium",    name: "Medium",    color: "#facc15" },
  { slug: "Hard",      name: "Hard",      color: "#f97316" },
  { slug: "Very Hard", name: "Very Hard", color: "#ef4444" },
];

export function BuildFilterBar({ activeRace, activeDifficulty, onRaceChange, onDifficultyChange }: Props) {
  const activeRaceSlug = activeRace ?? "all";
  const activeDiffSlug = activeDifficulty ?? "all";

  return (
    <div className="filter-panel">
      <div className="filter-panel__group">
        <span className="filter-panel__label">Race</span>
        <div className="filter-chip-row">
          {raceFilters.map((race) => {
            const active = activeRaceSlug === race.slug;
            return (
              <button
                key={race.slug}
                type="button"
                className={`filter-chip${active ? " filter-chip--active" : ""}`}
                onClick={() => onRaceChange?.(race.slug === "all" ? undefined : race.slug)}
              >
                {race.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="filter-panel__group">
        <span className="filter-panel__label">Difficulty</span>
        <div className="filter-chip-row">
          {difficultyFilters.map((d) => {
            const active = activeDiffSlug === d.slug;
            const activeStyle = active && d.color
              ? { borderColor: d.color, background: `${d.color}22`, color: d.color }
              : !active && d.color
              ? { borderColor: d.color, color: d.color }
              : undefined;
            return (
              <button
                key={d.slug}
                type="button"
                className="filter-chip"
                style={activeStyle}
                onClick={() => onDifficultyChange?.(d.slug === "all" ? undefined : d.slug)}
              >
                {d.color && (
                  <span className="filter-chip__dot" style={{ backgroundColor: d.color }} />
                )}
                {d.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
