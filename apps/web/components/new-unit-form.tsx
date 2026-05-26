"use client";

import { useActionState } from "react";
import { createUnitAction } from "../app/admin/actions";
import { RaceSelect } from "./race-select";

type Race = { slug: string; name: string; imageUrl?: string | null };
type Props = { races: Race[] };

export function NewUnitForm({ races }: Props) {
  const [state, formAction] = useActionState(createUnitAction, null);
  const f = state?.fields ?? {};
  return (
    <>
      {state?.error && (
        <div className="status-banner status-banner--error">{state.error}</div>
      )}
      <form key={state?.key ?? 0} action={formAction} className="form-grid">
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="raceSlug">Race</label><RaceSelect races={races} defaultValue={f.raceSlug ?? races[0]?.slug ?? ""} /></div>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Footman" defaultValue={f.name ?? ""} /></div>
          <div className="field"><label htmlFor="slug">Page URL <span className="admin-edit-form__hint">(e.g. /units/footman)</span></label><input id="slug" name="slug" type="text" placeholder="footman" defaultValue={f.slug ?? ""} /></div>
          <div className="field"><label htmlFor="unitType">Unit type</label><input id="unitType" name="unitType" type="text" placeholder="Melee" defaultValue={f.unitType ?? ""} /></div>
          <div className="field"><label htmlFor="imageUpload">Image</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="The Footman is the core frontline unit of the Human Alliance, offering solid armor and a defensive ability." defaultValue={f.description ?? ""} /></div>
          <div className="field"><label htmlFor="strengthsInput">Strengths</label><textarea id="strengthsInput" name="strengthsInput" placeholder={"Strong armor against physical attacks\nExcellent meatshield for ranged units"} defaultValue={f.strengthsInput ?? ""} /></div>
          <div className="field"><label htmlFor="weaknessesInput">Weaknesses</label><textarea id="weaknessesInput" name="weaknessesInput" placeholder={"Vulnerable to magic damage\nSlow movement speed"} defaultValue={f.weaknessesInput ?? ""} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Unit</button>
          </div>
        </section>
      </form>
    </>
  );
}
