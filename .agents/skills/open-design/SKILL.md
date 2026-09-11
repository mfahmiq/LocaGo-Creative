---
name: open-design
description: >
  Enforces OpenDesign standards: editorial minimalism, anti-AI slop, high-craft typography,
  restrained color palettes, and clean layouts. Rejects generic SaaS templates, bloated gradients,
  heavy shadows, and AI clichés. Use whenever designing, evaluating, or refactoring web interfaces.
triggers:
  - "open-design"
  - "open design"
  - "anti-ai-slop"
  - "minimalist design"
  - "editorial ui"
license: Apache-2.0
---

# OpenDesign Protocol: Anti-AI-Slop & Editorial Minimalism

## 1. Core Philosophy
OpenDesign treats UI not as arbitrary decoration, but as an editorial product. Every element must earn its place. The interface must look deliberate, human-crafted, and refined.

## 2. Absolute Anti-AI-Slop Constraints
- **NO Generic Gradients & Neon Glows**: Eliminate random violet-cyan / purple-blue radial blurs, glowing text, and neon border rings that scream "AI template".
- **NO Heavy Shadows**: Remove `shadow-lg`, `shadow-xl`, `shadow-2xl`. Use 1px crisp borders (`border border-neutral-200 dark:border-neutral-800`) or ultra-diffuse shadows (`shadow-[0_2px_8px_rgba(0,0,0,0.04)]`).
- **NO Emoji Soup**: Replace emojis used as icons with clean, unified SVGs or Lucide/Phosphor/Radix icon primitives with consistent stroke width.
- **NO Buzzword Clichés**: Strip words like "Elevate", "Seamless", "Unleash", "Next-Gen", "Game-changer", "Revolutionize", "Delve". Use concrete, honest, and direct Indonesian/English copy.
- **NO Pill-Shape Bloat Everywhere**: Avoid wrapping every heading, button, and container in `rounded-full`. Use crisp geometry (`rounded-md`, `rounded-lg`).

## 3. Typographic Hierarchy
- Clear contrast between display headings and body copy.
- Tight tracking for headings (`tracking-tight` / `-0.02em` to `-0.04em`).
- Generous line-height for body reading (`leading-relaxed` / `1.6`).
- Body text should use charcoal/off-black (`#111111`, `#18181b`, `#27272a`) rather than harsh pure `#000000`.

## 4. Spacing & Bento Layouts
- Generous macro whitespace (`py-20`, `py-28`, `py-32`).
- Structured grid hierarchy (bento-grid or editorial multi-column).
- Internal card padding of `p-6` to `p-10` with clean `1px solid` border dividers.

## 5. Micro-Interactions
- Subtle hover transitions (`transition-all duration-200`).
- Micro-scale on active states (`active:scale-[0.98]`).
- Clean, purposeful transitions instead of chaotic bouncy animations.
