import { getServiceSupabase, storageUrl } from "@/lib/supabase/service";

/**
 * Shared image-upload helper for the admin panel. Thin `"use server"` action
 * wrappers (uploadCountryImage, uploadBlogImage, …) call this after their own
 * auth check.
 */

const OK_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};
const MAX_BYTES = 6 * 1024 * 1024;

export type UploadResult =
  | { ok: true; key: string; url: string }
  | { ok: false; error: string };

export async function uploadImageToMedia(
  folder: string,
  formData: FormData,
): Promise<UploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file received." };
  if (!OK_TYPES.includes(file.type))
    return { ok: false, error: "Use a PNG, JPG, WEBP, AVIF or SVG image." };
  if (file.size > MAX_BYTES)
    return { ok: false, error: "That image is larger than 6 MB." };

  const ext = EXT[file.type] ?? "png";
  const key = `${folder}/${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error } = await getServiceSupabase()
    .storage.from("media")
    .upload(key, file, { contentType: file.type, upsert: false });

  if (error) return { ok: false, error: error.message };
  return { ok: true, key, url: storageUrl("media", key) };
}
