<div align="center">

# MSK Shortener

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-27762e.svg)](LICENSE.md)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)

**Self-hosted URL shortener with statistics, QR codes and password protection.**

</div>

MSK Shortener turns long links into short ones under your own domain, shows how often they are
opened without tracking anyone, and hands out a QR code for every link. Links can carry a password
or an expiry date and are deleted with a token instead of an account.

It is part of the MSK Scripts ecosystem and runs at **[s.msk-scripts.de](https://s.msk-scripts.de)**.
You are welcome to use it there or to host your own instance.

## Quick start

```bash
git clone https://github.com/MSK-Scripts/msk-shortener.git
cd msk-shortener
npm install
cp .env.example .env   # database credentials and IP_HASH_SECRET
npm run migrate
npm run dev            # http://localhost:3000
```

## Documentation

| Topic | |
|---|---|
| [Features](docs/features.md) | What the shortener does |
| [Development](docs/development.md) | Tech stack, local setup, languages |
| [REST API and API keys](docs/api.md) | Endpoints, examples, issuing keys on the server |
| [Operations](docs/operations.md) | Production server, configuration |
| [Security and privacy](docs/security-privacy.md) | What is stored, spam and phishing protection |
| [Design system](DESIGN.md) | Colours, type, layout and components |
| [Deployment guide](deployment/README.md) | Apache, MariaDB, systemd, CI/CD |
| [Contributing and license](docs/contributing-and-license.md) | How to contribute, the AGPL in plain words |

## Help and contributing

Questions and bugs go to the [issue tracker](https://github.com/MSK-Scripts/msk-shortener/issues);
security issues as described in [SECURITY.md](SECURITY.md). Contributions are welcome: please open
an issue before larger changes, keep pull requests focused and read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[GNU Affero General Public License v3.0 or later](LICENSE.md) © [MSK Scripts](https://msk-scripts.de).
If you offer a modified version as a network service, you must publish your changes under the same
license. For a commercial license without these obligations, write to
[info@msk-scripts.de](mailto:info@msk-scripts.de).
