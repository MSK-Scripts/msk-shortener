# Graph Report - msk-shortener  (2026-10-30)

## Corpus Check
- 106 files · ~51,476 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 635 nodes · 1098 edges · 42 communities (23 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c27a98a0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- links.ts
- compilerOptions
- index.tsx
- dependencies
- tokens.ts
- stats/[code]/page.tsx
- api-key.ts
- devDependencies
- Design System: MSK Shortener
- stats/page.tsx
- app/page.tsx
- HeaderBar.tsx
- Project Documentation and Schema
- Contributing Guidelines
- Installation Scripts
- abuseFilter.ts
- layout.tsx
- backup.sh
- next.config.ts
- MSK Shortener README
- Update Scripts
- Deployment Guide
- CodeQL Security Workflow
- Dependency Review Workflow
- ESLint Linting Workflow
- Repository Mirroring Workflow
- Release Management Workflow
- postcss.config.mjs
- UI Screenshots
- Database Schema Definitions
- turnstile.ts
- 📡 REST API
- Development
- msk-cron.sh
- features.md
- proxy.ts
- 005_api_keys.sql
- api-key.sh script

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `guardCreate()` - 16 edges
3. `execute()` - 15 edges
4. `getLinkByCode()` - 15 edges
5. `cn()` - 13 edges
6. `Design System: MSK Shortener` - 13 edges
7. `MSK Shortener README` - 13 edges
8. `getGlobalStats()` - 12 edges
9. `MSK Shortener – Claude Projekt-Doku` - 12 edges
10. `StatsPage()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `MSK Logo` --references--> `MSK Shortener README`  [INFERRED]
  public/logo.png → README.md
- `MSK Shortener UI Screenshot` --references--> `MSK Shortener README`  [INFERRED]
  public/msk_shortener.png → README.md
- `GET()` --calls--> `getGlobalStats()`  [EXTRACTED]
  app/api/stats/route.ts → src/lib/globalStats.ts
- `RedirectPage()` --calls--> `getLinkByCode()`  [EXTRACTED]
  app/[code]/page.tsx → src/lib/links.ts
- `RedirectPage()` --calls--> `isLinkExpired()`  [EXTRACTED]
  app/[code]/page.tsx → src/lib/links.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI/CD Pipeline** — github_workflows_deploy, github_workflows_codeql, github_workflows_eslint, github_workflows_dependency_review [EXTRACTED 1.00]
- **MSK Ecosystem Documentation** — readme, contributing, code_of_conduct, security, license [EXTRACTED 1.00]

## Communities (42 total, 15 thin omitted)

### Community 0 - "links.ts"
Cohesion: 0.06
Nodes (58): POST(), POST(), bearerKey(), queryOne(), checkFormStamp(), issueFormStamp(), MAX_FORM_AGE_MS, MIN_FILL_MS (+50 more)

### Community 1 - "compilerOptions"
Cohesion: 0.06
Nodes (33): ./app/*, dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+25 more)

### Community 2 - "index.tsx"
Cohesion: 0.06
Nodes (42): CreateLinkForm(), handleReset(), handleSubmit(), renewCaptcha(), GUARD_MESSAGES, RENEW_CAPTCHA, DeleteForm(), DeleteFormProps (+34 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (41): bcryptjs, class-variance-authority, clsx, dotenv, @fontsource-variable/archivo, @fontsource-variable/source-sans-3, mysql2, nanoid (+33 more)

### Community 4 - "tokens.ts"
Cohesion: 0.11
Nodes (25): NO_PAIR, Pair, PAIRS, Ref, resolve(), STATUS, tokens, utilities (+17 more)

### Community 5 - "stats/[code]/page.tsx"
Cohesion: 0.07
Nodes (42): GET(), QR_OPTIONS, RouteContext, DELETE(), GET(), RouteContext, GET(), RouteContext (+34 more)

### Community 6 - "api-key.ts"
Cohesion: 0.14
Nodes (29): create(), fail(), findKeys(), findOne(), formatDate(), list(), main(), printTable() (+21 more)

### Community 7 - "devDependencies"
Cohesion: 0.04
Nodes (46): eslint, eslint-config-next, description, devDependencies, eslint, eslint-config-next, postcss, tailwindcss (+38 more)

### Community 8 - "Design System: MSK Shortener"
Cohesion: 0.15
Nodes (13): Accessibility, Adding a colour, Adding an icon, Colour, Components, Design System: MSK Shortener, Exclusion list, Icons (+5 more)

### Community 9 - "stats/page.tsx"
Cohesion: 0.16
Nodes (16): dynamic, GlobalStatsPage(), revalidate, AggregateBars(), AggregateBarsProps, ShieldCheck, aggregateBrowsersGlobal(), aggregateOsGlobal() (+8 more)

### Community 10 - "app/page.tsx"
Cohesion: 0.07
Nodes (28): dynamic, PageProps, RedirectPage(), revalidate, dynamic, PageProps, revalidate, dynamic (+20 more)

### Community 11 - "HeaderBar.tsx"
Cohesion: 0.08
Nodes (36): POST(), GithubMark(), ArrowSquareOut, CaretDown, Globe, List, X, currentFor() (+28 more)

### Community 12 - "Project Documentation and Schema"
Cohesion: 0.13
Nodes (14): 💬 Arbeitsweise, `clicks`, 🗄️ Datenbank-Schema, 🌍 Deployment, 📦 Features, `links`, 🎨 MSK Design-System, MSK Shortener – Claude Projekt-Doku (+6 more)

### Community 13 - "Contributing Guidelines"
Cohesion: 0.18
Nodes (8): Code of Conduct, Contributing Guidelines, Additional Notes, Checklist, Description, Related Issue, Screenshots, Type of Change

### Community 14 - "Installation Scripts"
Cohesion: 0.43
Nodes (7): DEBIAN_FRONTEND, log_err(), log_info(), log_ok(), log_step(), log_warn(), install.sh script

### Community 15 - "abuseFilter.ts"
Cohesion: 0.29
Nodes (8): BAIT_WORDS, BLOCKED_HOSTS, CHEAP_TLDS, checkUrlForAbuse(), hostIn(), looksLikePhishingHost(), SHORTENER_DOMAINS, UrlVerdict

### Community 16 - "layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, viewport, ThemeProvider()

### Community 18 - "backup.sh"
Cohesion: 0.60
Nodes (3): log_err(), log_ok(), backup.sh script

### Community 20 - "MSK Shortener README"
Cohesion: 0.22
Nodes (8): Contributing, Contributing and license, License, What this means in plain English, GNU Affero General Public License v3.0, MSK Logo, MSK Shortener UI Screenshot, MSK Shortener README

### Community 22 - "Deployment Guide"
Cohesion: 0.20
Nodes (8): Deployment Guide, ⚙️ Configuration, Operations, 🖥️ Production server, Security and privacy, 🔒 Security & Privacy, Deploy Workflow, Security Policy

### Community 31 - "turnstile.ts"
Cohesion: 0.29
Nodes (6): expectedHostname(), isProduction(), SiteverifyResponse, TURNSTILE_ACTION, TurnstileVerdict, verifyTurnstile()

### Community 32 - "📡 REST API"
Cohesion: 0.33
Nodes (5): 🔑 API keys, Create a link, Other endpoints, 📡 REST API, REST API and API keys

### Community 34 - "Development"
Cohesion: 0.33
Nodes (6): Development, 📋 Installation, 🌍 Internationalization, Local development, Prerequisites, 🛠️ Tech Stack

## Knowledge Gaps
- **221 isolated node(s):** `PageProps`, `dynamic`, `revalidate`, `PageProps`, `dynamic` (+216 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 267 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `execute()` connect `api-key.ts` to `links.ts`, `stats/[code]/page.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `PageHead()` connect `app/page.tsx` to `stats/page.tsx`, `stats/[code]/page.tsx`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `PageProps`, `dynamic`, `revalidate` to the rest of the system?**
  _221 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `links.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.059154929577464786 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056866303690260134 - nodes in this community are weakly interconnected._