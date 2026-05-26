"use client";

import { useActionState } from "react";
import { createBuildingAction } from "../app/admin/actions";
import { RaceSelect } from "./race-select";

type Race = { slug: string; name: string; imageUrl?: string | null };
type Props = { races: Race[] };

export function NewBuildingForm({ races }: Props) {
  const [state, formAction] = useActionState(createBuildingAction, null);
  const f = state?.fields ?? {};
  return (
    <>
      {state?.error && (
        <div className="status-banner status-banner--error" style={{ maxWidth: "560px", margin: "0 auto", width: "100%" }}>{state.error}</div>
      )}
      <form key={state?.key ?? 0} action={formAction} style={{ display: "flex", justifyContent: "center" }}>
        <section className="form-panel" style={{ width: "100%", maxWidth: "560px" }}>
          <h2>Details</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Town Hall" defaultValue={f.name ?? ""} /></div>
          <div className="field">
            <label htmlFor="race">Race</label>
            <RaceSelect races={races} defaultValue={f.race ?? races[0]?.slug ?? ""} name="race" id="race" />
          </div>
          <div className="field"><label htmlFor="imageUpload">Image</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="The primary structure of the Human base, used to train Peasants and research key upgrades." defaultValue={f.description ?? ""} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Building</button>
          </div>
        </section>
      </form>
    </>
  );
}
