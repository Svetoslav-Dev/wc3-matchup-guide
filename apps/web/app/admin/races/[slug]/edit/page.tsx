import Image from "next/image";
import { notFound } from "next/navigation";
import { hasDatabaseUrl } from "@warcraft3-guide-hub/db";
import { getSessionUser } from "../../../../../lib/auth";
import { ensureAdminRaceEditor, updateRaceAction } from "../../../actions";

const RACE_FALLBACK_ICONS: Record<string, string> = {
  human:      "/images/Races/Humans_Icon.png",
  orc:        "/images/Races/Orcs_Icon.png",
  "night-elf": "/images/Races/Night_Elves_Icon.png",
  undead:     "/images/Races/Undead_Icon.png",
  neutral:    "/images/Races/Neutral.png",
};

const isValidImageUrl = (value: string | null | undefined) =>
  typeof value === "string" && (value.startsWith("/images/") || value.startsWith("https://"));

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ status?: string; error?: string }>;
};

export default async function EditAdminRacePage({ params, searchParams }: Props) {
  if (!hasDatabaseUrl() || !process.env.JWT_SECRET) {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Race Editor</p><h1 className="page-title">Race editing requires backend configuration.</h1></div></div>;
  }

  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return <div className="page-shell page-stack"><div className="section-head"><p className="section-label">Admin Race Editor</p><h1 className="page-title">Admin access required.</h1></div></div>;
  }

  const { slug } = await params;
  const { error, status } = (await searchParams) ?? {};
  const race = await ensureAdminRaceEditor(slug);

  if (!race) {
    notFound();
  }

  return (
    <div className="page-shell page-stack">
      <div className="admin-page-head">
        <div>
          <p className="section-label">Admin Race Editor</p>
          <h1 className="page-title">Edit {race.name}</h1>
        </div>
        <div className="admin-page-head__actions">
          <a href="/admin/races" className="button button--ghost button--sm">← Back</a>
        </div>
      </div>

      {(status === "updated" || status === "created") && (
        <div className="status-banner status-banner--success">Race {status === "created" ? "created" : "updated"}.</div>
      )}
      {error && (
        <div className="status-banner status-banner--error">{decodeURIComponent(error)}</div>
      )}
      <form action={updateRaceAction} className="admin-edit-form">
        <input type="hidden" name="raceId" value={race.id} />
        <input type="hidden" name="currentSlug" value={race.slug} />
        <input type="hidden" name="imageUrl" value={race.imageUrl ?? ""} />

        <div className="admin-edit-form__body">
          <div className="admin-edit-form__fields">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" defaultValue={race.name} />
            </div>
            <div className="field">
              <label htmlFor="slug">
                Page URL <span className="admin-edit-form__hint">— public URL: /races/<em>{race.slug}</em></span>
              </label>
              <input id="slug" name="slug" type="text" defaultValue={race.slug} />
            </div>
            <div className="field">
              <label htmlFor="identity">Identity</label>
              <textarea id="identity" name="identity" defaultValue={race.identity} />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" defaultValue={race.description} />
            </div>
            <div className="field">
              <label htmlFor="ladderFocus">Ladder focus</label>
              <textarea id="ladderFocus" name="ladderFocus" defaultValue={race.ladderFocus} />
            </div>
          </div>

          <div className="admin-edit-form__sidebar">
            <div className="admin-edit-form__preview-card">
              <p className="section-label">Race Image</p>
              {(() => {
                const src = isValidImageUrl(race.imageUrl)
                  ? race.imageUrl
                  : RACE_FALLBACK_ICONS[race.slug] ?? null;
                return src ? (
                  <Image
                    src={src}
                    alt={race.name}
                    width={120}
                    height={120}
                    style={{ objectFit: "contain" }}
                    className="admin-edit-form__preview-img"
                  />
                ) : (
                  <div className="admin-edit-form__preview-empty">No image set</div>
                );
              })()}
              <div className="field">
                <label htmlFor="imageUpload">Replace image</label>
                <input id="imageUpload" name="imageUpload" type="file" accept="image/*" />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-edit-form__footer">
          <button className="button button--ghost" type="submit">Save Race</button>
        </div>
      </form>
    </div>
  );
}
