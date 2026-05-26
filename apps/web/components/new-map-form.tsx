"use client";

import { useActionState } from "react";
import { createMapAction } from "../app/admin/actions";
import { useImageUploadValidation } from "./use-image-upload-validation";

export function NewMapForm() {
  const [state, formAction] = useActionState(createMapAction, null);
  const { imageError, imageLimitLabel, onImageChange, onSubmit } = useImageUploadValidation("Maps");
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
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Twisted Meadows" defaultValue={f.name ?? ""} /></div>
          <div className="field"><label htmlFor="slug">Page URL <span className="admin-edit-form__hint">(e.g. /maps/twisted-meadows)</span></label><input id="slug" name="slug" type="text" placeholder="twisted-meadows" defaultValue={f.slug ?? ""} /></div>
          <div className="field">
            <label htmlFor="imageUpload">Image <span className="admin-edit-form__hint">(max {imageLimitLabel})</span></label>
            <input id="imageUpload" name="imageUpload" type="file" accept="image/*" onChange={onImageChange} />
          </div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="A classic 1v1 map with a central expansion and multiple creep camps guarding key resources." defaultValue={f.description ?? ""} /></div>
          <div className="field"><label htmlFor="creepNotes">Creep notes</label><textarea id="creepNotes" name="creepNotes" placeholder="Two neutral camps guard the expansions; the green camp near the center drops a powerful item." defaultValue={f.creepNotes ?? ""} /></div>
          <div className="field"><label htmlFor="expansionNotes">Expansion notes</label><textarea id="expansionNotes" name="expansionNotes" placeholder="Expansions are accessible early but heavily contested; timing your expo around the first creep run is key." defaultValue={f.expansionNotes ?? ""} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Map</button>
          </div>
        </section>
      </form>
    </>
  );
}
