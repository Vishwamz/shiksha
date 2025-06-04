# Shiksha Hisab

## Introduction

Shiksha Hisab is a school accounting application designed to simplify financial management for educational institutions. Its main purpose is to provide a user-friendly interface for managing accounts, tracking transactions via voucher entries, and generating essential financial reports, all within the context of specific financial years.

## Core Features

Based on the project blueprint, the core functionalities include:

*   **Initial Setup Wizard:** A guided process to configure the application with school details, administrator credentials, and the first financial year.
*   **Secure Sign-In with Financial Year Selection:** Ensures secure access to the application and allows users to work within a chosen financial year.
*   **Account Management:** Comprehensive tools for managing Account Groups and individual Accounts, including CRUD (Create, Read, Update, Delete) operations and tracking opening balances per financial year.
*   **Voucher Entry:** A robust module for double-entry bookkeeping, featuring automatic cash balancing options and voucher re-numbering based on the transaction date within the selected financial year.
*   **Report Generation:** Capability to generate various financial reports in PDF format, such as Account Lists, Voucher Reports, General Ledgers, Day Books, Monthly Summaries (Tarij), Profit and Loss Accounts, and Balance Sheets.

## Tech Stack

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn/ui
*   **AI:** Genkit, Google AI (Gemini 2.0 Flash)
*   **Backend/DB:** Firebase (inferred from dependencies like `@tanstack-query-firebase/react` and common Next.js practices. Specific Firebase Admin SDK for backend operations is not explicitly listed in `package.json` but would typically be used).

## Getting Started

Follow these steps to get a local copy of Shiksha Hisab up and running.

### Prerequisites

*   Node.js (Latest LTS version recommended)
*   npm or yarn
*   A Firebase project: You will need to create your own Firebase project to configure the backend and database.
*   Google AI API Key: Required for the Genkit integration.

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

You'll need to set up your environment variables. Create a `.env.local` file in the root of your project. You can often copy an example file if one is provided:

```bash
cp .env.example .env.local
```
*(If `.env.example` does not exist, create `.env.local` manually)*

Add the following environment variables to your `.env.local` file:

*   `GOOGLE_GENAI_API_KEY`: Your Google AI API Key.
*   `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase project's API Key.
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase project's Auth Domain.
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project's ID.
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase project's Storage Bucket.
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase project's Messaging Sender ID.
*   `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase project's App ID.
*   `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: (Optional) Your Firebase project's Measurement ID for Google Analytics.

*Note: Obtain your Firebase configuration details from your Firebase project settings.*

### Running the Development Server

To start the Next.js development server:

```bash
npm run dev
```
The application should be accessible at `http://localhost:9002`.

### Running Genkit

To start the Genkit AI development server:

```bash
npm run genkit:dev
```
For running Genkit with file watching enabled:
```bash
npm run genkit:watch
```

## Project Structure

The project follows a standard Next.js application structure:

*   `src/app/`: Contains the main application routes and pages (using Next.js App Router).
*   `src/ai/`: Houses Genkit AI integration, including prompts, flows, and configurations.
*   `src/components/`: Stores reusable UI components, likely including components from Shadcn/ui.
*   `src/lib/`: Utility functions, helper scripts, and third-party library configurations.
*   `src/hooks/`: Custom React hooks for managing state and side effects.
*   `docs/`: Project documentation files, including `blueprint.md`.
*   `public/`: Static assets like images and fonts.

## Available Scripts

The `package.json` file includes the following scripts:

*   `dev`: `next dev --turbopack -p 9002`
*   `genkit:dev`: `genkit start -- tsx src/ai/dev.ts`
*   `genkit:watch`: `genkit start -- tsx --watch src/ai/dev.ts`
*   `build`: `next build`
*   `start`: `next start`
*   `lint`: `next lint`
*   `typecheck`: `tsc --noEmit`

## Building for Production

To build the application for a production environment:

```bash
npm run build
npm run start
```

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
