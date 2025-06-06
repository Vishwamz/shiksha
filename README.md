# Shiksha Hisab

## Introduction

Shiksha Hisab is a **desktop school accounting application** designed to simplify financial management for educational institutions. It provides a user-friendly interface for managing accounts, tracking transactions via voucher entries, and generating essential financial reports, all within the context of specific financial years, **running locally on the user's system.**

## Core Features

Based on the project blueprint, the core functionalities include:

*   **Initial Setup Wizard:** A guided process to configure the application with school details, administrator credentials, and the first financial year. (Note: Initial setup wizard functionality may need to be adapted for local Electron app context if it relied on cloud services).
*   **Secure Sign-In with Financial Year Selection:** Ensures secure access to the application and allows users to work within a chosen financial year using local credentials.
*   **Account Management:** Comprehensive tools for managing Account Groups and individual Accounts, including CRUD (Create, Read, Update, Delete) operations and tracking opening balances per financial year, stored locally.
*   **Voucher Entry:** A robust module for double-entry bookkeeping, featuring automatic cash balancing options and voucher re-numbering based on the transaction date within the selected financial year, with data saved locally.
*   **Report Generation:** Capability to generate various financial reports (e.g., Account Lists, Voucher Reports, General Ledgers, Day Books). Data is sourced from the local database. More complex reports like Monthly Summaries, P&L, and Balance Sheets have placeholders and require full implementation of underlying accounting logic.

## Tech Stack

*   **Application Framework:** Electron
*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn/ui
*   **Local Database:** SQLite
*   **AI:** Genkit, Google AI (Gemini 2.0 Flash) *(If AI features are actively used)*
*   **State Management:** TanStack Query (React Query) for server state management with the local DB.

## Getting Started

Follow these steps to get a local copy of Shiksha Hisab up and running.

### Prerequisites

*   Node.js (Latest LTS version recommended)
*   npm or yarn

### Cloning the Repository

```bash
git clone <repository-url>
cd shiksha-hisab
```
*(Replace `<repository-url>` with the actual URL of the repository and `shiksha-hisab` with the actual repository name if different)*

### Installation

Navigate to the project directory and install the dependencies:

```bash
npm install
# or
yarn install
```

### Environment Setup

For the Genkit AI integration (if used), you may need to set up your environment variables. Create a `.env.local` file in the root of your project.

Add the following environment variable if you are using the AI features:
*   `GOOGLE_GENAI_API_KEY`: Your Google AI API Key.

The application now uses a local SQLite database (`appdata.db`) for data storage. This file is typically created in the project's root directory during development and in the user's application data directory (e.g., `%APPDATA%` on Windows, `~/.config` on Linux, `~/Library/Application Support` on macOS) in a production build.

**Default login credentials are `admin` / `password`.**

### Running the Development Server

To start the Electron application in development mode:

```bash
npm run electron:dev
```
This will launch the desktop application. Developer tools can usually be accessed via `View > Toggle Developer Tools` in the application menu or by pressing `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS).

### Running Genkit (If AI features are active)

To start the Genkit AI development server:

```bash
npm run genkit:dev
```
For running Genkit with file watching enabled:
```bash
npm run genkit:watch
```

## Project Structure

The project follows a standard Next.js application structure, adapted for Electron:

*   `src/app/`: Contains the main application routes and pages (using Next.js App Router).
*   `src/ai/`: Houses Genkit AI integration (if used).
*   `src/components/`: Stores reusable UI components.
*   `src/lib/`: Utility functions, helper scripts, database interaction (`db.ts`), local authentication (`auth.ts`).
*   `src/hooks/`: Custom React hooks.
*   `docs/`: Project documentation files.
*   `public/`: Static assets.
*   `main.js`: Electron main process script.
*   `preload.js`: Electron preload script.
*   `out/`: Directory generated by `next export` containing the static Next.js build used by Electron in production.
*   `appdata.db`: SQLite database file (location varies by environment as described in Environment Setup).

## Available Scripts

The `package.json` file includes the following scripts:

*   `dev`: `next dev --turbopack -p 9002` (Runs the Next.js development server, typically used as part of `electron:dev`)
*   `electron:dev`: `concurrently "npm run dev" "cross-env NODE_ENV=development electron ."` (Runs the full application in development mode)
*   `electron:build`: `next build && next export && electron-builder` (Builds the Electron application for production/distribution)
*   `genkit:dev`: `genkit start -- tsx src/ai/dev.ts` (Starts Genkit AI dev server)
*   `genkit:watch`: `genkit start -- tsx --watch src/ai/dev.ts` (Starts Genkit AI dev server with watch mode)
*   `build`: `next build` (Builds the Next.js part of the application)
*   `start`: `next start` (Starts a Next.js production server; not directly used for launching the packaged Electron app)
*   `lint`: `next lint` (Lints the codebase)
*   `typecheck`: `tsc --noEmit` (Performs TypeScript type checking)

## Building for Production

To build the Electron application for your current platform (Windows, macOS, or Linux):

```bash
npm run electron:build
```
This command will:
1.  Build the Next.js application (`next build`).
2.  Export it as static files (`next export` into the `out` directory).
3.  Use `electron-builder` to package the Electron app, including the exported Next.js app.

The distributable application files (e.g., an `.exe` installer for Windows, a `.dmg` for macOS, or an `.AppImage`/`.deb` for Linux) will be located in a `dist` directory (or as configured in `package.json` under the `build` settings for `electron-builder`).

## Linting and Typechecking

To ensure code quality and catch potential errors early:

```bash
npm run lint
npm run typecheck
```

## Contributing

Contributions are welcome! Please follow the standard fork and pull request workflow. (Further details can be added here as the project matures).

## License

This project is currently unlicensed.
