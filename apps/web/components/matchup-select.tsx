"use client";

import { useState } from "react";
import Image from "next/image";

const RACE_ICON: Record<string, string> = {
  human:      "/images/Races/Humans_Icon.png",
  orc:        "/images/Races/Orcs_Icon.png",
  "night-elf":"/images/Races/Night_Elves_Icon.png",
  undead:     "/images/Races/Undead_Icon.png",
  neutral:    "/images/Races/Neutral.png",
};

const getRaceIcons = (slug: string): [string, string] | null => {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  return [parts[0], parts[1]];
};

const Chevron = () => (
  <svg className="icon-select__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const RaceIconPair = ({ slug, size = 18 }: { slug: string; size?: number }) => {
  const races = getRaceIcons(slug);
  if (!races) return null;
  const [a, b] = races;
  return (
    <span className="icon-select__pair">
      {RACE_ICON[a] && <Image src={RACE_ICON[a]} alt={a} width={size} height={size} className="icon-select__img" />}
      <span className="icon-select__vs">vs</span>
      {RACE_ICON[b] && <Image src={RACE_ICON[b]} alt={b} width={size} height={size} className="icon-select__img" />}
    </span>
  );
};

type Matchup = { slug: string; title: string };

type Props = {
  matchups: Matchup[];
  defaultValue?: string | null;
  name?: string;
  id?: string;
};

export function MatchupSelect({ matchups, defaultValue = "", name = "matchupSlug", id = "matchupSlug" }: Props) {
  const [selected, setSelected] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);

  const current = matchups.find((m) => m.slug === selected) ?? null;

  return (
    <div className="icon-select" style={{ position: "relative" }}>
      <input type="hidden" name={name} value={selected} />
      <button
        type="button"
        id={id}
        className="icon-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
      >
        {current ? (
          <>
            <RaceIconPair slug={current.slug} />
            {current.title}
          </>
        ) : (
          <span className="text-muted">None</span>
        )}
        <Chevron />
      </button>
      {open && (
        <ul className="icon-select__menu" role="listbox">
          <li
            role="option"
            aria-selected={selected === ""}
            className={`icon-select__option${selected === "" ? " icon-select__option--active" : ""}`}
            onMouseDown={() => { setSelected(""); setOpen(false); }}
          >
            <span className="text-muted">None</span>
          </li>
          {matchups.map((matchup) => (
            <li
              key={matchup.slug}
              role="option"
              aria-selected={matchup.slug === selected}
              className={`icon-select__option${matchup.slug === selected ? " icon-select__option--active" : ""}`}
              onMouseDown={() => { setSelected(matchup.slug); setOpen(false); }}
            >
              <RaceIconPair slug={matchup.slug} size={16} />
              {matchup.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
