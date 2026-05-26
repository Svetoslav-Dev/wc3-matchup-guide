"use client";

import { useActionState } from "react";
import { createItemAction } from "../app/admin/actions";

export function NewItemForm() {
  const [state, formAction] = useActionState(createItemAction, null);
  const f = state?.fields ?? {};
  return (
    <>
      {state?.error && (
        <div className="status-banner status-banner--error" style={{ maxWidth: "560px", margin: "0 auto", width: "100%" }}>{state.error}</div>
      )}
      <form key={state?.key ?? 0} action={formAction} style={{ display: "flex", justifyContent: "center" }}>
        <section className="form-panel" style={{ width: "100%", maxWidth: "560px" }}>
          <h2 style={{ color: "var(--color-gold)" }}>Details</h2>
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Potion of Healing" defaultValue={f.name ?? ""} /></div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={f.category ?? "permanent"}>
              <option value="permanent">Permanent</option>
              <option value="consumable">Consumable</option>
              <option value="tome">Tome</option>
            </select>
          </div>
          <div className="field"><label htmlFor="imageUpload">Image</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
          <div className="field"><label htmlFor="shopsInput">Shops (comma-separated, e.g. human,orc)</label><input id="shopsInput" name="shopsInput" type="text" placeholder="human,orc,undead,night-elf" defaultValue={f.shopsInput ?? ""} /></div>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="Restores 500 hit points to a friendly non-mechanical unit over time." defaultValue={f.description ?? ""} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Item</button>
          </div>
        </section>
      </form>
    </>
  );
}
