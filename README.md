# Supabase Backup

Supabase DB full bucket backup system.

## ℹ️ Table of Contents

- [Supabase Backup](#supabase-backup)
  - [ℹ️ Table of Contents](#ℹ️-table-of-contents)
  - [🏁 Getting Started](#-getting-started)
    - [1️⃣ Prerequisite](#1️⃣-prerequisite)
    - [2️⃣ Setup](#2️⃣-setup)
    - [3️⃣ Execute](#3️⃣-execute)
  - [📜 Available Scripts](#-available-scripts)
    - [🏗️ Build \& Run Commands](#️-build--run-commands)
    - [✨ Code Quality Commands](#-code-quality-commands)

## 🏁 Getting Started

### 1️⃣ Prerequisite

You will need the following tools in order to be able to run the projet:

1. **Node** and **NPM** (latest stable version)
2. **PNPM** (Install globally with NPM)
3. **Supabase CLI** installed and configured properly

### 2️⃣ Setup

1. Install the dependencies by running:

```bash
pnpm install
```

2. Create a _`.env`_ file in the root directory, and fill it with the keys of the _`.env.example`_ file and your own values accordingly. The ENV variables are explained below:
   - **`SUPABASE_URL`**: The URL to your Supabase project. If hosted on [supabase.com](www.supabase.com), it must look like this: `https://yourproject.supabase.co`
   - **`SERVICE_KEY`**: The secret key of your Supabase project. It usually looks like a JWT token.
   - **`BACKUP_DIR`**: The directory in which you wish to store the backups in. Defaults to _`backups`_ if not specified.
   - **`BUCKET_IDS`**: The IDs of the buckets you wish to backup. Must be comma-separated. Example: `your-bucket-id-1,your-bucket-id-2,your-bucket-id-3`. These usually are the name of the buckets. If generated automatically by Supabase, they usually look like an UUID.

### 3️⃣ Execute

After setting up the project properly, you're ready to run the app and take a full DB backup from your buckets by running the following command:

```bash
pnpm run start
```

This will compile the TypeScript code and run the application. During the execution, you'll get proper log messages and progress reports. If there were no errors during the download process, all of your files must be saved in the directory that you specified yourself in the `.env` file (default is `backups`) after the execution is done.

## 📜 Available Scripts

### 🏗️ Build & Run Commands

- `pnpm run build` - Compile TypeScript to JavaScript
- `pnpm run start` - Build and run the application
- `pnpm run dev` - Build and run in one command
- `pnpm run clean` - Remove compiled files

### ✨ Code Quality Commands

- `pnpm run lint` - Check for linting errors
- `pnpm run lint:fix` - Auto-fix linting errors
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check if code is properly formatted
- `pnpm run check` - Run both lint and format checks
- `pnpm run fix` - Auto-fix both linting and formatting issues
