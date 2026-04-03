# Paperclip

Open-source AI agent orchestration platform for running zero-human companies. Powered by [Paperclip AI](https://github.com/paperclipai/paperclip).

## Setup

### Prerequisites

- Node.js 20+
- npm or pnpm

### Install

```bash
npm install
```

### Configure

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Set at least one LLM provider key (`ANTHROPIC_API_KEY` or `OPENAI_API_KEY`).

By default, Paperclip uses an embedded PostgreSQL database. To use an external database, set `DATABASE_URL`.

### Run onboarding (first time only)

```bash
npx paperclipai onboard
```

### Start the server

```bash
npx paperclipai run
```

The dashboard will be available at `http://localhost:3100`.

## Included

- `package.json` — paperclipai dependency
- `.env.example` — environment variable template
- `agents/` — agent definitions
- `workflows/` — workflow definitions
- `docs/` — project documentation

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | External PostgreSQL URL (optional; uses embedded DB if unset) |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude-based agents |
| `OPENAI_API_KEY` | OpenAI API key for GPT-based agents |
| `PORT` | Server port (default: 3100) |
| `BETTER_AUTH_SECRET` | Required for Docker / non-local deployments |
