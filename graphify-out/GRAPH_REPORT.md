# Graph Report - .  (2026-08-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 359 nodes · 594 edges · 30 communities (22 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.83)
- Token cost: 1,005 input · 290 output

## Graph Freshness
- Built from commit: `917cb5e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Link Redirection Logic
- TypeScript Configuration
- Static Content Pages
- Project Dependencies
- Link Creation API
- Link Statistics UI
- Database Migrations
- Development Dependencies
- Package Metadata
- Global Analytics
- Link Management Service
- Internationalization and Locales
- Input Validation Schemas
- Project Documentation
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `getLinkByCode()` - 15 edges
3. `execute()` - 12 edges
4. `getGlobalStats()` - 12 edges
5. `hashIp()` - 11 edges
6. `StatsPage()` - 10 edges
7. `trackClick()` - 10 edges
8. `isLinkExpired()` - 10 edges
9. `ApiError` - 10 edges
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
- `POST()` --calls--> `createLink()`  [EXTRACTED]
  app/api/links/route.ts → src/lib/links.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **MSK Ecosystem Documentation** — readme, contributing, code_of_conduct, security, license [EXTRACTED 1.00]
- **CI/CD Pipeline** — github_workflows_deploy, github_workflows_codeql, github_workflows_eslint, github_workflows_dependency_review [EXTRACTED 1.00]

## Communities (30 total, 8 thin omitted)

### Community 0 - "Link Redirection Logic"
Cohesion: 0.14
Nodes (25): GET(), POST(), POST(), PageProps, RedirectPage(), PageProps, PasswordPage(), PasswordPrompt() (+17 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.06
Nodes (32): ./app/*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+24 more)

### Community 2 - "Static Content Pages"
Cohesion: 0.08
Nodes (12): CreateLinkForm(), DeleteForm(), DeleteFormProps, State, DeleteLinkButton(), Header(), HeaderProps, Logo() (+4 more)

### Community 3 - "Project Dependencies"
Cohesion: 0.07
Nodes (28): GET(), bcryptjs, dotenv, mysql2, nanoid, next, next-intl, dependencies (+20 more)

### Community 4 - "Link Creation API"
Cohesion: 0.13
Nodes (16): QR_OPTIONS, RouteContext, DELETE(), RouteContext, LinkResult(), LinkResultProps, Props, jsonError() (+8 more)

### Community 5 - "Link Statistics UI"
Cohesion: 0.18
Nodes (19): GET(), RouteContext, formatDate(), PageProps, parseDays(), StatsPage(), QRCodeDisplay(), QRCodeDisplayProps (+11 more)

### Community 6 - "Database Migrations"
Cohesion: 0.15
Nodes (21): main(), ensureMigrationsTable(), getExecutedMigrations(), main(), MIGRATIONS_DIR, runMigration(), ClickContext, extractClickContext() (+13 more)

### Community 7 - "Development Dependencies"
Cohesion: 0.09
Nodes (23): autoprefixer, eslint, eslint-config-next, devDependencies, autoprefixer, eslint, eslint-config-next, postcss (+15 more)

### Community 8 - "Package Metadata"
Cohesion: 0.10
Nodes (20): description, engines, node, license, name, overrides, brace-expansion, eslint (+12 more)

### Community 9 - "Global Analytics"
Cohesion: 0.18
Nodes (14): GET(), GlobalStatsPage(), AggregateBars(), AggregateBarsProps, aggregateBrowsersGlobal(), aggregateOsGlobal(), countClicksLast7Days(), countClicksToday() (+6 more)

### Community 10 - "Link Management Service"
Cohesion: 0.25
Nodes (13): queryOne(), createLink(), CreateLinkOptions, CreateLinkResult, LinkServiceError, DEFAULT_LENGTH, generateDeleteToken(), generateShortCode() (+5 more)

### Community 11 - "Internationalization and Locales"
Cohesion: 0.28
Nodes (8): POST(), LanguageSwitcher(), isLocale(), Locale, LOCALE_FLAGS, LOCALE_LABELS, LOCALES, getCurrentLocale()

### Community 12 - "Input Validation Schemas"
Cohesion: 0.18
Nodes (10): CreateLinkInput, createLinkSchema, customCodeSchema, DeleteLinkInput, deleteLinkSchema, expiresAtSchema, passwordSchema, urlSchema (+2 more)

### Community 13 - "Project Documentation"
Cohesion: 0.25
Nodes (9): Code of Conduct, Contributing Guidelines, Deployment Guide, Deploy Workflow, GNU Affero General Public License v3.0, MSK Logo, MSK Shortener UI Screenshot, MSK Shortener README (+1 more)

### Community 14 - "Installation Scripts"
Cohesion: 0.43
Nodes (7): DEBIAN_FRONTEND, log_err(), log_info(), log_ok(), log_step(), log_warn(), install.sh script

### Community 15 - "Abuse Prevention"
Cohesion: 0.48
Nodes (6): AbuseCheckResult, addBlockedDomain(), BLOCKED_DOMAINS, BLOCKED_TLDS, checkUrlForAbuse(), SHORTENER_DOMAINS

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
- **127 isolated node(s):** `PageProps`, `PageProps`, `RouteContext`, `QR_OPTIONS`, `RouteContext` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Project Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **Why does `GET()` connect `Project Dependencies` to `Link Redirection Logic`, `Link Creation API`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **What connects `PageProps`, `PageProps`, `RouteContext` to the rest of the system?**
  _127 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Link Redirection Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.14393939393939395 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Static Content Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08275862068965517 - nodes in this community are weakly interconnected._
- **Should `Project Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._