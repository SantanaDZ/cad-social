import { readFileSync } from "fs"
import { join } from "path"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Inline markdown: bold, italic, code, links ───────────────────────────────
function inline(text: string): string {
  return (
    text
      // inline code (before bold/italic to avoid conflicts)
      .replace(/`([^`\n]+)`/g, "<code>$1</code>")
      // bold
      .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
      // italic (only after bold is processed)
      .replace(/(?<!\*)\*(?!\*)([^*\n]+)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
      // links
      .replace(
        /\[([^\]\n]+)\]\(([^)\n]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
  )
}

// ─── Block markdown parser ─────────────────────────────────────────────────────
function markdownToHtml(raw: string): string {
  const lines = raw.split("\n")
  const out: string[] = []
  let inFence = false
  let fenceLines: string[] = []
  let inList: "ul" | "ol" | null = null

  function closeList() {
    if (inList === "ul") { out.push("</ul>"); inList = null }
    else if (inList === "ol") { out.push("</ol>"); inList = null }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // ── code fence ──────────────────────────────────────────────────────────
    if (line.startsWith("```")) {
      if (!inFence) {
        closeList()
        inFence = true
        fenceLines = []
      } else {
        inFence = false
        const escaped = fenceLines
          .join("\n")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
        out.push(`<pre class="code-block"><code>${escaped}</code></pre>`)
      }
      continue
    }
    if (inFence) { fenceLines.push(line); continue }

    // ── blank line ──────────────────────────────────────────────────────────
    if (!line.trim()) { closeList(); continue }

    // ── horizontal rule ─────────────────────────────────────────────────────
    if (/^-{3,}$/.test(line.trim())) { closeList(); out.push("<hr>"); continue }

    // ── GitHub admonitions: > [!TIP], > [!NOTE], etc. ───────────────────────
    const adm = line.match(/^> \[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]/)
    if (adm) {
      closeList()
      const type = adm[1].toLowerCase()
      const titles: Record<string, string> = {
        note: "Nota", tip: "Dica", warning: "Atenção",
        caution: "Cuidado", important: "Importante",
      }
      const content: string[] = []
      let j = i + 1
      while (j < lines.length && lines[j].startsWith("> ")) {
        content.push(inline(lines[j].slice(2)))
        j++
      }
      i = j - 1
      out.push(
        `<div class="adm adm-${type}">` +
        `<strong class="adm-title">${titles[type] ?? adm[1]}</strong>` +
        `<span>${content.join(" ")}</span>` +
        `</div>`
      )
      continue
    }

    // ── regular blockquote ──────────────────────────────────────────────────
    if (line.startsWith("> ")) {
      closeList()
      out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`)
      continue
    }

    // ── headers ─────────────────────────────────────────────────────────────
    if (line.startsWith("### ")) { closeList(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue }
    if (line.startsWith("## "))  { closeList(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue }
    if (line.startsWith("# "))   { closeList(); out.push(`<h1>${inline(line.slice(2))}</h1>`); continue }

    // ── unordered list (* or -) ─────────────────────────────────────────────
    const ulm = line.match(/^[*\-]\s+(.+)/)
    if (ulm) {
      if (inList !== "ul") { closeList(); out.push('<ul>'); inList = "ul" }
      out.push(`<li>${inline(ulm[1])}</li>`)
      continue
    }

    // ── ordered list (1. 2. …) ──────────────────────────────────────────────
    const olm = line.match(/^\d+\.\s+(.+)/)
    if (olm) {
      if (inList !== "ol") { closeList(); out.push("<ol>"); inList = "ol" }
      out.push(`<li>${inline(olm[1])}</li>`)
      continue
    }

    // ── paragraph ────────────────────────────────────────────────────────────
    closeList()
    out.push(`<p>${inline(line)}</p>`)
  }

  closeList()
  return out.join("\n")
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ManualPage() {
  const readme = readFileSync(join(process.cwd(), "README.md"), "utf-8")
  const html = markdownToHtml(readme)

  return (
    <main className="min-h-dvh flex flex-col bg-background">
      {/* Gov.br-style header */}
      <header className="border-b border-border bg-card">
        {/* Top bar */}
        <div className="bg-primary px-4 py-1.5 md:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <span className="text-xs font-medium text-primary-foreground/90">
              República Federativa do Brasil
            </span>
            <img
              src="/icons8-brasil-16.png"
              alt="Brasil"
              className="h-4 w-4 opacity-90"
            />
          </div>
        </div>

        {/* Main header row */}
        <div className="px-4 py-4 md:px-8">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="block text-sm font-bold text-foreground">CadSocial</span>
                <span className="block text-xs text-muted-foreground">
                  Sistema de Cadastro de Programas Sociais
                </span>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="border-t border-border bg-muted/40 px-4 py-2 md:px-8">
          <div className="mx-auto flex max-w-4xl items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Manual do Sistema</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Page title */}
          <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
            <h1 className="text-lg font-bold text-primary">Documentação do Sistema</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Este manual descreve as funcionalidades, tecnologias e instruções de uso do CadSocial.
            </p>
          </div>

          {/* Markdown content */}
          <style>{`
            .md-body h1 {
              font-size: 1.75rem; font-weight: 800;
              color: hsl(var(--foreground));
              margin: 2.5rem 0 0.75rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid hsl(var(--border));
            }
            .md-body h2 {
              font-size: 1.3rem; font-weight: 700;
              color: hsl(var(--foreground));
              margin: 2rem 0 0.6rem;
              padding-bottom: 0.35rem;
              border-bottom: 1px solid hsl(var(--border));
            }
            .md-body h3 {
              font-size: 1rem; font-weight: 600;
              color: hsl(var(--foreground));
              margin: 1.4rem 0 0.4rem;
            }
            .md-body p {
              line-height: 1.75;
              color: hsl(var(--muted-foreground));
              margin: 0.5rem 0;
            }
            .md-body strong { font-weight: 600; color: hsl(var(--foreground)); }
            .md-body em { font-style: italic; }
            .md-body a {
              color: hsl(var(--primary));
              text-decoration: underline;
              text-underline-offset: 3px;
            }
            .md-body a:hover { opacity: 0.8; }
            .md-body ul {
              list-style-type: disc;
              padding-left: 1.5rem;
              margin: 0.6rem 0;
            }
            .md-body ol {
              list-style-type: decimal;
              padding-left: 1.5rem;
              margin: 0.6rem 0;
            }
            .md-body li {
              line-height: 1.75;
              color: hsl(var(--muted-foreground));
              margin: 0.2rem 0;
            }
            .md-body li strong { color: hsl(var(--foreground)); }
            .md-body code {
              background: hsl(var(--muted));
              color: hsl(var(--foreground));
              padding: 0.1rem 0.4rem;
              border-radius: 4px;
              font-size: 0.85em;
              font-family: ui-monospace, monospace;
            }
            .md-body .code-block {
              background: hsl(var(--card));
              border: 1px solid hsl(var(--border));
              border-left: 4px solid hsl(var(--primary));
              border-radius: 6px;
              padding: 1rem 1.25rem;
              margin: 1rem 0;
              overflow-x: auto;
            }
            .md-body .code-block code {
              background: none; padding: 0;
              font-size: 0.875rem; line-height: 1.6;
              white-space: pre;
            }
            .md-body hr {
              border: none;
              border-top: 1px solid hsl(var(--border));
              margin: 2rem 0;
            }
            .md-body blockquote {
              border-left: 3px solid hsl(var(--primary));
              padding-left: 1rem;
              margin: 0.75rem 0;
              color: hsl(var(--muted-foreground));
              font-style: italic;
            }
            /* Admonitions */
            .md-body .adm {
              display: flex; flex-direction: column; gap: 4px;
              padding: 0.85rem 1rem;
              border-radius: 8px;
              margin: 1rem 0;
              border: 1px solid;
              font-size: 0.9rem;
            }
            .md-body .adm-title {
              font-size: 0.7rem;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              font-weight: 700;
            }
            .md-body .adm span { line-height: 1.6; color: hsl(var(--foreground)); }
            .md-body .adm-tip {
              background: hsl(var(--primary) / 0.07);
              border-color: hsl(var(--primary) / 0.3);
            }
            .md-body .adm-tip .adm-title { color: hsl(var(--primary)); }
            .md-body .adm-note {
              background: hsl(210 60% 97%);
              border-color: hsl(210 60% 82%);
            }
            .md-body .adm-note .adm-title { color: hsl(210 70% 40%); }
            .md-body .adm-warning {
              background: hsl(38 100% 96%);
              border-color: hsl(38 80% 72%);
            }
            .md-body .adm-warning .adm-title { color: hsl(38 90% 30%); }
          `}</style>

          <div className="md-body" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>

      <footer className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
        CadSocial — Sistema de Cadastro de Programas Sociais
      </footer>
    </main>
  )
}
