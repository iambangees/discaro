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
  Tiptap rich-text editor for article bodies. Touch-first toolbar: big
  44px+ targets with labels, a sticky bar, and a strong active state so
  it is always obvious what is on. Produces HTML using only the marks
  enabled here — the same set the public article CSS styles.
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
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class: "article-body min-h-72 px-4 py-4 text-[17px] leading-relaxed focus:outline-none",
        "aria-label": "Article body",
      },
    },
  });

  if (!editor) {
    return (
      <div className="rounded-xl border border-line bg-surface px-4 py-6 text-sm text-muted">
        Loading the editor…
      </div>
    );
  }

  function ToolButton({
    label,
    onClick,
    isActive = false,
    children,
  }: {
    label: string;
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={isActive}
        onClick={onClick}
        className={`flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors ${
          isActive
            ? "bg-accent text-white"
            : "text-ink-soft hover:bg-accent-soft hover:text-accent-deep active:bg-accent-soft"
        }`}
      >
        {children}
        <span className="text-[10px] font-semibold leading-none">{label}</span>
      </button>
    );
  }

  function addLink() {
    if (!editor) return;
    const url = window.prompt("Paste the link address (https://…)");
    if (!url) return;
    const { empty } = editor.state.selection;
    if (empty) {
      // Nothing selected: insert the address itself as a tappable link.
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}">${url}</a> `)
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  function addImage() {
    if (!editor) return;
    const url = window.prompt("Paste the image address (https://…)");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  const icon = "h-5 w-5";

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div
        className="sticky top-0 z-10 flex flex-wrap items-stretch gap-1 border-b border-line bg-paper px-2 py-2"
        role="toolbar"
        aria-label="Formatting"
      >
        <ToolButton label="Bold" isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="Italic" isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="Big title" isActive={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="Small title" isActive={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="List" isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="Numbered" isActive={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="Quote" isActive={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="Add link" onClick={addLink}>
          <Link2 className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="Add picture" onClick={addImage}>
          <ImagePlus className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className={icon} aria-hidden />
        </ToolButton>
        <ToolButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className={icon} aria-hidden />
        </ToolButton>
      </div>
      <EditorContent editor={editor} />
      <p className="border-t border-line bg-paper px-4 py-2 text-xs leading-relaxed text-muted">
        Tap in the white area and type your article here. To make words into a link: select the
        words first, then tap <strong>Add link</strong>. With nothing selected, Add link inserts
        the address as its own link.
      </p>
    </div>
  );
}
