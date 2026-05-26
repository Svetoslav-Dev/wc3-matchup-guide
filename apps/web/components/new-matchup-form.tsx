"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { RaceSelect } from "./race-select";
import { DifficultySelect } from "./difficulty-select";
import { createMatchupAction } from "../app/admin/actions";

const EDIT_LINK_RE = /Edit it at (\/admin\/matchups\/[^\s]+)/;

type Race = { slug: string; name: string; imageUrl?: string | null };

type Props = { races: Race[] };

export function NewMatchupForm({ races }: Props) {
  const [state, formAction] = useActionState(createMatchupAction, null);
  const f = state?.fields ?? {};

  const defaultA = f.raceASlug ?? races[0]?.slug ?? "";
  const defaultB = f.raceBSlug ?? races[1]?.slug ?? races[0]?.slug ?? "";

  const [raceASlug, setRaceASlug] = useState(defaultA);
  const [raceBSlug, setRaceBSlug] = useState(defaultB);

  const nameOf = (slug: string) => races.find((r) => r.slug === slug)?.name ?? slug;

  const autoTitle = `${nameOf(raceASlug)} vs ${nameOf(raceBSlug)}`;
  const autoSlug = `${raceASlug}-vs-${raceBSlug}`;

  return (
    <>
      {state?.error && (() => {
        const match = EDIT_LINK_RE.exec(state.error);
        if (match) {
          const editPath = match[1];
          return (
            <div className="status-banner status-banner--error">
              This matchup already exists.{" "}
              <Link href={editPath} style={{ color: "inherit", fontWeight: 600, textDecoration: "underline" }}>Edit the existing matchup →</Link>
            </div>
          );
        }
        return <div className="status-banner status-banner--error">{state.error}</div>;
      })()}
      <form key={state?.key ?? 0} action={formAction} className="form-grid">
      <section className="form-panel">
        <h2>Core Metadata</h2>
        <input type="hidden" name="title" value={autoTitle} />
        <input type="hidden" name="slug" value={autoSlug} />
        <div className="field">
          <label htmlFor="raceASlug">Race A</label>
          <RaceSelect races={races} defaultValue={defaultA} name="raceASlug" id="raceASlug" onChange={setRaceASlug} />
        </div>
        <div className="field">
          <label htmlFor="raceBSlug">Race B</label>
          <RaceSelect races={races} defaultValue={defaultB} name="raceBSlug" id="raceBSlug" onChange={setRaceBSlug} />
        </div>
        <div className="field">
          <label htmlFor="difficulty">Difficulty</label>
          <DifficultySelect defaultValue={f.difficulty ?? "Medium"} />
        </div>
        <div className="field">
          <label htmlFor="summary">Summary</label>
          <textarea id="summary" name="summary" placeholder="Summarize the matchup in one compact paragraph." defaultValue={f.summary ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="commonMistakesInput">Common mistakes</label>
          <textarea id="commonMistakesInput" name="commonMistakesInput" placeholder={"Over-chasing during the first push.\nSkipping key scouting before expansion timing."} defaultValue={f.commonMistakesInput ?? ""} />
        </div>
      </section>
      <section className="form-panel">
        <h2>Guide Content</h2>
        <div className="field">
          <label htmlFor="earlyGamePlan">Early game plan</label>
          <textarea id="earlyGamePlan" name="earlyGamePlan" placeholder="Harass with your hero, deny creep camps, and scout the opponent's opening strategy." defaultValue={f.earlyGamePlan ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="midGamePlan">Mid game plan</label>
          <textarea id="midGamePlan" name="midGamePlan" placeholder="Secure an expansion and transition into your core unit composition at tier 2." defaultValue={f.midGamePlan ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="lateGamePlan">Late game plan</label>
          <textarea id="lateGamePlan" name="lateGamePlan" placeholder="Dominate with a fully upgraded army; focus down heroes and avoid prolonged sieges." defaultValue={f.lateGamePlan ?? ""} />
        </div>
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button className="button button--ghost" type="submit">Create Matchup</button>
        </div>
      </section>
      </form>
    </>
  );
}
