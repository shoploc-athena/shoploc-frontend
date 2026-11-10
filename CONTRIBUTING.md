# Contributing

Thank you for contributing to ShopLoc. This guide describes how we work so that the history stays clean and every change is reviewed.

## Workflow

1. Pick a ticket in Jira (for example `GLOP-40`) and move it to **In progress**.
2. Create a branch from `develop`:
```bash
   git switch develop
   git pull
   git switch -c feature/GLOP-40-product-list
```
3. Work in small commits.
4. Push the branch and open a **pull request** into `develop`.
5. Wait for the CI to pass and for **one approval**.
6. Merge with **Squash and merge**, then delete the branch.

Never push directly to `main` or `develop`.

## Branch names

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/<KEY>-short-description` | `feature/GLOP-40-product-list` |
| Bug fix | `fix/<KEY>-short-description` | `fix/GLOP-41-price-format` |
| Documentation | `docs/short-description` | `docs/update-readme` |
| Maintenance | `chore/short-description` | `chore/update-dependencies` |

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <short summary> [<JIRA-KEY>]
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`.

Examples:

- `feat(products): display the product list [GLOP-40]`
- `fix(products): format prices with two decimals [GLOP-41]`
- `docs: update the README`

Write the summary in the imperative, in English.

## Pull requests

- Keep them small and focused on one topic.
- Fill in the pull request template.
- Link the Jira ticket.
- The CI must be green before the review starts.
- Reviewers check readability, tests, security, accessibility, and the environmental impact of the change (page weight, number of requests, third-party libraries).
- Dependabot pull requests do not need a ticket key. Read what they change, check that the CI is green, then review and merge them like any other pull request. Major version changes (for example React or Vite) must be discussed with the team first.

## Code quality

- Run `npm run lint`, `npm test` and `npm run build` before pushing.
- Add or update unit tests for every behaviour change.
- Do not commit secrets, passwords, or tokens.
- Do not add a new dependency without a good reason: every library makes the application heavier.
- Fix issues reported by the CI, or explain in the pull request why they are accepted.

## Use of AI tools

Team members may use AI assistants, including to write code. The rules below keep the repository clean.

- **AI agent files must not be committed.** Files that belong to an AI tool and have nothing to do with the application (instructions, memory, prompts, conversation exports, agent settings, for example `CLAUDE.md`, `.claude/`, `.cursor/`) stay out of the repository. They are listed in `.gitignore`.
- **You are responsible for everything you commit**, whether you wrote it or an AI helped. Read it, understand it, test it, and be ready to explain it during a review.
- AI-assisted code goes through the same rules as any other code: pull request, tests, static analysis, and review.

## Reporting a problem

Open an issue describing the expected behaviour, the observed behaviour, and the steps to reproduce.