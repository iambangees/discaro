"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";

/*
  Tiptap rich-text editor for article bodies. Produces HTML using only
  the marks enabled here (paragraphs, headings, bold/italic, lists,
  quotes, links, images) — the same set the public article CSS styles.
*/
export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          "article-body min-h-64 px-4 py-3 focus:outline-none",
        "aria-label": "Article body",
      },
    },
  });

  if (!editor) return null;

  const btn =
    "rounded-lg p-2 text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-deep";
  const active = "bg-accent-soft text-accent-deep";

  function addLink() {
    const url = window.prompt("Link URL (https://…)");
    if (url) editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }
  function addImage() {
    const url = window.prompt("Image URL (https://…) — or use the upload button for the cover image");
    if (url) editor!.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-paper px-2 py-1.5" role="toolbar" aria-label="Formatting">
        <button type="button" aria-label="Bold" className={`${btn} ${editor.isActive("bold") ? active : ""}`} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label="Italic" className={`${btn} ${editor.isActive("italic") ? active : ""}`} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label="Heading 2" className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label="Heading 3" className={`${btn} ${editor.isActive("heading", { level: 3 }) ? active : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label="Bullet list" className={`${btn} ${editor.isActive("bulletList") ? active : ""}`} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label="Numbered list" className={`${btn} ${editor.isActive("orderedList") ? active : ""}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label="Quote" className={`${btn} ${editor.isActive("blockquote") ? active : ""}`} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label="Add link" className={btn} onClick={addLink}>
          <Link2 className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label="Add image by URL" className={btn} onClick={addImage}>
          <ImagePlus className="h-4 w-4" aria-hidden />
        </button>
        <span className="mx-1 h-5 w-px bg-line" aria-hidden />
        <button type="button" aria-label="Undo" className={btn} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label="Redo" className={btn} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
