"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirectWithToast } from "@/lib/admin/redirect-toast";
import { requireAdmin, requireSuperadmin } from "@/lib/admin/auth";
import { writeAudit } from "@/lib/admin/audit";
import { getServiceSupabase } from "@/lib/supabase/service";
import { uploadImageToMedia, type UploadResult } from "@/lib/admin/media";
import type { TablesInsert } from "@/lib/supabase/database.types";

export type PostActionState = { ok: boolean; error?: string; id?: string };

/** Drag-and-drop image upload for the blog (cover + in-body images). */
export async function uploadBlogImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  return uploadImageToMedia("blog", formData);
}

function parseForm(formData: FormData): TablesInsert<"blog_posts"> | { error: string } {
  const str = (k: string) => String(formData.get(k) ?? "").trim();

  const title = str("title");
  const slug = str("slug");
  const body_md = str("body_md");
  if (!title) return { error: "Title is required." };
  if (!/^[a-z0-9-]+$/.test(slug))
    return { error: "Slug must be lowercase letters, numbers and hyphens." };
  if (!body_md) return { error: "The post body can’t be empty." };

  const publishedAtRaw = str("published_at");
  let published_at: string | null = null;
  if (publishedAtRaw) {
    const d = new Date(publishedAtRaw);
    if (Number.isNaN(d.getTime())) return { error: "Publish date is invalid." };
    published_at = d.toISOString();
  }

  const is_published = formData.get("is_published") === "on";
  if (is_published && !published_at) published_at = new Date().toISOString();

  return {
    title,
    slug,
    excerpt: str("excerpt") || null,
    category: str("category") || null,
    author: str("author") || "Study Abroad Pro",
    cover_path: str("cover_path") || null,
    body_md,
    is_published,
    published_at,
  };
}

export async function createPost(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const actor = await requireAdmin();
  const parsed = parseForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const db = getServiceSupabase();
  const { data, error } = await db
    .from("blog_posts")
    .insert(parsed)
    .select("id, title")
    .single();

  if (error) {
    return {
      ok: false,
      error: error.code === "23505" ? "That slug is already taken." : error.message,
    };
  }

  await writeAudit(actor, {
    action: "post.create",
    entity: "post",
    entityId: data.id,
    summary: `Created post “${data.title}”`,
    after: parsed,
  });

  revalidateTag("blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  redirectWithToast(`/admin/blog/${data.id}`, `“${data.title}” created`);
}

export async function updatePost(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing post id." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const db = getServiceSupabase();
  const { data: before } = await db
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!before) return { ok: false, error: "Post not found." };

  const { data: after, error } = await db
    .from("blog_posts")
    .update(parsed)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      ok: false,
      error: error.code === "23505" ? "That slug is already taken." : error.message,
    };
  }

  await writeAudit(actor, {
    action: "post.update",
    entity: "post",
    entityId: id,
    summary: `Updated post “${after.title}”`,
    before,
    after,
  });

  revalidateTag("blog");
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  redirectWithToast("/admin/blog", `“${after.title}” saved`);
}

export async function setPostPublished(formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const next = formData.get("publish") === "1";
  if (!id) return;

  const db = getServiceSupabase();
  const { data: current } = await db
    .from("blog_posts")
    .select("title, published_at")
    .eq("id", id)
    .maybeSingle();

  const patch: { is_published: boolean; published_at?: string } = {
    is_published: next,
  };
  if (next && !current?.published_at) patch.published_at = new Date().toISOString();

  await db.from("blog_posts").update(patch).eq("id", id);

  await writeAudit(actor, {
    action: next ? "post.publish" : "post.unpublish",
    entity: "post",
    entityId: id,
    summary: `${next ? "Published" : "Unpublished"} “${current?.title ?? id}”`,
  });

  revalidateTag("blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  redirectWithToast(
    "/admin/blog",
    `“${current?.title ?? "Post"}” ${next ? "published" : "unpublished"}`,
  );
}

export async function deletePost(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const actor = await requireSuperadmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Missing post id." };

  const db = getServiceSupabase();
  const { data: before } = await db
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { error } = await db.from("blog_posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await writeAudit(actor, {
    action: "post.delete",
    entity: "post",
    entityId: id,
    summary: `Deleted post “${before?.title ?? id}”`,
    before,
  });

  revalidateTag("blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  redirectWithToast("/admin/blog", `“${before?.title ?? "Post"}” deleted`);
}
