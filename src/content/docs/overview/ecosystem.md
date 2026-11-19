---
title: CALION Ecosystem Architecture
description: How CALION Library fits into the broader CALION cybersecurity ecosystem.
---

CALION Library (`notes.endlessus.in`) is an autonomous, high-performance reference repository designed for rapid retrieval of commands, security methodology, and technical handbooks.

## Ecosystem Boundaries

The CALION ecosystem comprises independent, specialized applications sharing a cohesive design language while remaining strictly decoupled at the data and authentication layer:

| Application | Domain | Responsibility | Architecture |
| :--- | :--- | :--- | :--- |
| **CALION Landing Hub** | `endlessus.in` | Organizational portal & navigation hub | Static HTML5 / CDN |
| **CALION Academy** | `learning.endlessus.in` | Interactive curriculum with 47 rooms across four independent learning paths, accounts, progress, and XP | Vanilla JS + Dedicated Supabase DB |
| **CALION Library** | `notes.endlessus.in` | Searchable knowledge base, command cheatsheets, and PDF reference center | Astro + Starlight (Static Edge) |
| **CALION Tools** | `tools.endlessus.in` | Sandboxed client-side utilities, encoders, CIDR calculator, hash analyzer | Zero-Telemetry Client JS |
| **Developer Portfolio** | `portfolio.endlessus.in`| Independent professional bio, credentials & research | Static Portfolio Engine |

## Zero-Coupling Architecture

- **No Shared Database:** CALION Library operates completely database-free. It does not query or connect to CALION Academy's database.
- **No Shared Session:** There are no wildcard cross-domain cookies on `.endlessus.in`. Access is origin-confined to `https://notes.endlessus.in`.
- **Edge Deployment:** Compiled to static HTML, CSS, and pre-indexed search data for deployment on Cloudflare Pages.
