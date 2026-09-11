# Mandatory Project Protocols: Context7, Ponytail, and OpenDesign

Every task, code generation, refactoring, and UI review in this workspace MUST strictly and continuously adhere to these three core foundations:

## 1. Context7 (MCP Server)
- Whenever querying, verifying, or implementing libraries, frameworks, APIs, CLI tools, or CSS utility classes (e.g., Tailwind CSS, React, Lucide, Vite), **always use the Context7 MCP server tools** (`resolve-library-id` and `query-docs`) to check modern, accurate documentation before writing code.
- Never guess or use deprecated APIs. Context7 is the single source of truth for library usage.

## 2. Ponytail (Minimalist & Senior Dev Pragmatism)
- **The Ladder of Restraint**:
  1. Does this need to exist at all? If speculative → skip it (YAGNI).
  2. Already in this codebase? Reuse existing components, types, and utilities; never rewrite.
  3. Native platform / standard library feature covers it? Use native HTML/CSS/JS before third-party libraries.
  4. Installed dependency solves it? Use existing dependencies. Never install new packages for trivial tasks.
  5. Shortest working diff wins: Delete dead code, avoid unnecessary wrappers, abstractions, and boilerplate.
- **Root Cause over Symptom**: Fix issues at the source, not by adding repetitive band-aids across callers.

## 3. OpenDesign (Anti-AI-Slop & Editorial Minimalism)
- **Zero AI Slop**:
  - NO random glowing gradients (e.g., neon violet/cyan blurs or purple gradients).
  - NO heavy default shadows (`shadow-xl`, `shadow-2xl`). Favor crisp 1px borders (`border-neutral-200` / `border-neutral-800`) or subtle diffused elevation.
  - NO emoji soup in UI text, badges, or headers. Use sharp, unified vector icons.
  - NO AI buzzword copy ("Elevate", "Seamless", "Next-Gen", "Revolutionize"). Use concrete, authentic, and clear language.
  - NO unnecessary pill-shaped blobs on containers.
- **Aesthetic Direction**:
  - High-contrast typography with deliberate hierarchy, tight heading tracking, and generous line-height for body text.
  - Warm monochrome palette with sparse, intentional spot accents.
  - Bento grid structure with disciplined whitespace (`py-20+`, generous gutters).
  - Quiet, buttery micro-interactions instead of exaggerated bounce effects.
