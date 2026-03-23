import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, Code, List, ListOrdered,
  Quote, Minus, ImageIcon, Undo, Redo,
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Digite o enunciado...',
  minHeight = '120px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none px-3 py-2 text-sm',
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Sync external value changes (e.g. when editing an existing question)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  const insertImage = () => {
    const url = window.prompt('Cole o URL da imagem:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  const btn = (active: boolean) =>
    `p-1.5 rounded hover:bg-muted transition-colors ${active ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`;

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/50">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Negrito">
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Itálico">
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))} title="Sublinhado">
          <UnderlineIcon className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btn(editor.isActive('code'))} title="Código inline">
          <Code className="h-3.5 w-3.5" />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Lista">
          <List className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Lista numerada">
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))} title="Citação">
          <Quote className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive('codeBlock'))} title="Bloco de código">
          <span className="text-[10px] font-mono font-bold px-0.5">{'<>'}</span>
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)} title="Separador">
          <Minus className="h-3.5 w-3.5" />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        <button type="button" onClick={insertImage} className={btn(false)} title="Inserir imagem">
          <ImageIcon className="h-3.5 w-3.5" />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={`${btn(false)} disabled:opacity-30`} title="Desfazer">
          <Undo className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={`${btn(false)} disabled:opacity-30`} title="Refazer">
          <Redo className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
