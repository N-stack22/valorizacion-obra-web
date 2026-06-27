import { useEffect, useRef } from "react";
import { Bold, Italic, List, ListOrdered, Pilcrow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const toolbar = [
  { icon: Bold, command: "bold", label: "Negrita" },
  { icon: Italic, command: "italic", label: "Cursiva" },
  { icon: List, command: "insertUnorderedList", label: "Lista" },
  { icon: ListOrdered, command: "insertOrderedList", label: "Lista numerada" },
  { icon: Pilcrow, command: "formatBlock", value: "p", label: "Párrafo" },
] as const;

function getToolbarValue(item: (typeof toolbar)[number]) {
  return "value" in item ? item.value : undefined;
}

const allowedTags = new Set([
  "a",
  "b",
  "br",
  "div",
  "em",
  "i",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "u",
  "ul",
]);
const allowedAttributes = new Set(["href", "rel", "target", "title"]);

function sanitizeRichHtml(html: string): string {
  const source = html.trim() || "<p></p>";

  if (typeof window === "undefined") return source;

  const doc = new DOMParser().parseFromString(source, "text/html");

  for (const element of Array.from(doc.body.querySelectorAll("*"))) {
    const tagName = element.tagName.toLowerCase();

    if (!allowedTags.has(tagName)) {
      element.replaceWith(doc.createTextNode(element.textContent ?? ""));
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      const attrName = attribute.name.toLowerCase();
      const attrValue = attribute.value.trim();
      const isUnsafeUrl = /^(javascript|data):/i.test(attrValue);

      if (!allowedAttributes.has(attrName) || attrName.startsWith("on") || isUnsafeUrl) {
        element.removeAttribute(attribute.name);
      }
    }

    if (tagName === "a") {
      element.setAttribute("rel", "noopener noreferrer");
      element.setAttribute("target", "_blank");
    }
  }

  return doc.body.innerHTML || "<p></p>";
}

function setEditorContent(element: HTMLDivElement, html: string) {
  const doc = new DOMParser().parseFromString(sanitizeRichHtml(html), "text/html");
  element.replaceChildren(
    ...Array.from(doc.body.childNodes).map((node) => document.importNode(node, true)),
  );
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const safeValue = sanitizeRichHtml(value || "<p></p>");
    if (editorRef.current && editorRef.current.innerHTML !== safeValue) {
      setEditorContent(editorRef.current, safeValue);
    }
  }, [value]);

  const applyCommand = (command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue);
    onChange(sanitizeRichHtml(editorRef.current?.innerHTML || ""));
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
        {toolbar.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onMouseDown={(event) => {
              event.preventDefault();
              applyCommand(item.command, getToolbarValue(item));
            }}
          >
            <item.icon className="h-4 w-4" />
            <span className="sr-only">{item.label}</span>
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="min-h-52 w-full px-4 py-3 text-sm leading-6 text-foreground outline-none [&_li]:ml-4 [&_p]:mb-3"
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(sanitizeRichHtml(event.currentTarget.innerHTML))}
      />
    </div>
  );
}
