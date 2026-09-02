"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, requireSuperadmin } from "@/lib/admin/auth";
import { writeAudit } from "@/lib/admin/audit";
import { getServiceSupabase } from "@/lib/supabase/service";
import { uploadImageToMedia, type UploadResult } from "@/lib/admin/media";
import { redirectWithToast } from "@/lib/admin/redirect-toast";
import { TOGGLEABLE_SECTIONS } from "@/lib/countries-sections";
import type { TablesInsert } from "@/lib/supabase/database.types";

export type CountryActionState = { ok: boolean; error?: string; id?: string };

/* ------------------------------------------------------------------ */
/* image upload (called directly from ImageDropField)                  */
/* ------------------------------------------------------------------ */

export async function uploadCountryImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  return uploadImageToMedia("flags", formData);
}

/* ------------------------------------------------------------------ */
/* form parsing                                                        */
/* ------------------------------------------------------------------ */

function parseList(fd: FormData, prefix: string): string[] {
  const re = new RegExp(`^${escapeRe(prefix)}\\[(\\d+)\\]$`);
  const byIndex: [number, string][] = [];
  for (const [k, v] of fd.entries()) {
    const m = k.match(re);
    if (m) byIndex.push([Number(m[1]), String(v).trim()]);
  }
  return byIndex.sort((a, b) => a[0] - b[0]).map(([, v]) => v).filter(Boolean);
}

function parseObjList<K extends string>(
  fd: FormData,
  prefix: string,
  fields: K[],
): Record<K, string>[] {
  const re = new RegExp(`^${escapeRe(prefix)}\\[(\\d+)\\]\\[(\\w+)\\]$`);
  const byIndex = new Map<number, Record<string, string>>();
  for (const [k, v] of fd.entries()) {
    const m = k.match(re);
    if (!m) continue;
    const idx = Number(m[1]);
    if (!byIndex.has(idx)) byIndex.set(idx, {});
    byIndex.get(idx)![m[2]] = String(v).trim();
  }
  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, row]) => {
      const out = {} as Record<K, string>;
      for (const f of fields) out[f] = row[f] ?? "";
      return out;
    })
    .filter((row) => fields.some((f) => row[f]));
}

function parseCourses(fd: FormData): { group: string; items: string[] }[] {
  const groupRe = /^courses\[(\d+)\]\[group\]$/;
  const itemRe = /^courses\[(\d+)\]\[items\]\[(\d+)\]$/;
  const groups = new Map<number, string>();
  const items = new Map<number, [number, string][]>();
  for (const [k, v] of fd.entries()) {
    let m = k.match(groupRe);
    if (m) {
      groups.set(Number(m[1]), String(v).trim());
      continue;
    }
    m = k.match(itemRe);
    if (m) {
      const gi = Number(m[1]);
      if (!items.has(gi)) items.set(gi, []);
      items.get(gi)!.push([Number(m[2]), String(v).trim()]);
    }
  }
  const indices = new Set([...groups.keys(), ...items.keys()]);
  return [...indices]
    .sort((a, b) => a - b)
    .map((gi) => ({
      group: groups.get(gi) ?? "",
      items: (items.get(gi) ?? [])
        .sort((a, b) => a[0] - b[0])
        .map(([, v]) => v)
        .filter(Boolean),
    }))
    .filter((g) => g.group || g.items.length);
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseForm(fd: FormData): TablesInsert<"countries"> | { error: string } {
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  const num = (k: string): number | null => {
    const raw = s(k);
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : NaN;
  };

  const name = s("name");
  const slug = s("slug");
  const code = s("code").toLowerCase();
  if (!name) return { error: "Country name is required." };
  if (!/^[a-z0-9-]+$/.test(slug))
    return { error: "URL slug must be lowercase letters, numbers and hyphens." };
  if (!code) return { error: "A short country code is required." };

  const lat = num("lat");
  const lon = num("lon");
  if (lat === null || Number.isNaN(lat) || lat < -90 || lat > 90)
    return { error: "Latitude must be a number between -90 and 90." };
  if (lon === null || Number.isNaN(lon) || lon < -180 || lon > 180)
    return { error: "Longitude must be a number between -180 and 180." };

  const sortRaw = num("sort_order");
  if (sortRaw !== null && Number.isNaN(sortRaw))
    return { error: "Sort order must be a whole number." };

  const intakes = parseList(fd, "intakes");
  const languages = parseList(fd, "languages");
  const levelsSummary = s("levels_summary");

  const stats: { value: string; label: string }[] = [];
  if (intakes.length) stats.push({ value: intakes.join(" · "), label: "Common intakes" });
  if (languages.length)
    stats.push({ value: languages.join(" · "), label: "Languages of instruction" });
  if (levelsSummary)
    stats.push({ value: levelsSummary, label: "Study levels available" });

  const sections: Record<string, boolean> = {};
  for (const key of TOGGLEABLE_SECTIONS) {
    sections[key] = fd.get(`sections[${key}]`) === "on";
  }

  const content = {
    intakes,
    languages,
    sections,
    whyBullets: parseList(fd, "why_bullets"),
    highlights: parseObjList(fd, "highlights", ["title", "body"]),
    why: parseObjList(fd, "why", ["title", "body"]),
    levels: parseObjList(fd, "levels", ["level", "note"]),
    courses: parseCourses(fd),
    admissions: parseList(fd, "admissions"),
    englishNote: s("english_note"),
    budget: parseObjList(fd, "budget", ["label", "detail"]),
    budgetNote: s("budget_note"),
    scholarships: parseList(fd, "scholarships"),
    life: parseList(fd, "life"),
    faqs: parseObjList(fd, "faqs", ["q", "a"]),
  };

  return {
    name,
    slug,
    code,
    short: s("short") || null,
    sort_order: sortRaw ?? 0,
    is_published: fd.get("is_published") === "on",
    flag_path: s("flag_path") || null,
    headline: s("headline") || null,
    lede: s("lede") || null,
    blurb: s("blurb") || null,
    intro: s("intro") || null,
    study_areas: s("study_areas") || null,
    levels_summary: levelsSummary || null,
    meta_title: s("meta_title") || null,
    meta_description: s("meta_description") || null,
    lat,
    lon,
    programmes: parseList(fd, "programmes"),
    stats: stats as never,
    content: content as never,
  };
}

/* ------------------------------------------------------------------ */
/* CRUD                                                                */
/* ------------------------------------------------------------------ */

function slugError(e: { code?: string; message: string }) {
  return e.code === "23505" ? "That URL slug is already used by another country." : e.message;
}

function revalidateCountries(id?: string) {
  revalidatePath("/admin/countries");
  if (id) revalidatePath(`/admin/countries/${id}`);
  revalidatePath("/admin");
  revalidateTag("countries");
}

export async function createCountry(
  _prev: CountryActionState,
  formData: FormData,
): Promise<CountryActionState> {
  const actor = await requireAdmin();
  const parsed = parseForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const { data, error } = await getServiceSupabase()
    .from("countries")
    .insert(parsed)
    .select("id, name")
    .single();
  if (error) return { ok: false, error: slugError(error) };

  await writeAudit(actor, {
    action: "country.create",
    entity: "country",
    entityId: data.id,
    summary: `Created country “${data.name}”`,
    after: parsed,
  });

  revalidateCountries();
  redirectWithToast("/admin/countries", `“${data.name}” created`);
}

export async function updateCountry(
  _prev: CountryActionState,
  formData: FormData,
): Promise<CountryActionState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing country id." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const db = getServiceSupabase();
  const { data: before } = await db
    .from("countries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!before) return { ok: false, error: "Country not found." };

  const { data: after, error } = await db
    .from("countries")
    .update(parsed)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { ok: false, error: slugError(error) };

  await writeAudit(actor, {
    action: "country.update",
    entity: "country",
    entityId: id,
    summary: `Updated country “${after.name}”`,
    before,
    after,
  });

  revalidateCountries(id);
  redirectWithToast("/admin/countries", `“${after.name}” saved`);
}

export async function duplicateCountry(formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = getServiceSupabase();
  const { data: src } = await db
    .from("countries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!src) return;

  // Find a free slug: "<slug>-copy", then "-copy-2", ...
  const base = `${src.slug}-copy`;
  const { data: clashes } = await db
    .from("countries")
    .select("slug")
    .like("slug", `${base}%`);
  const taken = new Set((clashes ?? []).map((c) => c.slug));
  let slug = base;
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;

  const {
    id: _drop,
    created_at: _c,
    updated_at: _u,
    ...rest
  } = src as Record<string, unknown> & { id: string };

  const { data: copy, error } = await db
    .from("countries")
    .insert({
      ...(rest as TablesInsert<"countries">),
      slug,
      name: `${src.name} (copy)`,
      is_published: false,
      sort_order: 99,
    })
    .select("id, name")
    .single();
  if (error || !copy) return;

  await writeAudit(actor, {
    action: "country.duplicate",
    entity: "country",
    entityId: copy.id,
    summary: `Duplicated “${src.name}” → “${copy.name}”`,
  });

  revalidateCountries();
  redirectWithToast(
    `/admin/countries/${copy.id}`,
    `Duplicated as “${copy.name}” (draft)`,
  );
}

export async function setCountryPublished(formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const next = formData.get("publish") === "1";
  if (!id) return;

  const { data: after } = await getServiceSupabase()
    .from("countries")
    .update({ is_published: next })
    .eq("id", id)
    .select("name")
    .single();

  await writeAudit(actor, {
    action: next ? "country.publish" : "country.unpublish",
    entity: "country",
    entityId: id,
    summary: `${next ? "Published" : "Unpublished"} “${after?.name ?? id}”`,
  });

  revalidateCountries(id);
  redirectWithToast(
    "/admin/countries",
    `“${after?.name ?? "Country"}” ${next ? "published" : "unpublished"}`,
  );
}

export async function deleteCountry(
  _prev: CountryActionState,
  formData: FormData,
): Promise<CountryActionState> {
  const actor = await requireSuperadmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing country id." };

  const db = getServiceSupabase();
  const { data: before } = await db
    .from("countries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { error } = await db.from("countries").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await writeAudit(actor, {
    action: "country.delete",
    entity: "country",
    entityId: id,
    summary: `Deleted country “${before?.name ?? id}”`,
    before,
  });

  revalidateCountries();
  redirectWithToast("/admin/countries", `“${before?.name ?? "Country"}” deleted`);
}
