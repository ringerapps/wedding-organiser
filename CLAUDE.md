# CLAUDE.md — RingerApps Project Context

Read this file at the start of every session. It contains project-specific conventions and critical instructions.

---

## ⚠️ CRITICAL: Agent Logging Requirement

You MUST maintain an `agent_logs.md` file in the project root. This is your running status log.

**Write to it continuously** as you work — every significant action, decision, or blocker:

```markdown
# Agent Logs

## 2026-02-14 14:32 UTC
- Created project structure with Nuxt 3
- Set up Tailwind configuration
- Building auth utilities...

## 2026-02-14 14:45 UTC
- Built auth utilities (login, register, middleware)
- Now creating database schema...

## 2026-02-14 15:10 UTC
- BLOCKED: Need AWS credentials for S3 bucket setup
- Pausing here until credentials provided
```

**When to write:**
- Starting a new task phase ("Now building X...")
- Completing a component/feature ("Finished Y, moving to Z...")
- Encountering blockers ("Stuck because...")
- Making architectural decisions ("Decided to use X because...")
- Every 5-10 minutes of active work minimum

**Format:** Append new entries at the TOP (reverse chronological). Keep entries concise but informative.

---

## Stack

- **Framework:** Nuxt 3 + Vue 3 (Composition API patterns)
- **Styling:** Tailwind CSS with a predefined theme
- **Testing:** Vitest

## Project Structure

```
├── pages/           # Nuxt page routes
├── components/      # Vue components
├── composables/     # Shared Vue composables
├── utils/           # Helper utilities
├── services/        # Business logic / API services
├── constants/       # App constants, config
├── assets/          # Static assets
├── public/          # Public files
├── infra/           # Terraform infrastructure
├── tests/           # Unit tests (mirror src structure)
├── agent_logs.md    # YOUR RUNNING LOG — UPDATE THIS
├── buildspec.yml    # AWS CodePipeline build config
└── CLAUDE.md        # This file
```

## Conventions

### Code Style
- Use Vue 3 Composition API (`<script setup>` preferred)
- Async/await over raw promises
- Explicit types via JSDoc or TypeScript when helpful

### UI/UX
- Modern, clean micro-SaaS aesthetic as default
- Prioritize clarity and readability
- Landing pages: simple body + creative/flair header
- Responsive first, mobile-critical

### Testing
- Write unit tests for services and utils
- Business logic must have coverage
- Run `npm test` (Vitest) before any master push

## ⚠️ CRITICAL: CI/CD Driven Deployment — REQUIRED

**A project is NOT complete until the infrastructure exists AND can be built/deployed via AWS CodePipeline.**

You must build:
1. **Application code** — The Nuxt/Vue app, pages, components, tests.
2. **Infrastructure** — Terraform in `infra/` that defines the FULL stack:
   - AWS CodePipeline + CodeBuild (to build and deploy the app).
   - AWS Lambda (Nitro) via API Gateway (the runtime environment).
   - IAM Roles/Policies (all prefixed with `openclaw-`).
3. **Build Configuration** — A working `buildspec.yml` in the root that handles the Nitro build and deployment steps.

### Deployment Workflow
- **CodePipeline is the source of truth.** You do NOT just run `terraform apply` locally and call it done.
- You must push code to the `master` branch (or a triggers-enabled branch) and verify the pipeline succeeds.
- **Incremental Progress:** Keep pushing your code regularly. Do not wait for a "final" push. Every significant feature or infra change should be committed and pushed to GitHub.

### Infrastructure (Terraform) — REQUIRED

- All infra MUST be defined in `infra/` as working Terraform templates
- Deploy target: AWS Lambda (Nitro) via API Gateway
- The `infra/` folder must contain actual `.tf` files, not be empty
- You must run `terraform plan` successfully before considering infra "done"
- Cost optimization is a constraint — prefer serverless, minimal always-on resources.

### ⚠️ AWS Lambda Function URLs Are Blocked — Use API Gateway Instead

Lambda Function URLs return 403 even with correct `NONE` auth type and resource policies. This is an account-level restriction. **Always use API Gateway HTTP API** for public Lambda access:

```hcl
resource "aws_apigatewayv2_api" "http_api" {
  name          = local.function_name
  protocol_type = "HTTP"
  target        = aws_lambda_function.app.arn
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.app.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*"
}

output "app_url" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}
```

Do NOT use `aws_lambda_function_url` — it will deploy but return 403.

### ⚠️ AWS Lambda + Nuxt/Nitro Deployment — CRITICAL GOTCHAS

**1. Static assets must be bundled with the Lambda.**
The Nitro `aws-lambda` preset builds to `.output/server/` (handler code) and `.output/public/` (JS, CSS, images). The Lambda zip must include BOTH directories. The server code references assets via relative paths like `../public/...`, so the zip structure must be:
```
zip root/
├── server/          # Nitro handler (index.mjs, chunks/)
└── public/          # Static assets (_nuxt/, favicon, etc.)
```
**The Lambda handler must be set to `server/index.handler`** (not `index.handler`) because the zip contains the full `.output/` structure.

If you only zip `.output/server/`, all JS/CSS will 404 and the site will render unstyled with no interactivity.

**2. Enable `serveStatic` in Nuxt config.**
```ts
nitro: {
  preset: 'aws-lambda',
  serveStatic: true,  // Required! Without this, Lambda won't serve public/ assets
}
```

**3. Terraform archive_file must source from `.output/` (not `.output/server/`):**
```hcl
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../.output"
  output_path = "${path.module}/lambda_package.zip"
}
```

**4. All IAM resource names must be prefixed with `openclaw-`.**
The `saasbot` IAM user can only create roles/policies matching `arn:aws:iam::*:role/openclaw-*`. Use a naming convention like:
```hcl
locals {
  function_name = "openclaw-${var.project_name}-${var.environment}"
}
```

### Completion Checklist

Before merging to master, verify:
- [ ] App code complete (pages, components, logic)
- [ ] `infra/` contains working Terraform configs
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] `cd infra && terraform plan` succeeds (no errors)
- [ ] `buildspec.yml` exists for CI/CD

**DO NOT mark a project complete until infrastructure exists.**

## CICD (AWS CodePipeline)

- Build config: `buildspec.yml` in repo root
- Pipeline triggers on `master` branch pushes
- Feature branches (prefixed `feature/*`) do NOT trigger CI
- Pipeline must run tests; failures block deployment

## Dev Process

### Autonomy
You are an autonomous developer. Drive tasks to completion without checking in unless:
- You need an API key or credential you don't have
- You lack permissions for a required action
- A critical architectural decision needs alignment

### New Projects (from scratch)

1. **Plan first:** Document infra, architecture, and build phases
2. **Feature branch:** Create `feature/init` (no CI attached)
3. **Incremental commits:** Push regularly as you build
4. **Final checks:**
   - `npm run build` passes
   - `npm test` passes
5. **Merge to master:** Only when above checks pass

### Blank Project Setup — Step by Step

When starting from a fresh folder with only CLAUDE.md:

```bash
# 1. Install Nuxt 3 and core dependencies
npm install nuxt vue vue-router @nuxt/devtools

# 2. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Install testing framework
npm install -D vitest @vue/test-utils

# 4. Create standard .gitignore (see .gitignore section below)

# 5. Create minimal file structure
mkdir -p pages components composables utils services constants assets public tests

# 6. Configure Tailwind (tailwind.config.ts)
# 7. Configure Nuxt (nuxt.config.ts)
# 8. Create first page (pages/index.vue)

# 9. Test the setup
npm run dev      # Verify dev server starts
npm run build    # Verify production build works
npm test         # Verify test runner works

# 10. First commit
```

**DO NOT proceed with feature development until the blank project builds and tests pass.**

---

## .gitignore

Create a `.gitignore` file immediately after `npm install`. Do not commit `node_modules` or build artifacts.

**Standard `.gitignore` for Nuxt/Vue projects:**

```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Nuxt build / generate output
.nuxt/
.output/
.nitro/
.cache/
dist/

# Vue build output
dist-ssr/
*.local

# Testing
coverage/
*.log

# Environment
.env
.env.*
!.env.example

# IDE / Editor
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Optional:
# /public (if generated at build time)
```

**Rule of thumb:** If it's auto-generated or can be recreated by `npm install && npm run build`, don't commit it.

### Bug Fixes / Features

- Branch from master: `feature/<name>` or `fix/<name>`
- Build through to completion
- Merge only after build + tests pass

## Environment

Globals are pre-configured (AWS creds, API keys). App-specific vars:

```bash
APP_ENV=development|staging|production
APP_NAME=
APP_URL=  # Lambda URL initially, DNS configured later
```

## Useful Commands

```bash
# Dev server
npm run dev

# Build
npm run build

# Tests
npm test

# Lint (if configured)
npm run lint

# Terraform
cd infra && terraform plan
```

## DNS

Use the Lambda HTTPS URL initially. DNS instructions will be added here when applicable.

---

## Reference

For implementation details, architecture patterns, or technical specifics — consult this CLAUDE.md file. Do not hallucinate stack details; check here first.
