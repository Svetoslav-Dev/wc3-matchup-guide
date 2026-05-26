"use client";

import { useActionState } from "react";
import { createBuildAction } from "../app/admin/actions";
import { RaceSelect } from "./race-select";
import { MatchupSelect } from "./matchup-select";
import { DifficultySelect } from "./difficulty-select";

type Race = { slug: string; name: string; imageUrl?: string | null };
type Matchup = { slug: string; title: string };
type Props = { races: Race[]; matchups: Matchup[] };

export function NewBuildForm({ races, matchups }: Props) {
  const [state, formAction] = useActionState(createBuildAction, null);
  const f = state?.fields ?? {};
  return (
    <>
      {state?.error && (
        <div className="status-banner status-banner--error">{state.error}</div>
      )}
      <form key={state?.key ?? 0} action={formAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceSlug">Race</label>
            <RaceSelect races={races} defaultValue={f.raceSlug ?? races[0]?.slug ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="matchupSlug">Matchup</label>
            <MatchupSelect matchups={matchups} defaultValue={f.matchupSlug ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" placeholder="Orc Grunt Raider Timing" defaultValue={f.title ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="slug">Page URL <span className="admin-edit-form__hint">(e.g. /builds/orc-grunt-raider-timing)</span></label>
            <input id="slug" name="slug" type="text" placeholder="orc-grunt-raider-timing" defaultValue={f.slug ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <DifficultySelect defaultValue={f.difficulty ?? "Medium"} />
          </div>
          <div className="field">
            <label htmlFor="strategyType">Strategy type</label>
            <input id="strategyType" name="strategyType" type="text" placeholder="Tempo Midgame" defaultValue={f.strategyType ?? ""} />
          </div>
          <label className="field field--checkbox">
            <input name="isPublished" type="checkbox" defaultChecked={f.isPublished === "on"} />
            <span>Publish immediately</span>
          </label>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" placeholder="Explain when and why this build works." defaultValue={f.summary ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="body">Body</label>
            <textarea id="body" name="body" placeholder="Write the full build guide body here." defaultValue={f.body ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="stepsInput">Build steps</label>
            <textarea
              id="stepsInput"
              name="stepsInput"
              placeholder={"[12f, 0:00] Queue peons and send one to scout\n[18f, 1:40] Creep the first camp efficiently"}
              defaultValue={f.stepsInput ?? ""}
            />
          </div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Build</button>
          </div>
        </section>
      </form>
    </>
  );
}
