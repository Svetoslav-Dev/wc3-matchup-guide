"use client";

import { useActionState, useState } from "react";
import { DifficultySelect } from "../../../components/difficulty-select";
import { RaceSelect } from "../../../components/race-select";
import { MatchupSelect } from "../../../components/matchup-select";
import { formatBuildStepsInput, slugify } from "../../../lib/admin-forms";
import type { BuildActionState } from "../user-actions";
import type { AdminBuildRecord } from "@warcraft3-guide-hub/shared";

type Race = { slug: string; name: string };
type Matchup = { slug: string; title: string };

type Props = {
  visibleRaces: Race[];
  matchups: Matchup[];
  editBuild: AdminBuildRecord | null;
  action: (prevState: BuildActionState, formData: FormData) => Promise<BuildActionState>;
};

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  slug: "URL Identifier",
  summary: "Summary",
  difficulty: "Difficulty",
  strategyType: "Strategy Type",
  body: "Body",
  stepsInput: "Build Steps",
};

const initialState: BuildActionState = { status: "idle" };

export function SubmitBuildForm({ visibleRaces, matchups, editBuild, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const isEditing = !!editBuild;

  const f = state.fields;
  const raceSlug    = f?.raceSlug    ?? editBuild?.raceSlug    ?? visibleRaces[0]?.slug ?? "";
  const matchupSlug = f?.matchupSlug ?? editBuild?.matchupSlug ?? "";
  const [title, setTitle] = useState(f?.title ?? editBuild?.title ?? "");
  const difficulty  = f?.difficulty  ?? editBuild?.difficulty  ?? "Medium";
  const strategyType = f?.strategyType ?? editBuild?.strategyType ?? "";
  const summary     = f?.summary     ?? editBuild?.summary     ?? "";
  const body        = f?.body        ?? editBuild?.body        ?? "";
  const stepsInput  = f?.stepsInput  ?? (editBuild ? formatBuildStepsInput(editBuild.steps) : "");
  const isPublishedChecked = f ? f.isPublished === "on" : (editBuild?.isPublished ?? false);

  const missingFields = state.missingFields
    ? state.missingFields.split(",").map((field) => FIELD_LABELS[field.trim()] ?? field.trim()).join(", ")
    : null;

  const statusMessage =
    state.status === "validation-error"
      ? { text: state.errorMessage ?? `Please fill in all required fields${missingFields ? `: ${missingFields}` : ""}.`, isError: true }
      : state.status === "server-error"
      ? { text: "Something went wrong saving your build. Please try again.", isError: true }
      : null;

  return (
    <>
      {statusMessage ? (
        <p className={statusMessage.isError ? "submit-error-msg" : "muted"}>
          {statusMessage.text}
        </p>
      ) : null}

      <form
        key={state.errorKey ?? 0}
        action={formAction}
        className="form-grid"
        id="submit-build"
      >
        {isEditing && <input type="hidden" name="buildId" value={editBuild.id} />}
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field">
            <label htmlFor="raceSlug">Race</label>
            <RaceSelect races={visibleRaces} defaultValue={raceSlug} />
          </div>
          <div className="field">
            <label htmlFor="matchupSlug">Matchup</label>
            <MatchupSelect matchups={matchups} defaultValue={matchupSlug ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Human Fast Expand Into Casters"
            />
            {title && (
              <span className="muted" style={{ fontSize: "0.78rem", marginTop: "0.25rem", display: "block" }}>
                URL: /builds/{slugify(title)}
              </span>
            )}
          </div>
          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <DifficultySelect defaultValue={difficulty} />
          </div>
          <div className="field">
            <label htmlFor="strategyType">Strategy type</label>
            <input
              id="strategyType"
              name="strategyType"
              type="text"
              defaultValue={strategyType}
              placeholder="Macro Expansion"
            />
          </div>
          {isEditing && (
            <label className="field field--checkbox">
              <input name="isPublished" type="checkbox" defaultChecked={isPublishedChecked} />
              <span>Published</span>
            </label>
          )}
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              name="summary"
              defaultValue={summary}
              placeholder="Explain what the build is trying to achieve and when to use it."
            />
          </div>
          <div className="field">
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              name="body"
              defaultValue={body}
              placeholder="Write the complete build guide body here."
            />
          </div>
          <div className="field">
            <label htmlFor="stepsInput">Build steps</label>
            <textarea
              id="stepsInput"
              name="stepsInput"
              defaultValue={stepsInput}
              placeholder={"[12f, 0:00] Queue peasants and send one to scout\n[18f, 1:35] Start the expansion and secure the camp"}
            />
          </div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            {isEditing ? (
              <button className="button button--ghost" type="submit" disabled={isPending}>
                Save Changes
              </button>
            ) : (
              <>
                <button
                  className="button button--ghost"
                  name="publishMode"
                  value="draft"
                  type="submit"
                  disabled={isPending}
                >
                  Save as Draft
                </button>
                <button
                  className="button button--publish"
                  name="publishMode"
                  value="publish"
                  type="submit"
                  disabled={isPending}
                >
                  Publish Now
                </button>
              </>
            )}
          </div>
        </section>
      </form>
    </>
  );
}
