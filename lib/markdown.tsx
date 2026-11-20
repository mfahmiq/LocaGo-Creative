import type { ReactNode } from 'react';

/**
 * Renderer Markdown minimal & aman untuk isi artikel (Supabase `articles.content`).
 *
 * Dipilih ketimbang menambah dependensi (react-markdown/marked) karena:
 * - Artikel hanya memakai subset kecil Markdown (heading, bold, italic,
 *   list, quote, code inline/blok, link, URL telanjang) — diverifikasi dari
 *   isi art-120/124/125/126 — jadi parser kecil sudah cukup.
 * - Tanpa dependensi baru: tanpa instalasi, tanpa perubahan package.json /
 *   package-lock.json, tanpa risiko supply-chain.
 * - Aman dari XSS by construction: tidak memakai dangerouslySetInnerHTML;
 *   semua teks dirender sebagai React text node (otomatis di-escape),
 *   dan href link hanya diizinkan untuk skema http/https/mailto.
 *
 * Mendukung: heading #/##/###, paragraf, list tak-bernomor (-/*) & bernomor,
 * blockquote (>), code fence (```), garis horizontal (---), bold (**),
 * italic (*), code inline (`), link Markdown [teks](url), dan autolink
 * URL telanjang (https://... jadi <a> yang bisa diklik).
 *
 * Heading konten diturunkan satu tingkat (# -> h2 visual dst.) karena
 * modal pembaca sudah menampilkan judul artikel sebagai heading utama.
 * Bila blok pertama adalah H1 yang teksnya sama persis dengan judul
 * artikel (pola semua artikel lama), blok itu dilewati supaya judul
 * tidak tampil dua kali.
 */

const INLINE_RE =
  /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\[[^\]]+\]\((?:https?:\/\/[^)\s]+|mailto:[^)\s]+)\)|https?:\/\/[^\s<>"')\]]+)/g;

function safeHref(url: string): string | null {
  if (/^(https?:\/\/|mailto:)/i.test(url)) return url;
  return null;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-i${k++}`;
    if (tok.startsWith('**') && tok.endsWith('**')) {
      out.push(
        <strong key={key} className="font-bold text-neutral-900 dark:text-white">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) {
      out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    } else if (tok.startsWith('`') && tok.endsWith('`')) {
      out.push(
        <code
          key={key}
          className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 font-mono text-[13px] text-rose-600 dark:text-rose-400 break-words"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith('[')) {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = lm ? safeHref(lm[2]) : null;
      if (lm && href) {
        out.push(
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 font-medium underline decoration-emerald-300 dark:decoration-emerald-700 underline-offset-2 break-words hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            {lm[1]}
          </a>,
        );
      } else {
        out.push(tok);
      }
    } else if (/^https?:\/\//.test(tok)) {
      // Autolink URL telanjang; buang tanda baca akhir dari href-nya.
      const trail = tok.match(/[.,;:!?]+$/)?.[0] ?? '';
      const url = trail ? tok.slice(0, -trail.length) : tok;
      const href = safeHref(url);
      if (href) {
        out.push(
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 font-medium underline decoration-emerald-300 dark:decoration-emerald-700 underline-offset-2 break-words hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            {url}
          </a>,
        );
        if (trail) out.push(trail);
      } else {
        out.push(tok);
      }
    } else {
      out.push(tok);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function renderMarkdown(content: string, opts?: { title?: string }): ReactNode[] {
  const src = (content || '').replace(/\r\n?/g, '\n');
  const lines = src.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  let firstBlock = true;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '') {
      i++;
      continue;
    }

    // Code fence ```lang ... ```
    const fence = line.match(/^```\s*(\S*)\s*$/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(lines[i]);
        i++;
      }
      i++; // lewati penutup ```
      blocks.push(
        <pre
          key={`b${k++}`}
          className="mb-4 overflow-x-auto rounded-xl bg-neutral-900 p-4 font-mono text-[13px] leading-relaxed text-neutral-100"
        >
          <code>{buf.join('\n')}</code>
        </pre>,
      );
      firstBlock = false;
      continue;
    }

    // Heading # / ## / ###
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      i++;
      // Lewati H1 pertama bila sama persis dengan judul artikel (judul
      // sudah tampil di header modal) — cegah judul ganda.
      if (firstBlock && level === 1 && opts?.title && text.toLowerCase() === opts.title.trim().toLowerCase()) {
        firstBlock = false;
        continue;
      }
      firstBlock = false;
      if (level === 1) {
        blocks.push(
          <h2
            key={`b${k++}`}
            className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white mt-6 mb-3 leading-snug"
          >
            {renderInline(text, `h${k}`)}
          </h2>,
        );
      } else if (level === 2) {
        blocks.push(
          <h3
            key={`b${k++}`}
            className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mt-6 mb-2 leading-snug"
          >
            {renderInline(text, `h${k}`)}
          </h3>,
        );
      } else {
        blocks.push(
          <h4
            key={`b${k++}`}
            className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-5 mb-2 leading-snug"
          >
            {renderInline(text, `h${k}`)}
          </h4>,
        );
      }
      continue;
    }

    // Garis horizontal
    if (/^(---|\*\*\*|___)\s*$/.test(trimmed)) {
      blocks.push(<hr key={`b${k++}`} className="my-6 border-neutral-200 dark:border-neutral-800" />);
      i++;
      firstBlock = false;
      continue;
    }

    // Blockquote: gabung baris `>` berurutan jadi satu kutipan.
    if (trimmed.startsWith('>')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        buf.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote
          key={`b${k++}`}
          className="mb-4 rounded-r-xl border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-neutral-700 dark:text-neutral-300"
        >
          {renderInline(buf.join(' '), `q${k}`)}
        </blockquote>,
      );
      firstBlock = false;
      continue;
    }

    // List tak-bernomor
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul
          key={`b${k++}`}
          className="mb-4 space-y-1.5 pl-5 list-disc marker:text-emerald-600 dark:marker:text-emerald-400"
        >
          {items.map((it, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(it, `ul${k}-${idx}`)}
            </li>
          ))}
        </ul>,
      );
      firstBlock = false;
      continue;
    }

    // List bernomor
    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+[.)]\s+/, ''));
        i++;
      }
      blocks.push(
        <ol
          key={`b${k++}`}
          className="mb-4 space-y-1.5 pl-5 list-decimal marker:text-emerald-600 dark:marker:text-emerald-400 marker:font-bold"
        >
          {items.map((it, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(it, `ol${k}-${idx}`)}
            </li>
          ))}
        </ol>,
      );
      firstBlock = false;
      continue;
    }

    // Paragraf: gabung baris berurutan sampai baris kosong / blok baru.
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !lines[i].startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+[.)]\s+/.test(lines[i]) &&
      !/^(---|\*\*\*|___)\s*$/.test(lines[i].trim())
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`b${k++}`} className="mb-4 leading-relaxed">
        {renderInline(buf.join(' '), `p${k}`)}
      </p>,
    );
    firstBlock = false;
  }

  return blocks;
}
