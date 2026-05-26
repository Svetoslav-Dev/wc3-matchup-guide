"use client";

import { useState } from "react";
import Image from "next/image";

const RACE_ICON_FALLBACK: Record<string, string> = {
  human:       "/images/Races/Humans_Icon.png",
  orc:         "/images/Races/Orcs_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
  undead:      "/images/Races/Undead_Icon.png",
  neutral:     "/images/Races/Neutral.png",
};

const raceIcon = (race: Race): string | null =>
  race.imageUrl ?? RACE_ICON_FALLBACK[race.slug] ?? null;

const Chevron = () => (
  <svg className="icon-select__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

type Race = { slug: string; name: string; imageUrl?: string | null };

type Props = {
  races: Race[];
  defaultValue?: string;
  name?: string;
  id?: string;
  onChange?: (slug: string) => void;
};

export function RaceSelect({ races, defaultValue, name = "raceSlug", id = "raceSlug", onChange }: Props) {
  const [selected, setSelected] = useState(defaultValue ?? races[0]?.slug ?? "");
  const [open, setOpen] = useState(false);

  const current = races.find((r) => r.slug === selected) ?? races[0];

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
        {raceIcon(current) && (
          <Image src={raceIcon(current)!} alt={current.name} width={20} height={20} className="icon-select__img" />
        )}
        {current?.name}
        <Chevron />
      </button>
      {open && (
        <ul className="icon-select__menu" role="listbox">
          {races.map((race) => (
            <li
              key={race.slug}
              role="option"
              aria-selected={race.slug === selected}
              className={`icon-select__option${race.slug === selected ? " icon-select__option--active" : ""}`}
              onMouseDown={() => { setSelected(race.slug); setOpen(false); onChange?.(race.slug); }}
            >
              {raceIcon(race) && (
                <Image src={raceIcon(race)!} alt={race.name} width={20} height={20} className="icon-select__img" />
              )}
              {race.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
