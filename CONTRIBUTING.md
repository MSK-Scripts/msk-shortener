# Contributing to MSK Shortener

Thanks for taking the time to contribute! MSK Shortener is a self-hosted URL
shortener and part of the open-source MSK ecosystem. This is a single-maintainer
project, so a little coordination up front keeps things smooth for everyone.

By participating in this project, you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to Contribute

- **Report bugs** using the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Request features** using the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- **Improve the docs** (README, deployment guide, code comments)
- **Add a translation** (see [Internationalization](#internationalization) below)
- **Submit a pull request** for a bug fix or new feature

## Before You Start

For anything larger than a small fix, please **open an issue first** to discuss
the change. This avoids duplicated work and makes sure the change fits the
project's direction before you invest your time.

## Development Setup

### Prerequisites

- **Node.js** 20 or later
- **MariaDB** 10.6 or later
- A modern terminal (Linux, macOS, or WSL on Windows)

### Getting started

```bash
# Fork and clone the repository
git clone https://github.com/<your-username>/msk-shortener.git
cd msk-shortener

# Install dependencies
npm install

# Copy the environment template and adjust the values
cp .env.example .env

# Run database migrations
npm run migrate

# Start the dev server
npm run dev
```

The app will be available at http://localhost:3000.

## Pull Request Process

1. **Create a branch** off `main` with a descriptive name
   (e.g. `fix/qr-svg-export` or `feature/link-tags`).
2. **Keep it focused.** One concern per PR. Smaller PRs get reviewed faster.
3. **Run the checks locally** before pushing:
   ```bash
   npm run lint
   npm run type-check
   ```
4. **Write clear commit messages** in English, describing what changed and why.
5. **Fill out the PR template** so the change is easy to review.
6. **Link the related issue** in the PR description (e.g. `Closes #42`).

A maintainer will review your PR as soon as possible. Please be patient, and be
ready to make adjustments based on feedback.

## Coding Guidelines

- **Language:** All code, comments, commit messages, and PR text are in English.
- **TypeScript:** Strict mode is on. Avoid `any`; type everything.
- **Validation:** Validate all external input with Zod. Every new API endpoint
  needs input validation and rate limiting.
- **Security first:** Follow the principles in the
  [Security & Privacy](README.md#-security--privacy) section. No IP addresses in
  plain text, no third-party trackers, no unnecessary cookies.
- **Style:** Match the existing code style. ESLint is the source of truth.

## Internationalization

The UI ships in German and English. All UI strings live in
[`messages/de.json`](messages/de.json) and [`messages/en.json`](messages/en.json).

To add a new language:

1. Copy `messages/en.json` to `messages/<locale>.json`.
2. Translate the values (keep the keys unchanged).
3. Wire the new locale into the i18n config.
4. Open a PR describing the language you added.

## Reporting Security Issues

Please **do not** open public issues for security vulnerabilities. Follow the
process described in [`SECURITY.md`](SECURITY.md) instead.

## License

By contributing, you agree that your contributions will be licensed under the
project's [GNU AGPL v3.0 or later](LICENSE.md).

---

Questions? Reach out at [info@msk-scripts.de](mailto:info@msk-scripts.de).
