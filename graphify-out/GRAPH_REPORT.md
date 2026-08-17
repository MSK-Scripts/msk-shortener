# Graph Report - msk-shortener  (2026-08-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 413 nodes · 638 edges · 34 communities (25 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.67)
- Token cost: 1,076 input · 346 output

## Graph Freshness
- Built from commit: `db43bc26`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Link Redirection and Bot Detection
- TypeScript Configuration
- Static Pages and Metadata
- Project Dependencies
- QR Code and Link Creation
- Link Statistics Pages
- Database Migrations and Tracking
- Development Dependencies
- Package Metadata
- Global Usage Statistics
- Link Management and Password Protection
- Internationalization and Localization
- Project Documentation and Schema
- Contribution and Deployment Documentation
- Installation Scripts
- Abuse and Domain Filtering
- Root Layout and Fonts
- ESLint Configuration
- Backup Scripts
- Next.js Configuration
- Update Scripts
- Tailwind CSS Configuration
- CodeQL Security Workflow
- Dependency Review Workflow
- ESLint Linting Workflow
- Repository Mirroring Workflow
- Release Management Workflow
- UI Screenshots
- Database Schema Definitions

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `getLinkByCode()` - 15 edges
3. `execute()` - 12 edges
4. `getGlobalStats()` - 12 edges
5. `MSK Shortener – Claude Projekt-Doku` - 12 edges
6. `hashIp()` - 11 edges
7. `ApiError` - 10 edges
8. `trackClick()` - 10 edges
9. `isLinkExpired()` - 10 edges
10. `StatsPage()` - 10 edges

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
- **CI/CD Pipeline** — github_workflows_deploy, github_workflows_codeql, github_workflows_eslint, github_workflows_dependency_review [EXTRACTED 1.00]
- **MSK Ecosystem Documentation** — readme, contributing, code_of_conduct, security, license [EXTRACTED 1.00]

## Communities (34 total, 9 thin omitted)

### Community 0 - "Link Redirection and Bot Detection"
Cohesion: 0.08
Nodes (46): POST(), POST(), dynamic, PageProps, RedirectPage(), revalidate, BOT_PATTERNS, isBot() (+38 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (32): ./app/*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+24 more)

### Community 2 - "Static Pages and Metadata"
Cohesion: 0.07
Nodes (12): dynamic, dynamic, CreateLinkForm(), DeleteForm(), DeleteFormProps, State, DeleteLinkButton(), Header() (+4 more)

### Community 3 - "Project Dependencies"
Cohesion: 0.07
Nodes (27): bcryptjs, dotenv, mysql2, nanoid, next, next-intl, dependencies, bcryptjs (+19 more)

### Community 4 - "QR Code and Link Creation"
Cohesion: 0.13
Nodes (14): GET(), QR_OPTIONS, RouteContext, LinkResult(), LinkResultProps, PasswordForm(), Props, jsonError() (+6 more)

### Community 5 - "Link Statistics Pages"
Cohesion: 0.16
Nodes (22): GET(), RouteContext, dynamic, formatDate(), PageProps, parseDays(), revalidate, StatsPage() (+14 more)

### Community 6 - "Database Migrations and Tracking"
Cohesion: 0.15
Nodes (20): main(), ensureMigrationsTable(), getExecutedMigrations(), main(), MIGRATIONS_DIR, runMigration(), ClickContext, normalizeDeviceType() (+12 more)

### Community 7 - "Development Dependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, eslint, eslint-config-next, devDependencies, autoprefixer, eslint, eslint-config-next, postcss (+15 more)

### Community 8 - "Package Metadata"
Cohesion: 0.10
Nodes (20): description, engines, node, license, name, overrides, brace-expansion, eslint (+12 more)

### Community 9 - "Global Usage Statistics"
Cohesion: 0.16
Nodes (16): GET(), dynamic, GlobalStatsPage(), revalidate, AggregateBars(), AggregateBarsProps, aggregateBrowsersGlobal(), aggregateOsGlobal() (+8 more)

### Community 10 - "Link Management and Password Protection"
Cohesion: 0.11
Nodes (15): DELETE(), GET(), RouteContext, dynamic, PageProps, PasswordPage(), revalidate, LanguageSwitcher() (+7 more)

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

### Community 18 - "Backup Scripts"
Cohesion: 0.83
Nodes (3): log_err(), log_ok(), backup.sh script

### Community 19 - "Next.js Configuration"
Cohesion: 0.50
Nodes (3): csp, nextConfig, withNextIntl

## Knowledge Gaps
- **163 isolated node(s):** `PageProps`, `TrackClickOptions`, `CreateLinkOptions`, `Bucket`, `CreateLinkInput` (+158 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Header()` connect `Static Pages and Metadata` to `Global Usage Statistics`, `Link Statistics Pages`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Project Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `getLinkByCode()` connect `Link Statistics Pages` to `Link Redirection and Bot Detection`, `Link Management and Password Protection`, `QR Code and Link Creation`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `PageProps`, `TrackClickOptions`, `CreateLinkOptions` to the rest of the system?**
  _163 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Link Redirection and Bot Detection` be split into smaller, more focused modules?**
  _Cohesion score 0.07532467532467532 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Static Pages and Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.06951871657754011 - nodes in this community are weakly interconnected._