import React from 'react';

/** Renders **bold** markers as <strong> inside a text fragment. */
function parseBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

/**
 * Renders a codeExplanation string.
 *
 * - If the text contains multiple bold-led sentences (". **"), splits them
 *   into a clean bulleted list so each item is easy to scan.
 * - Otherwise renders inline with bold parsing.
 */
export function ExplanationText({ text }: { text: string }) {
  // Split on ". **" — a sentence boundary followed by a new bold item
  const items = text.split(/\.\s+(?=\*\*)/);

  if (items.length > 1) {
    return (
      <ul className="mt-1 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 items-start">
            <span className="text-primary font-bold leading-snug select-none">›</span>
            <span className="leading-snug">{parseBold(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Single block or no bold markers — render inline
  return <span>{parseBold(text)}</span>;
}
