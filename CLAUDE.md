# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ylias is a Discord bot built with **discord.js v14** and the **Sapphire Framework v5**. It uses TypeScript, compiles to `dist/`, and runs on Node.js.

## Commands

- `npm run compile` — TypeScript compilation (`tsc -b src`)
- `npm run watch` — Compile in watch mode
- `npm start` — Compile + run (`npm run compile && node .`)
- `npm test` — Run all tests with Jest (`jest --no-watchman`)
- `npx jest tests/path/to/File.test.ts` — Run a single test file
- `npx eslint src/ tests/` — Lint all source and test files

## Architecture

### Sapphire autoloading

Sapphire auto-discovers commands, listeners, and preconditions by directory convention. Files in `src/commands/`, `src/listeners/`, and `src/preconditions/` are loaded automatically — no manual registration needed. Just export a class extending the appropriate Sapphire base class.

### Singleton pattern

Several lib classes (`Bootstrap`, `InteractionManager`, `RatReputation`) use a manual singleton pattern — `new ClassName()` returns the existing instance if one exists. This means they share state across usages.

### Key components

- **`src/index.ts`** — Entry point. Configures Sapphire command registry behavior, creates Bootstrap, and logs in.
- **`src/lib/Bootstrap.ts`** — Singleton. Configures dotenv, Discord intents, creates `SapphireClient`, handles login.
- **`src/lib/InteractionManager.ts`** — Singleton. Manages button interactions via EventEmitter. Buttons auto-expire (default 20 min) and components are removed from messages on expiry. Augments `discord.js` `ClientEvents` with a custom `buttonError` event.
- **`src/lib/RatReputation.ts`** — Singleton. Persists image voting data to `data/rat-reputation.json` on disk. Images with ≥5 "not rat" votes and a 3:1 negative ratio are filtered out.
- **`src/lib/Emotion.ts`** — Provides themed embeds with bot character emotion GIFs (brand color `0xE88745`).
- **`src/listeners/InteractionCreate.ts`** — Routes button interactions through `InteractionManager`.
- **`src/listeners/MessageCreate.ts`** — Handles non-command message behaviors: DM easter eggs, bot mention replies, and forwarding mentions of "mom" (bot owner) via DM.

### Slash commands

All commands are registered as Discord slash commands via `registerApplicationCommands()`. Commands use `BulkOverwrite` strategy for registration. The `OwnerOnly` precondition gates admin commands (like `/eval`) by checking `process.env.MOM`.

### Path aliases

- `#root/*` → `src/*` (at runtime: `dist/*.js`)
- `#lib/*` → `src/lib/*` (at runtime: `dist/lib/*.js`)
- Tests also use `#mocks/*` → `tests/mocks/*`

## Environment Variables

See `.env.sample`. Key vars: `TOKEN` (Discord bot token), `TEST_GUILD_ID`, `MOM` (owner user ID), plus API keys for Imgur, Google, Cat API, and Pixabay.

## Testing

Tests live in `tests/` mirroring `src/` structure. Uses `ts-jest` with a separate `tests/tsconfig.json`. Mock instances are in `tests/mocks/`. The setup file is `tests/jest.setup.ts`.

## Code Style

Enforced via ESLint (flat config in `eslint.config.js`):
- 4-space indentation, single quotes, 120 char max line length
- Trailing commas on multiline arrays/objects only (not imports, exports, or function params)
- `1tbs` brace style, mandatory curly braces
- Blank lines required before returns, after variable declarations, around blocks
