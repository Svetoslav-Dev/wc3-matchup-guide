"use client";

import { useActionState } from "react";
import { createRaceAction } from "../app/admin/actions";
import { useImageUploadValidation } from "./use-image-upload-validation";

export function NewRaceForm() {
  const [state, formAction] = useActionState(createRaceAction, null);
  const { imageError, imageLimitLabel, onImageChange, onSubmit } = useImageUploadValidation("Races");
  const f = state?.fields ?? {};
  return (
    <>
      {state?.error && (
        <div className="status-banner status-banner--error">{state.error}</div>
      )}
      {imageError ? <div className="status-banner status-banner--error">{imageError}</div> : null}
      <form key={state?.key ?? 0} action={formAction} className="form-grid" onSubmit={onSubmit}>
        <section className="form-panel">
          <h2>Core Metadata</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Human" defaultValue={f.name ?? ""} /></div>
          <div className="field"><label htmlFor="slug">Page URL <span className="admin-edit-form__hint">(e.g. /races/human)</span></label><input id="slug" name="slug" type="text" placeholder="human" defaultValue={f.slug ?? ""} /></div>
          <div className="field"><label htmlFor="identity">Identity</label><textarea id="identity" name="identity" placeholder="The Human Alliance relies on versatile units, powerful spells, and fortified structures to outlast opponents." defaultValue={f.identity ?? ""} /></div>
          <div className="field">
            <label htmlFor="imageUpload">Image <span className="admin-edit-form__hint">(max {imageLimitLabel})</span></label>
            <input id="imageUpload" name="imageUpload" type="file" accept="image/*" onChange={onImageChange} />
          </div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="Humans excel at siege and tower-based strategies, with strong mid-game unit composition options." defaultValue={f.description ?? ""} /></div>
          <div className="field"><label htmlFor="ladderFocus">Ladder focus</label><textarea id="ladderFocus" name="ladderFocus" placeholder="Focus on fast expansion into casters, leveraging the Archmage's Water Elementals for early map control." defaultValue={f.ladderFocus ?? ""} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Race</button>
          </div>
        </section>
      </form>
    </>
  );
}
