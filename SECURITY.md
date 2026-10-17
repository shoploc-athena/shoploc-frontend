# Security policy

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately with the **Report a vulnerability** button in the **Security** tab of this repository, or contact the maintainers directly.

Please include:
- a description of the problem and its impact,
- the steps to reproduce it,
- the affected version or commit.

We will acknowledge the report as soon as possible and keep you informed of the fix.

## Automated checks

- Dependabot monitors the npm dependencies and the GitHub Actions.
- GitHub secret scanning blocks commits that contain credentials.
- The CI runs the linter, the tests and the build on every pull request.

## Secrets

Never commit passwords, tokens, or keys. Use local environment files, which are ignored by Git.