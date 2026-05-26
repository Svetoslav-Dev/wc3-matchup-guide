"use client";

import { useActionState } from "react";
import { createHeroAction } from "../app/admin/actions";
import { RaceSelect } from "./race-select";
import { AttributeSelect } from "./attribute-select";

type Race = { slug: string; name: string; imageUrl?: string | null };
type Props = { races: Race[] };

export function NewHeroForm({ races }: Props) {
  const [state, formAction] = useActionState(createHeroAction, null);
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
          <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Archmage" defaultValue={f.name ?? ""} /></div>
          <div className="field"><label htmlFor="slug">Page URL <span className="admin-edit-form__hint">(e.g. /heroes/archmage)</span></label><input id="slug" name="slug" type="text" placeholder="archmage" defaultValue={f.slug ?? ""} /></div>
          <div className="field">
            <label htmlFor="primaryAttribute">Primary attribute</label>
            <AttributeSelect defaultValue={f.primaryAttribute ?? "Intelligence"} />
          </div>
          <div className="field">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" defaultValue={f.role ?? "Spellcaster"}>
              <option value="Fighter">Fighter</option>
              <option value="Spellcaster">Spellcaster</option>
              <option value="Support">Support</option>
              <option value="Tank">Tank</option>
              <option value="Assassin">Assassin</option>
              <option value="Summoner">Summoner</option>
              <option value="Ranged">Ranged</option>
            </select>
          </div>
          <div className="field"><label htmlFor="imageUpload">Image</label><input id="imageUpload" name="imageUpload" type="file" accept="image/*" /></div>
        </section>
        <section className="form-panel">
          <h2>Guide Content</h2>
          <div className="field"><label htmlFor="description">Description</label><textarea id="description" name="description" placeholder="The Archmage is the pinnacle of Human magical warfare, capable of unleashing devastating area spells." defaultValue={f.description ?? ""} /></div>
          <div className="field"><label htmlFor="highlightsInput">Highlights</label><textarea id="highlightsInput" name="highlightsInput" placeholder={"Strong first-hero scouting\nReliable mana pressure"} defaultValue={f.highlightsInput ?? ""} /></div>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="button button--ghost" type="submit">Create Hero</button>
          </div>
        </section>
      </form>
    </>
  );
}
