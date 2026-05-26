import Image from "next/image";
import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getHeroBySlug as getSharedHero } from "@warcraft3-guide-hub/shared";
import { formatLineItemsInput } from "../../../../../lib/admin-forms";
import { getSessionUser } from "../../../../../lib/auth";
import { listRaces } from "../../../../../lib/content";
import { ensureAdminHeroEditor, updateHeroAction } from "../../../actions";
import { RaceSelect } from "../../../../../components/race-select";
import { AttributeSelect } from "../../../../../components/attribute-select";

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<{ status?: string; error?: string }> };

export default async function EditAdminHeroPage({ params, searchParams }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Hero Editor</p>
          <h1 className="page-title">Hero editing requires backend configuration.</h1>
        </div>
      </div>
    );
  }

  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return (
      <div className="page-shell page-stack">
        <div className="section-head">
          <p className="section-label">Admin Hero Editor</p>
          <h1 className="page-title">Admin access required.</h1>
        </div>
      </div>
    );
  }

  const { slug } = await params;
  const { error, status } = (await searchParams) ?? {};
  const [hero, raceResult] = await Promise.all([ensureAdminHeroEditor(slug), listRaces(1, 20)]);
  if (!hero) notFound();
  const visibleRaces = raceResult.data.map((r) => r.slug === "neutral" ? { ...r, name: "Tavern" } : r);

  const previewSrc = hero.imageUrl ?? getSharedHero(hero.slug)?.imageUrl ?? null;

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Hero Editor</p>
          <h1 className="page-title">Edit {hero.name}</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/heroes" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>

      {(status === "updated" || status === "created") && (
        <div className="status-banner status-banner--success">Hero {status === "created" ? "created" : "updated"}.</div>
      )}
      {error && (
        <div className="status-banner status-banner--error">{decodeURIComponent(error)}</div>
      )}
      <form action={updateHeroAction} className="admin-edit-form">
        <input type="hidden" name="heroId" value={hero.id} />
        <input type="hidden" name="currentSlug" value={hero.slug} />
        <input type="hidden" name="imageUrl" value={hero.imageUrl ?? ""} />

        <div className="admin-edit-form__body">
          <div className="admin-edit-form__fields">
            <div className="field">
              <label htmlFor="raceSlug">Race</label>
              <RaceSelect races={visibleRaces} defaultValue={hero.raceSlug} />
            </div>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" defaultValue={hero.name} />
            </div>
            <div className="field">
              <label htmlFor="slug">
                Page URL <span className="admin-edit-form__hint">— public URL: /heroes/<em>{hero.slug}</em></span>
              </label>
              <input id="slug" name="slug" type="text" defaultValue={hero.slug} />
            </div>
            <div className="field">
              <label htmlFor="primaryAttribute">Primary attribute</label>
              <AttributeSelect defaultValue={hero.primaryAttribute} />
            </div>
            <div className="field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" defaultValue={hero.role}>
                <option value="Fighter">Fighter</option>
                <option value="Spellcaster">Spellcaster</option>
                <option value="Support">Support</option>
                <option value="Tank">Tank</option>
                <option value="Assassin">Assassin</option>
                <option value="Summoner">Summoner</option>
                <option value="Ranged">Ranged</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" defaultValue={hero.description} />
            </div>
            <div className="field">
              <label htmlFor="highlightsInput">Highlights</label>
              <textarea id="highlightsInput" name="highlightsInput" defaultValue={formatLineItemsInput(hero.highlights)} />
            </div>
          </div>

          <div className="admin-edit-form__sidebar">
            <div className="admin-edit-form__preview-card">
              <p className="section-label">Hero Image</p>
              {previewSrc ? (
                <Image
                  src={previewSrc}
                  alt={hero.name}
                  width={120}
                  height={120}
                  style={{ objectFit: "contain" }}
                  className="admin-edit-form__preview-img"
                  unoptimized
                />
              ) : (
                <div className="admin-edit-form__preview-empty">No image set</div>
              )}
              <div className="field">
                <label htmlFor="imageUpload">Replace image</label>
                <input id="imageUpload" name="imageUpload" type="file" accept="image/*" />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-edit-form__footer">
          <button className="button button--ghost" type="submit">Save Hero</button>
        </div>
      </form>
    </div>
  );
}
