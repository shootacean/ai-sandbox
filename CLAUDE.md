# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is an AI sandbox repository containing TypeScript learning projects and experiments.

### hello-world Project

Located in `hello-world/` directory - a simple TypeScript project demonstrating basic setup and Hello World implementation.

## Common Commands

### hello-world TypeScript Project

Navigate to the `hello-world/` directory first:

```bash
cd hello-world
```

**Development:**
- `npm run dev` - Run TypeScript directly with ts-node
- `npm run build` - Compile TypeScript to JavaScript in dist/
- `npm start` - Run compiled JavaScript from dist/

**Dependencies:**
- `npm install` - Install project dependencies

## Architecture Notes

### TypeScript Configuration

The hello-world project uses a standard TypeScript setup:
- Source files in `src/`
- Compiled output in `dist/` (excluded from git)
- Target: ES2020 with CommonJS modules
- Strict TypeScript configuration enabled

### Development Workflow

Projects are set up with both development and production workflows:
- Development: Direct TypeScript execution via ts-node
- Production: Compile-then-run workflow with standard Node.js