"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, requireSuperadmin } from "@/lib/admin/auth";
import { writeAudit } from "@/lib/admin/audit";
import { getServiceSupabase } from "@/lib/supabase/service";
import { redirectWithToast } from "@/lib/admin/redirect-toast";
import type { TablesInsert } from "@/lib/supabase/database.types";

export type CourseActionState = { ok: boolean; error?: string; id?: string };

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

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseForm(fd: FormData): TablesInsert<"courses"> | { error: string } {
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  const num = (k: string): number | null => {
    const raw = s(k);
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : NaN;
  };

  const name = s("name");
  const slug = s("slug");
  const category = s("category");
  if (!name) return { error: "Course name is required." };
  if (!/^[a-z0-9-]+$/.test(slug))
    return { error: "URL slug must be lowercase letters, numbers and hyphens." };
  if (!category) return { error: "A category is required." };

  const sortRaw = num("sort_order");
  if (sortRaw !== null && Number.isNaN(sortRaw))
    return { error: "Sort order must be a whole number." };

  const content = {
    about: parseList(fd, "about"),
    whatYouStudy: parseList(fd, "what_you_study"),
    whoFor: parseList(fd, "who_for"),
    careers: parseList(fd, "careers"),
    careersNote: s("careers_note"),
    admissionsNote: s("admissions_note"),
    feesNote: s("fees_note"),
    whyNote: s("why_note"),
  };

  return {
    name,
    slug,
    category,
    summary: s("summary") || null,
    sort_order: sortRaw ?? 0,
    is_published: fd.get("is_published") === "on",
    headline: s("headline") || null,
    lede: s("lede") || null,
    intro: s("intro") || null,
    levels: parseList(fd, "levels"),
    meta_title: s("meta_title") || null,
    meta_description: s("meta_description") || null,
    content: content as never,
  };
}

/* ------------------------------------------------------------------ */
/* CRUD                                                                */
/* ------------------------------------------------------------------ */

function slugError(e: { code?: string; message: string }) {
  return e.code === "23505" ? "That URL slug is already used by another course." : e.message;
}

function revalidateCourses(id?: string) {
  revalidatePath("/admin/courses");
  if (id) revalidatePath(`/admin/courses/${id}`);
  revalidatePath("/admin");
  revalidateTag("courses");
}

export async function createCourse(
  _prev: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const actor = await requireAdmin();
  const parsed = parseForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const { data, error } = await getServiceSupabase()
    .from("courses")
    .insert(parsed)
    .select("id, name")
    .single();
  if (error) return { ok: false, error: slugError(error) };

  await writeAudit(actor, {
    action: "course.create",
    entity: "course",
    entityId: data.id,
    summary: `Created course "${data.name}"`,
    after: parsed,
  });

  revalidateCourses();
  redirectWithToast("/admin/courses", `"${data.name}" created`);
}

export async function updateCourse(
  _prev: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing course id." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const db = getServiceSupabase();
  const { data: before } = await db
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!before) return { ok: false, error: "Course not found." };

  const { data: after, error } = await db
    .from("courses")
    .update(parsed)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return { ok: false, error: slugError(error) };

  await writeAudit(actor, {
    action: "course.update",
    entity: "course",
    entityId: id,
    summary: `Updated course "${after.name}"`,
    before,
    after,
  });

  revalidateCourses(id);
  redirectWithToast("/admin/courses", `"${after.name}" saved`);
}

export async function duplicateCourse(formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = getServiceSupabase();
  const { data: src } = await db
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!src) return;

  // Find a free slug: "<slug>-copy", then "-copy-2", ...
  const base = `${src.slug}-copy`;
  const { data: clashes } = await db
    .from("courses")
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
    .from("courses")
    .insert({
      ...(rest as TablesInsert<"courses">),
      slug,
      name: `${src.name} (copy)`,
      is_published: false,
      sort_order: 99,
    })
    .select("id, name")
    .single();
  if (error || !copy) return;

  await writeAudit(actor, {
    action: "course.duplicate",
    entity: "course",
    entityId: copy.id,
    summary: `Duplicated "${src.name}" → "${copy.name}"`,
  });

  revalidateCourses();
  redirectWithToast(
    `/admin/courses/${copy.id}`,
    `Duplicated as "${copy.name}" (draft)`,
  );
}

export async function setCoursePublished(formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const next = formData.get("publish") === "1";
  if (!id) return;

  const { data: after } = await getServiceSupabase()
    .from("courses")
    .update({ is_published: next })
    .eq("id", id)
    .select("name")
    .single();

  await writeAudit(actor, {
    action: next ? "course.publish" : "course.unpublish",
    entity: "course",
    entityId: id,
    summary: `${next ? "Published" : "Unpublished"} "${after?.name ?? id}"`,
  });

  revalidateCourses(id);
  redirectWithToast(
    "/admin/courses",
    `"${after?.name ?? "Course"}" ${next ? "published" : "unpublished"}`,
  );
}

export async function deleteCourse(
  _prev: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const actor = await requireSuperadmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing course id." };

  const db = getServiceSupabase();
  const { data: before } = await db
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { error } = await db.from("courses").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await writeAudit(actor, {
    action: "course.delete",
    entity: "course",
    entityId: id,
    summary: `Deleted course "${before?.name ?? id}"`,
    before,
  });

  revalidateCourses();
  redirectWithToast("/admin/courses", `"${before?.name ?? "Course"}" deleted`);
}
