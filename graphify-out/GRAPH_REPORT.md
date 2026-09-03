# Graph Report - msk-shortener  (2026-09-03)

## Corpus Check
- 73 files · ~40,851 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 412 nodes · 616 edges · 37 communities (25 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2366bad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- links.ts
- TypeScript Configuration
- Header.tsx
- Project Dependencies
- index.ts
- stats/[code]/page.tsx
- db.ts
- Development Dependencies
- Package Metadata
- Global Usage Statistics
- getLinkByCode
- Internationalization and Localization
- Project Documentation and Schema
- Contribution and Deployment Documentation
- Installation Scripts
- Abuse and Domain Filtering
- Root Layout and Fonts
- ESLint Configuration
- backup.sh
- next.config.ts
- Update Scripts
- Tailwind CSS Configuration
- CodeQL Security Workflow
- Dependency Review Workflow
- ESLint Linting Workflow
- Repository Mirroring Workflow
- Release Management Workflow
- UI Screenshots
- Database Schema Definitions
- middleware.ts
- msk-cron.sh

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `getLinkByCode()` - 15 edges
3. `getGlobalStats()` - 12 edges
4. `MSK Shortener – Claude Projekt-Doku` - 12 edges
5. `StatsPage()` - 10 edges
6. `createLink()` - 10 edges
7. `isLinkExpired()` - 10 edges
8. `ApiError` - 10 edges
9. `trackClick()` - 9 edges
10. `getPool()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `MSK Logo` --references--> `MSK Shortener README`  [INFERRED]
  public/logo.png → README.md
- `MSK Shortener UI Screenshot` --references--> `MSK Shortener README`  [INFERRED]
  public/msk_shortener.png → README.md
- `GET()` --calls--> `getLinkByCode()`  [EXTRACTED]
  app/api/links/[code]/qr/route.ts → src/lib/links.ts
- `GET()` --calls--> `getLinkByCode()`  [EXTRACTED]
  app/api/links/[code]/stats/route.ts → src/lib/links.ts
- `POST()` --calls--> `isLocale()`  [EXTRACTED]
  app/api/locale/route.ts → src/i18n/config.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI/CD Pipeline** — github_workflows_deploy, github_workflows_codeql, github_workflows_eslint, github_workflows_dependency_review [EXTRACTED 1.00]
- **MSK Ecosystem Documentation** — readme, contributing, code_of_conduct, security, license [EXTRACTED 1.00]

## Communities (37 total, 12 thin omitted)

### Community 0 - "links.ts"
Cohesion: 0.09
Nodes (35): POST(), POST(), queryOne(), createLink(), CreateLinkOptions, CreateLinkResult, LinkServiceError, verifyLinkPassword() (+27 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (32): ./app/*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+24 more)

### Community 2 - "Header.tsx"
Cohesion: 0.06
Nodes (15): dynamic, dynamic, CreateLinkForm(), DeleteForm(), DeleteFormProps, State, DeleteLinkButton(), Header() (+7 more)

### Community 3 - "Project Dependencies"
Cohesion: 0.07
Nodes (27): bcryptjs, dotenv, mysql2, nanoid, next, next-intl, dependencies, bcryptjs (+19 more)

### Community 4 - "index.ts"
Cohesion: 0.12
Nodes (16): GET(), QR_OPTIONS, RouteContext, LinkResult(), LinkResultProps, PasswordForm(), Props, jsonError() (+8 more)

### Community 5 - "stats/[code]/page.tsx"
Cohesion: 0.16
Nodes (21): GET(), RouteContext, dynamic, formatDate(), PageProps, parseDays(), revalidate, StatsPage() (+13 more)

### Community 6 - "db.ts"
Cohesion: 0.24
Nodes (14): main(), ensureMigrationsTable(), getExecutedMigrations(), main(), MIGRATIONS_DIR, runMigration(), closePool(), execute() (+6 more)

### Community 7 - "Development Dependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, eslint, eslint-config-next, devDependencies, autoprefixer, eslint, eslint-config-next, postcss (+15 more)

### Community 8 - "Package Metadata"
Cohesion: 0.10
Nodes (20): description, engines, node, license, name, overrides, brace-expansion, eslint (+12 more)

### Community 9 - "Global Usage Statistics"
Cohesion: 0.16
Nodes (16): GET(), dynamic, GlobalStatsPage(), revalidate, AggregateBars(), AggregateBarsProps, aggregateBrowsersGlobal(), aggregateOsGlobal() (+8 more)

### Community 10 - "getLinkByCode"
Cohesion: 0.12
Nodes (22): DELETE(), GET(), RouteContext, dynamic, PageProps, RedirectPage(), revalidate, dynamic (+14 more)

### Community 11 - "Internationalization and Localization"
Cohesion: 0.29
Nodes (9): POST(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALE_FLAGS, LOCALE_LABELS, LOCALES (+1 more)

### Community 12 - "Project Documentation and Schema"
Cohesion: 0.13
Nodes (14): 💬 Arbeitsweise, `clicks`, 🗄️ Datenbank-Schema, 🌍 Deployment, 📦 Features, `links`, 🎨 MSK Design-System, MSK Shortener – Claude Projekt-Doku (+6 more)

### Community 13 - "Contribution and Deployment Documentation"
Cohesion: 0.13
Nodes (15): Code of Conduct, Contributing Guidelines, Deployment Guide, Additional Notes, Checklist, Description, Related Issue, Screenshots (+7 more)

### Community 14 - "Installation Scripts"
Cohesion: 0.43
Nodes (7): DEBIAN_FRONTEND, log_err(), log_info(), log_ok(), log_step(), log_warn(), install.sh script

### Community 15 - "Abuse and Domain Filtering"
Cohesion: 0.29
Nodes (4): AbuseCheckResult, BLOCKED_DOMAINS, BLOCKED_TLDS, SHORTENER_DOMAINS

### Community 16 - "Root Layout and Fonts"
Cohesion: 0.33
Nodes (4): inter, jetbrainsMono, metadata, viewport

### Community 17 - "ESLint Configuration"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 18 - "backup.sh"
Cohesion: 0.60
Nodes (3): log_err(), log_ok(), backup.sh script

## Knowledge Gaps
- **161 isolated node(s):** `PageProps`, `dynamic`, `revalidate`, `PageProps`, `dynamic` (+156 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Header()` connect `Header.tsx` to `Global Usage Statistics`, `stats/[code]/page.tsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Project Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `getLinkByCode()` connect `getLinkByCode` to `links.ts`, `index.ts`, `stats/[code]/page.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `PageProps`, `dynamic`, `revalidate` to the rest of the system?**
  _161 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `links.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09407665505226481 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Header.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05897435897435897 - nodes in this community are weakly interconnected._