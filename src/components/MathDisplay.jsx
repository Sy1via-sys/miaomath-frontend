import { useMemo } from "react";
import katex from "katex";

// Render LaTeX string as inline math HTML
export function renderMath(latex) {
  if (!latex) return "";
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      trust: true,
      displayMode: false,
    });
  } catch {
    return latex;
  }
}

// Render LaTeX as display-mode (centered, larger) math
export function renderDisplayMath(latex) {
  if (!latex) return "";
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      trust: true,
      displayMode: true,
    });
  } catch {
    return latex;
  }
}

// Match balanced braces with up to 2 levels of nesting
function balancedBraces(maxDepth = 2) {
  if (maxDepth <= 0) return '[^{}]*';
  const inner = balancedBraces(maxDepth - 1);
  return `(?:[^{}]|\\{${inner}\\}|\\\\x00B\\d+\\\\x00)*`;
}

// Auto-wrap bare LaTeX commands in \(...\) for KaTeX rendering.
function autoWrapLatex(text) {
  const blocks = [];

  function protect(pattern, t) {
    return t.replace(pattern, (m) => {
      blocks.push(m);
      return `\x00B${blocks.length - 1}\x00`;
    });
  }

  function restore(t) {
    for (let i = blocks.length - 1; i >= 0; i--) {
      t = t.replace(`\x00B${i}\x00`, blocks[i]);
    }
    return t;
  }

  let t = text;

  // 0. Protect display math \[...\] and $$...$$ and existing \(...\)
  t = protect(/\\\[[\s\S]*?\\\]/g, t);
  t = protect(/\$\$[\s\S]*?\$\$/g, t);
  t = protect(/\\\([\s\S]*?\\\)/g, t);

  // 1. \frac{...}{...} with balanced braces (2 levels of nesting)
  const b1 = balancedBraces(2);
  t = t.replace(
    new RegExp(`\\\\frac\\{(${b1})\\}\\{(${b1})\\}`, 'g'),
    '\\($&\\)'
  );
  t = protect(/\\\([\s\S]*?\\\)/g, t);

  // 2. \sqrt[...]{...} and \sqrt{...}
  t = t.replace(
    /\\sqrt(?:\[[^\]]*\])?\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g,
    '\\($&\\)'
  );
  t = protect(/\\\([\s\S]*?\\\)/g, t);

  // 3. \left... and \right... pairs (protect the whole expression)
  t = t.replace(
    /\\left[{(\\[].[^)]*\\right[)}\\]][)}\\]/g,
    '\\($&\\)'
  );
  t = protect(/\\\([\s\S]*?\\\)/g, t);

  // 4. \begin{...}...\end{...} environments
  t = t.replace(
    /\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\}/g,
    '\\($&\\)'
  );
  t = protect(/\\\([\s\S]*?\\\)/g, t);

  // 5. ^{...} superscripts and _{...} subscripts (with one level of nesting)
  t = t.replace(/\^\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, '\\($&\\)');
  t = t.replace(/_\{(?:[^{}]|\{[^{}]*\})*\}/g, '\\($&\\)');
  t = protect(/\\\([\s\S]*?\\\)/g, t);

  // 6. Standalone LaTeX commands: \sin, \pi, \infty, \cdot, \cdots, etc.
  t = t.replace(/(\\[a-zA-Z]+)(?![\w\{])/g, '\\($1\\)');

  // Restore all protected blocks
  t = restore(t);

  // Merge adjacent math groups: \)\( → empty
  t = t.replace(/\\\)\(\\\(/g, '');

  return t;
}

// Render mixed text: wraps bare LaTeX commands in \(...\), then renders
export function renderLatexContent(text) {
  if (!text) return "";

  const wrapped = autoWrapLatex(text);

  const parts = wrapped.split(/(\\\(.*?\\\))/g);
  return parts
    .map((part) => {
      if (part.startsWith("\\(") && part.endsWith("\\)")) {
        const latex = part.slice(2, -2);
        return renderMath(latex);
      }
      return escapeHtml(part);
    })
    .join("");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Component: renders a single LaTeX expression inline
export default function MathDisplay({ latex, displayMode = false }) {
  const html = useMemo(
    () => (displayMode ? renderDisplayMath(latex) : renderMath(latex)),
    [latex, displayMode]
  );

  if (!latex) return null;

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      style={displayMode ? { display: "block", textAlign: "center", margin: "8px 0" } : {}}
    />
  );
}

// Component: renders mixed text with \(...\) LaTeX inline
export function LatexContent({ text }) {
  const html = useMemo(() => renderLatexContent(text), [text]);
  if (!text) return null;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
