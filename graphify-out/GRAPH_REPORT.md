# Graph Report - msk-shortener  (2026-08-17)

## Corpus Check
- 71 files · ~39,098 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 413 nodes · 638 edges · 34 communities (25 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db43bc26`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- links.ts
- TypeScript Configuration
- Header.tsx
- dependencies
- index.ts
- stats/[code]/page.tsx
- Database Migrations
- Development Dependencies
- Package Metadata
- globalStats.ts
- password/page.tsx
- config.ts
- MSK Shortener – Claude Projekt-Doku
- pull_request_template.md
- Installation Scripts
- Abuse Prevention
- Root Layout Configuration
- ESLint Configuration
- Backup Scripts
- Next.js Configuration
- Update Scripts
- Tailwind CSS Configuration
- CodeQL Security Workflow
- Dependency Review Workflow
- Linting Workflow
- Repository Mirroring Workflow
- Release Automation Workflow
- UI Screenshots
- links

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `getLinkByCode()` - 15 edges
3. `execute()` - 12 edges
4. `getGlobalStats()` - 12 edges
5. `MSK Shortener – Claude Projekt-Doku` - 12 edges
6. `hashIp()` - 11 edges
7. `StatsPage()` - 10 edges
8. `trackClick()` - 10 edges
9. `isLinkExpired()` - 10 edges
10. `ApiError` - 10 edges

## Surprising Connections (you probably didn't know these)
- `MSK Logo` --references--> `MSK Shortener README`  [INFERRED]
  public/logo.png → README.md
- `MSK Shortener UI Screenshot` --references--> `MSK Shortener README`  [INFERRED]
  public/msk_shortener.png → README.md
- `GET()` --calls--> `getLinkByCode()`  [EXTRACTED]
  app/api/links/[code]/qr/route.ts → src/lib/links.ts
- `RedirectPage()` --calls--> `getLinkByCode()`  [EXTRACTED]
  app/[code]/page.tsx → src/lib/links.ts
- `RedirectPage()` --calls--> `isLinkExpired()`  [EXTRACTED]
  app/[code]/page.tsx → src/lib/links.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **MSK Ecosystem Documentation** — readme, contributing, code_of_conduct, security, license [EXTRACTED 1.00]
- **CI/CD Pipeline** — github_workflows_deploy, github_workflows_codeql, github_workflows_eslint, github_workflows_dependency_review [EXTRACTED 1.00]

## Communities (34 total, 9 thin omitted)

### Community 0 - "links.ts"
Cohesion: 0.08
Nodes (46): POST(), POST(), dynamic, PageProps, RedirectPage(), revalidate, BOT_PATTERNS, isBot() (+38 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (32): ./app/*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+24 more)

### Community 2 - "Header.tsx"
Cohesion: 0.07
Nodes (12): dynamic, dynamic, CreateLinkForm(), DeleteForm(), DeleteFormProps, State, DeleteLinkButton(), Header() (+4 more)

### Community 3 - "dependencies"
Cohesion: 0.07
Nodes (27): bcryptjs, dotenv, mysql2, nanoid, next, next-intl, dependencies, bcryptjs (+19 more)

### Community 4 - "index.ts"
Cohesion: 0.13
Nodes (14): GET(), QR_OPTIONS, RouteContext, LinkResult(), LinkResultProps, PasswordForm(), Props, jsonError() (+6 more)

### Community 5 - "stats/[code]/page.tsx"
Cohesion: 0.16
Nodes (22): GET(), RouteContext, dynamic, formatDate(), PageProps, parseDays(), revalidate, StatsPage() (+14 more)

### Community 6 - "Database Migrations"
Cohesion: 0.15
Nodes (20): main(), ensureMigrationsTable(), getExecutedMigrations(), main(), MIGRATIONS_DIR, runMigration(), ClickContext, normalizeDeviceType() (+12 more)

### Community 7 - "Development Dependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, eslint, eslint-config-next, devDependencies, autoprefixer, eslint, eslint-config-next, postcss (+15 more)

### Community 8 - "Package Metadata"
Cohesion: 0.10
Nodes (20): description, engines, node, license, name, overrides, brace-expansion, eslint (+12 more)

### Community 9 - "globalStats.ts"
Cohesion: 0.16
Nodes (16): GET(), dynamic, GlobalStatsPage(), revalidate, AggregateBars(), AggregateBarsProps, aggregateBrowsersGlobal(), aggregateOsGlobal() (+8 more)

### Community 10 - "password/page.tsx"
Cohesion: 0.11
Nodes (15): DELETE(), GET(), RouteContext, dynamic, PageProps, PasswordPage(), revalidate, LanguageSwitcher() (+7 more)

### Community 11 - "config.ts"
Cohesion: 0.29
Nodes (9): POST(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALE_FLAGS, LOCALE_LABELS, LOCALES (+1 more)

### Community 12 - "MSK Shortener – Claude Projekt-Doku"
Cohesion: 0.13
Nodes (14): 💬 Arbeitsweise, `clicks`, 🗄️ Datenbank-Schema, 🌍 Deployment, 📦 Features, `links`, 🎨 MSK Design-System, MSK Shortener – Claude Projekt-Doku (+6 more)

### Community 13 - "pull_request_template.md"
Cohesion: 0.13
Nodes (15): Code of Conduct, Contributing Guidelines, Deployment Guide, Additional Notes, Checklist, Description, Related Issue, Screenshots (+7 more)

### Community 14 - "Installation Scripts"
Cohesion: 0.43
Nodes (7): DEBIAN_FRONTEND, log_err(), log_info(), log_ok(), log_step(), log_warn(), install.sh script

### Community 15 - "Abuse Prevention"
Cohesion: 0.29
Nodes (4): AbuseCheckResult, BLOCKED_DOMAINS, BLOCKED_TLDS, SHORTENER_DOMAINS

### Community 16 - "Root Layout Configuration"
Cohesion: 0.33
Nodes (4): inter, jetbrainsMono, metadata, viewport

### Community 17 - "ESLint Configuration"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 18 - "Backup Scripts"
Cohesion: 0.83
Nodes (3): log_err(), log_ok(), backup.sh script

### Community 19 - "Next.js Configuration"
Cohesion: 0.50
Nodes (3): csp, nextConfig, withNextIntl

## Knowledge Gaps
- **163 isolated node(s):** `PageProps`, `dynamic`, `revalidate`, `PageProps`, `dynamic` (+158 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Header()` connect `Header.tsx` to `globalStats.ts`, `stats/[code]/page.tsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `getLinkByCode()` connect `stats/[code]/page.tsx` to `links.ts`, `password/page.tsx`, `index.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `PageProps`, `dynamic`, `revalidate` to the rest of the system?**
  _163 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `links.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07532467532467532 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Header.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06951871657754011 - nodes in this community are weakly interconnected._