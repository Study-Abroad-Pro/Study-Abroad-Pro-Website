"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/admin/Toast";
import ImageDropField from "@/components/admin/ImageDropField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  createPost,
  updatePost,
  deletePost,
  uploadBlogImage,
  type PostActionState,
} from "./actions";

const initial: PostActionState = { ok: false };

export type PostFormData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  coverKey: string;
  coverUrl: string;
  body_md: string;
  is_published: boolean;
  published_at: string;
};

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-[#ff320d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d92306] disabled:opacity-60"
    >
      {pending ? "Saving…" : mode === "create" ? "Create post" : "Save changes"}
    </button>
  );
}

export default function PostForm({
  mode,
  data,
  canDelete,
}: {
  mode: "create" | "edit";
  data: PostFormData;
  canDelete?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useActionState(
    mode === "create" ? createPost : updatePost,
    initial,
  );
  const [delState, delAction] = useActionState(deletePost, initial);
  const [confirming, setConfirming] = useState(false);

  // Success paths redirect from the server action; only errors land back here.
  useEffect(() => {
    if (state.error) toast(state.error, "error");
  }, [state, toast]);

  useEffect(() => {
    if (delState.error) toast(delState.error, "error");
  }, [delState, toast]);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-5">
        {mode === "edit" && <input type="hidden" name="id" value={data.id} />}

        <div className="grid gap-4 rounded-xl border border-[#e6e8ec] bg-white p-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium text-[#3a3532]">
              Title <span className="text-[#b42318]">*</span>
            </span>
            <input
              name="title"
              defaultValue={data.title}
              required
              className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[#3a3532]">
              Slug <span className="text-[#b42318]">*</span>
            </span>
            <input
              name="slug"
              defaultValue={data.slug}
              required
              className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
            />
            <span className="text-xs text-[#8b93a1]">/blog/your-slug</span>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[#3a3532]">Category</span>
            <input
              name="category"
              defaultValue={data.category}
              placeholder="Guide"
              className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[#3a3532]">Author</span>
            <input
              name="author"
              defaultValue={data.author}
              className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[#3a3532]">Publish date</span>
            <input
              type="date"
              name="published_at"
              defaultValue={data.published_at}
              className="rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium text-[#3a3532]">Excerpt</span>
            <textarea
              name="excerpt"
              defaultValue={data.excerpt}
              rows={2}
              className="resize-y rounded-lg border border-[#d7dbe0] px-3 py-2 text-sm outline-none focus:border-[#171717]"
            />
          </label>

          <div className="sm:col-span-2">
            <ImageDropField
              label="Cover image"
              name="cover_path"
              defaultKey={data.coverKey}
              defaultUrl={data.coverUrl}
              uploadAction={uploadBlogImage}
              recommend="1600 × 900 px (16:9)"
              aspect="wide"
              hint="Shown at the top of the article and on the blog index. Landscape photos work best; it’s cropped to 16:9."
            />
          </div>

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={data.is_published}
              className="h-4 w-4 rounded border-[#d7dbe0]"
            />
            <span className="font-medium text-[#3a3532]">Published</span>
          </label>
        </div>

        <div className="flex flex-col gap-2.5 rounded-xl border border-[#e6e8ec] bg-white p-5">
          <span className="text-sm font-medium text-[#3a3532]">
            Body <span className="text-[#b42318]">*</span>
          </span>
          <RichTextEditor
            name="body_md"
            defaultMarkdown={data.body_md}
            uploadImage={uploadBlogImage}
          />
          <span className="text-xs text-[#8b93a1]">
            Format text with the toolbar — bold, italic, headings, bullet and
            numbered lists, quotes, links and images. Saved as Markdown.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SubmitButton mode={mode} />
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="text-sm font-medium text-[#5b6270] hover:text-[#16181d]"
          >
            Back to list
          </button>
        </div>
      </form>

      {mode === "edit" && canDelete && (
        <div className="rounded-xl border border-[#f0d9d5] bg-[#fdf6f5] p-5">
          <h2 className="text-sm font-semibold text-[#b42318]">Danger zone</h2>
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-2 text-xs font-medium text-[#b42318] hover:underline"
            >
              Delete this post
            </button>
          ) : (
            <form action={delAction} className="mt-3 flex flex-col gap-2">
              <input type="hidden" name="id" value={data.id} />
              {delState.error && (
                <p className="rounded-lg bg-[#fdecec] px-3 py-2 text-xs text-[#b42318]">
                  {delState.error}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#b42318] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#951d13]"
                >
                  Delete permanently
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-lg border border-[#d7dbe0] px-3 py-1.5 text-xs font-medium text-[#16181d]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
