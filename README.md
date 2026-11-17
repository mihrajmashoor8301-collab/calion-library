# CALION Library (`notes.endlessus.in`)

> Autonomous cybersecurity knowledge base, command cheat sheets, and downloadable technical reference manuals.

Part of the **CALION Cybersecurity Ecosystem**:
- **CALION Landing Hub:** `https://endlessus.in`
- **CALION Academy:** `https://learning.endlessus.in`
- **CALION Library:** `https://notes.endlessus.in` (This Repository)
- **CALION Tools:** `https://tools.endlessus.in`
- **Developer Portfolio:** `https://portfolio.endlessus.in`

---

## Architecture & Technology Stack

- **Framework:** [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
- **Deployment Target:** Cloudflare Pages (Static Edge Distribution)
- **Search Engine:** Built-in Pagefind pre-indexed inverted search (sub-5ms keystroke search, offline capable)
- **Database:** None (100% Jamstack static architecture)
- **Theme:** Custom cybersecurity dark aesthetic with JetBrains Mono typography and responsive layout

---

## Project Structure

```
calion-library/
├── astro.config.mjs         # Starlight sidebar, site metadata, and plugins
├── package.json             # Dependencies and build scripts
├── tsconfig.json            # TypeScript configuration
├── public/
│   ├── _headers             # Cloudflare Pages edge security headers & cache controls
│   └── downloads/
│       └── handbooks/       # 30 Curated PDF handbooks (Linux, Nmap, Metasploit, Searchsploit)
└── src/
    ├── styles/
    │   └── custom.css       # Brand design tokens & styling overrides
    └── content/
        └── docs/
            ├── index.mdx    # Landing hero & knowledge cards
            ├── overview/    # Architecture & ecosystem documentation
            ├── recon/       # OSINT, DNS & asset discovery
            ├── linux/       # Linux security, permissions & privilege escalation
            ├── windows/     # Windows architecture & Active Directory
            ├── web/         # OWASP Top 10 vulnerabilities & mitigations
            ├── network/     # Protocols, traffic inspection & port enumeration
            ├── tools/       # Nmap, Metasploit & tool cheatsheets
            └── pdf-center/  # Curated PDF reference manual catalog
```

---

## Local Development & Build

### Development Server
```bash
npm install
npm run dev
```

### Static Production Build
```bash
npm run build
```
Build output is generated into `dist/`.

### Preview Build Locally
```bash
npm run preview
```

---

## Security & Operational Boundaries

- **Zero Database Coupling:** Completely decoupled from CALION Academy and Quiz Platform databases.
- **Origin Isolation:** Runs on origin `https://notes.endlessus.in` with origin-scoped storage and strict Content-Security-Policy.
- **Copyright Compliance:** Exclusively redistributes curated open-educational manuals and commands. Commercial third-party publications are strictly excluded.
