"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { htmlToPortableTextBlocks, portableTextBlocksToHtml } from "@/lib/portableText/tiptapHtmlBridge";
import { cn } from "@/lib/utils";

export type ArticleRichEditorHandle = {
  getPortableBody: () => unknown;
  getEditor: () => Editor | null;
};

const editorWrapClass = cn(
  "min-h-[22rem] rounded-xl border border-neutral-300 bg-white px-3 py-3 text-neutral-900 shadow-inner shadow-neutral-900/5",
  "dark:border-white/12 dark:bg-black/50 dark:text-white dark:shadow-black/40",
  "prose prose-neutral max-w-none dark:prose-invert",
  "prose-headings:font-display prose-headings:font-semibold prose-p:leading-relaxed",
  "focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-400/20",
);

const toolbarBtnClass = cn(
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-transparent text-neutral-700 transition",
  "hover:bg-neutral-200/90 dark:text-white/85 dark:hover:bg-white/10",
  "disabled:pointer-events-none disabled:opacity-40",
);

const toolbarBtnActiveClass = "border-amber-500/40 bg-amber-500/10 dark:border-amber-400/35 dark:bg-amber-400/10";

type ArticleRichEditorProps = {
  initialBody: unknown;
  className?: string;
};

export const ArticleRichEditor = forwardRef<ArticleRichEditorHandle, ArticleRichEditorProps>(
  function ArticleRichEditor({ initialBody, className }, ref) {
    const initialHtml = portableTextBlocksToHtml(initialBody);
    const initialRef = useRef(initialHtml);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3, 4] },
          bulletList: { HTMLAttributes: { class: "list-disc pl-6 my-3" } },
          orderedList: { HTMLAttributes: { class: "list-decimal pl-6 my-3" } },
        }),
        Underline,
        Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: "text-amber-700 underline dark:text-amber-400/90" } }),
        Placeholder.configure({ placeholder: "Write the story — headings, lists, links, quotes…" }),
      ],
      content: initialRef.current,
      editorProps: {
        attributes: {
          class: cn(
            "outline-none min-h-[20rem] [&_p]:my-3 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-amber-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic",
          ),
        },
      },
    });

    useEffect(() => {
      if (!editor) return;
      const next = portableTextBlocksToHtml(initialBody);
      const cur = editor.getHTML();
      if (next !== cur && next !== "<p></p>") {
        editor.commands.setContent(next);
      }
    }, [editor, initialBody]);

    useImperativeHandle(
      ref,
      () => ({
        getPortableBody: () => htmlToPortableTextBlocks(editor?.getHTML() ?? ""),
        getEditor: () => editor,
      }),
      [editor],
    );

    if (!editor) {
      return (
        <div className={cn(editorWrapClass, "animate-pulse text-sm text-neutral-500 dark:text-white/45", className)}>
          Loading editor…
        </div>
      );
    }

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div
          className="flex flex-wrap items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-100/80 p-2 dark:border-white/10 dark:bg-neutral-900/80"
          role="toolbar"
          aria-label="Formatting"
        >
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("bold") && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("italic") && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("underline") && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            aria-label="Underline"
          >
            <UnderlineIcon className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("strike") && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            aria-label="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("code") && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleCode().run()}
            aria-label="Inline code"
          >
            <Code className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <span className="mx-1 hidden h-6 w-px bg-neutral-300 dark:bg-white/15 sm:inline-block" aria-hidden />
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("heading", { level: 2 }) && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading 2"
          >
            <Heading2 className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("heading", { level: 3 }) && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            aria-label="Heading 3"
          >
            <Heading3 className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("bulletList") && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Bullet list"
          >
            <List className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("orderedList") && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="Numbered list"
          >
            <ListOrdered className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={cn(toolbarBtnClass, editor.isActive("blockquote") && toolbarBtnActiveClass)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            aria-label="Quote"
          >
            <Quote className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={toolbarBtnClass}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const prev = editor.getAttributes("link").href as string | undefined;
              const url = typeof window !== "undefined" ? window.prompt("Link URL", prev ?? "https://") : null;
              if (url === null) return;
              if (url === "") {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                return;
              }
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }}
            aria-label="Link"
          >
            <Link2 className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <span className="mx-1 hidden h-6 w-px bg-neutral-300 dark:bg-white/15 sm:inline-block" aria-hidden />
          <button
            type="button"
            className={toolbarBtnClass}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={toolbarBtnClass}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>

        <div className={cn(editorWrapClass)}>
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  },
);
