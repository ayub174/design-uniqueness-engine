import React, { useRef, useCallback } from "react";
import { Bold, Italic, List, ListOrdered, Code, ImageIcon, Link2, Heading2, Quote as QuoteIcon, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxLength?: number;
  className?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

const ToolbarButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
  >
    <Icon className="w-4 h-4" />
  </button>
);

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Skriv något...",
  minHeight = "120px",
  maxLength = 5000,
  className,
  textareaRef: externalRef,
}: RichTextEditorProps) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const ref = externalRef || internalRef;

  const wrapSelection = useCallback(
    (before: string, after: string) => {
      const textarea = ref.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      const newText =
        value.substring(0, start) + before + selected + after + value.substring(end);
      onChange(newText);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      });
    },
    [value, onChange, ref]
  );

  const insertAtCursor = useCallback(
    (text: string) => {
      const textarea = ref.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const newText = value.substring(0, start) + text + value.substring(start);
      onChange(newText);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      });
    },
    [value, onChange, ref]
  );

  const prependLine = useCallback(
    (prefix: string) => {
      const textarea = ref.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const lines = value.substring(start, end).split("\n");
      const prefixed = lines.map((line) => prefix + line).join("\n");
      const newText = value.substring(0, start) + prefixed + value.substring(end);
      onChange(newText);
      requestAnimationFrame(() => {
        textarea.focus();
      });
    },
    [value, onChange, ref]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "b") {
          e.preventDefault();
          wrapSelection("**", "**");
        } else if (e.key === "i") {
          e.preventDefault();
          wrapSelection("*", "*");
        }
      }
    },
    [wrapSelection]
  );

  const tools = [
    { icon: Bold, label: "Fetstil (Ctrl+B)", action: () => wrapSelection("**", "**") },
    { icon: Italic, label: "Kursiv (Ctrl+I)", action: () => wrapSelection("*", "*") },
    { icon: Heading2, label: "Rubrik", action: () => prependLine("## ") },
    { icon: List, label: "Punktlista", action: () => prependLine("- ") },
    { icon: ListOrdered, label: "Numrerad lista", action: () => prependLine("1. ") },
    { icon: QuoteIcon, label: "Citat", action: () => prependLine("> ") },
    { icon: Code, label: "Kodblock", action: () => wrapSelection("\n```\n", "\n```\n") },
    { icon: Minus, label: "Avskiljare", action: () => insertAtCursor("\n---\n") },
    { icon: Link2, label: "Länk", action: () => wrapSelection("[", "](url)") },
    { icon: ImageIcon, label: "Bild", action: () => insertAtCursor("![beskrivning](url)") },
  ];

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden bg-background", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30 flex-wrap">
        {tools.map((tool, i) => (
          <React.Fragment key={tool.label}>
            {(i === 2 || i === 5 || i === 7) && (
              <div className="w-px h-4 bg-border mx-0.5" />
            )}
            <ToolbarButton icon={tool.icon} label={tool.label} onClick={tool.action} />
          </React.Fragment>
        ))}
      </div>

      {/* Textarea */}
      <Textarea
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        className="border-0 rounded-none resize-none text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{ minHeight }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/20">
        <span className="text-xs text-muted-foreground/50">
          Markdown stöds · Ctrl+B fetstil · Ctrl+I kursiv
        </span>
        {maxLength && (
          <span className="text-xs text-muted-foreground/50 tabular-nums">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
