"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "tiptap-markdown";
import { useToast } from "./Toast";

/** tiptap-markdown attaches this to `editor.storage` but doesn't augment the type. */
function getMarkdown(editor: Editor): string {
  const storage = editor.storage as unknown as {
    markdown?: { getMarkdown: () => string };
  };
  return storage.markdown?.getMarkdown() ?? "";
}

/**
 * WYSIWYG editor that reads and writes Markdown. The value is mirrored into a
 * hidden `<input name={name}>` so the surrounding `<form>` submits it exactly
 * like the old textarea did — the public site still renders `body_md` with
 * react-markdown, unchanged.
 */
export default function RichTextEditor({
  name,
  defaultMarkdown,
  uploadImage,
}: {
  name: string;
  defaultMarkdown: string;
  uploadImage: (
    formData: FormData,
  ) => Promise<{ ok: boolean; url?: string; error?: string }>;
}) {
  const { toast } = useToast();
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // Match the public renderer's link behaviour.
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      Image.configure({ HTMLAttributes: { class: "rte-image" } }),
      Placeholder.configure({
        placeholder: "Write the post… use the toolbar to format.",
      }),
      Markdown.configure({ html: false, transformPastedText: true, linkify: true }),
    ],
    content: defaultMarkdown,
    editorProps: {
      attributes: {
        class: "rte-content",
        "aria-label": "Post body",
      },
    },
    onUpdate: ({ editor }) => {
      setMarkdown(getMarkdown(editor));
    },
  });

  // Keep the mirror in sync if the editor initialises after first paint.
  useEffect(() => {
    if (editor) setMarkdown(getMarkdown(editor));
  }, [editor]);

  async function onPickImage(file: File | undefined) {
    if (!file || !editor) return;
    if (file.size > 6 * 1024 * 1024) {
      toast("That image is over 6 MB.", "error");
      return;
    }
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadImage(fd);
    if (!res.ok || !res.url) {
      toast(res.error ?? "Upload failed.", "error");
      return;
    }
    const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    editor.chain().focus().setImage({ src: res.url, alt }).run();
    toast("Image added.", "success");
  }

  return (
    <div className="rte">
      <input type="hidden" name={name} value={markdown} />
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => onPickImage(e.target.files?.[0])}
      />

      <Toolbar editor={editor} onImage={() => fileRef.current?.click()} />

      <EditorContent editor={editor} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Btn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`grid h-8 min-w-8 place-items-center rounded-md px-1.5 text-sm transition-colors disabled:opacity-30 ${
        active
          ? "bg-[#171717] text-white"
          : "text-[#3a3532] hover:bg-[#eef0f3]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px self-center bg-[#e6e8ec]" />;
}

function Toolbar({
  editor,
  onImage,
}: {
  editor: Editor | null;
  onImage: () => void;
}) {
  // Re-render the toolbar on selection / doc changes so active states update.
  const [, force] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const bump = () => force((n) => n + 1);
    editor.on("selectionUpdate", bump);
    editor.on("transaction", bump);
    return () => {
      editor.off("selectionUpdate", bump);
      editor.off("transaction", bump);
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex h-11 items-center rounded-t-lg border border-b-0 border-[#d7dbe0] bg-[#fbfcfd] px-2 text-xs text-[#8b93a1]">
        Loading editor…
      </div>
    );
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-b-0 border-[#d7dbe0] bg-[#fbfcfd] p-1.5">
      <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <span className="font-bold">B</span>
      </Btn>
      <Btn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <span className="italic font-serif">I</span>
      </Btn>
      <Btn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <span className="line-through">S</span>
      </Btn>

      <Divider />

      <Btn title="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </Btn>
      <Btn title="Subheading" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </Btn>

      <Divider />

      <Btn title="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M8 6h13M8 12h13M8 18h13" />
          <circle cx="3.5" cy="6" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="3.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="3.5" cy="18" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      </Btn>
      <Btn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 6h11M10 12h11M10 18h11M4 4v4M3 8h2M3 16h1.5a1 1 0 0 1 .5 1.9L3 20h2.5" />
        </svg>
      </Btn>
      <Btn title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 17h3l2-4V7H5v6h3zM16 17h3l2-4V7h-6v6h3z" />
        </svg>
      </Btn>

      <Divider />

      <Btn title="Add link" active={editor.isActive("link")} onClick={setLink}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
        </svg>
      </Btn>
      <Btn title="Insert image" onClick={onImage}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m4 15 4-4 5 5M14 12l2-2 4 4" />
          <circle cx="9" cy="9" r="1.4" />
        </svg>
      </Btn>
      <Btn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        —
      </Btn>

      <Divider />

      <Btn title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h11a5 5 0 0 1 0 10h-1" />
        </svg>
      </Btn>
      <Btn title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 14 5-5-5-5" />
          <path d="M20 9H9a5 5 0 0 0 0 10h1" />
        </svg>
      </Btn>
    </div>
  );
}
