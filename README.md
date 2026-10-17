# shoploc-frontend

> Web application of **ShopLoc**, a multi-city local commerce platform with click & collect, loyalty and merchant tools.

![Node](https://img.shields.io/badge/Node.js-LTS-brightgreen)
![React](https://img.shields.io/badge/React-Vite-blue)

## Table of contents

1. [About](#about)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Available scripts](#available-scripts)
5. [Configuration](#configuration)
6. [Project structure](#project-structure)
7. [Tests and quality](#tests-and-quality)
8. [Offline support (PWA)](#offline-support-pwa)
9. [Branching and commits](#branching-and-commits)
10. [Eco-design](#eco-design)
11. [Security](#security)
12. [Project status](#project-status)
13. [Team](#team)

## About

ShopLoc connects customers, local merchants, the city hall and the merchants' association. The platform is split into microservices, each living in its own repository. This repository contains the **web front end**. It talks to the back-end services through a single entry point (the gateway) under the `/api` path.

| Repository | Purpose |
|---|---|
| `user-service` | Accounts, roles, authentication, loyalty |
| `store-service` | Shops, catalogue, stock, favourites |
| `order-service` | Cart, orders, payment, pick-up |
| `notification-analytics-service` | Notifications, statistics and reports |
| `shoploc-frontend` | **This repository** |
| `shoploc-infra` | Docker Compose, diagrams, shared documentation |

## Tech stack

| Area | Choice |
|---|---|
| Runtime and package manager | Node.js (LTS), npm |
| Build tool | Vite |
| UI | React |
| State management | Redux Toolkit |
| Offline support | Workbox (through `vite-plugin-pwa`) |
| Tests | Vitest |
| Static analysis | ESLint |
| Container | Docker (multi-stage build) with nginx |
| CI/CD | GitHub Actions |

## Getting started

### Prerequisites

- Git
- Node.js (LTS version) and npm
- A running `store-service` (see its README, or start the platform from `shoploc-infra`)

### Run locally

```bash
git clone https://github.com/shoploc-athena/shoploc-frontend.git
cd shoploc-frontend
npm install
npm run dev
```

The application is available at `http://localhost:5173`. In development, requests to `/api` are forwarded to `http://localhost:8080` (see `vite.config.js`).

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production (`dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run the static analysis (ESLint) |
| `npm test` | Run the unit tests (Vitest) |

## Configuration

The application calls the API with relative URLs (`/api/...`), so it needs no configuration. In production, the gateway (nginx) forwards `/api` to the back-end services. In development, the Vite proxy does the same.

Never commit secrets. Local environment files (`.env`, `.env.*`) are ignored by Git.

## Project structure

```text
shoploc-frontend
├── .github/                  # CI workflows, PR template, Dependabot
├── public/                   # Static files
├── src/
│   ├── app/                  # Redux store
│   ├── features/             # One folder per feature (slice, components, tests)
│   │   └── products/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Tests and quality

```bash
npm run lint
npm test
npm run build
```

The same three commands run in the CI on every pull request.

## Offline support (PWA)

The application caches its static files with a Workbox service worker, so it loads faster and works partly offline. API calls (`/api`) are never cached by the service worker. This also reduces network requests, which is part of our eco-design approach.

## Branching and commits

- `main`: stable code, protected, changes only through pull requests.
- `develop`: integration branch.
- `feature/<JIRA-KEY>-short-description`: one branch per task.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(products): display the product list [GLOP-40]`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow and review rules.

## Eco-design

This project follows the French [RGESN](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/) guidelines: lightweight pages, system fonts, no infinite scroll, few third-party libraries, cached static files, and lightweight container images.

## Security

See [SECURITY.md](SECURITY.md) to report a vulnerability. Dependencies and GitHub Actions are monitored by Dependabot, and secrets are protected by GitHub secret scanning.

## Project status

| Item | Status |
|---|---|
| Project skeleton (Vite, React, Redux Toolkit) | In progress |
| Product list page | Planned |
| Offline support (Workbox) | Planned |
| Unit tests | Planned |
| Docker image and gateway | Planned |
| CI pipeline | Planned |
| End-to-end tests | Planned |

## Team

Master MIAGE, Université de Lille.

- Marie
- Lan
- Brunine
- Angela