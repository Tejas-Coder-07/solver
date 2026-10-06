# GARDENIA

GARDENIA is a charter-governed research collaboration prototype for sponsors, researchers, students, mentors, and administrators. Supabase is the application's authentication, PostgreSQL, row-level security, and private-storage provider.

## Requirements

- Node.js 20 or newer and npm
- A Supabase project (or local Supabase CLI stack)
- Docker Desktop when running the local Supabase stack

## Run the application

1. Install dependencies:

   ```powershell
   npm ci
   ```

2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to values from the intended Supabase project. The public key must be an anon/publishable key, never a service-role key.

3. Install the Supabase CLI using the official Supabase instructions and authenticate it:

   ```powershell
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

   Linking and pushing migrations changes the selected database. Verify the project reference before continuing. For a local stack, use `npx supabase start` instead of linking to a hosted project.

4. Apply the ordered migrations:

   ```powershell
   npx supabase db push
   ```

5. Start Next.js:

   ```powershell
   npm run dev
   ```

   Open `http://localhost:3000`.

Do not commit `.env.local`, paste database passwords into commands, or expose service-role/database credentials to browser code. Rotate credentials that have been shared publicly. Configure the Supabase Auth site URL and callback allowlist for the local or deployed application URL.

## Database and demo status

Migrations are in `supabase/migrations`; they have been applied to the currently configured demo Supabase project. Other Supabase projects still need the migrations applied. The configured database currently contains no demo profiles or projects, and this repository does not automate creation of Auth accounts. Create accounts through Supabase Auth, then grant non-student roles through the administrator role workflow. Existing browser-side demo fixtures have not been removed. Do not represent sample amounts or browser-only state as real money.

The current contribution ledger records reviewed contributions and credits. It is not a payment escrow, and the prototype does not move or custody funds. See [demo readiness](./docs/DEMO_READINESS.md) for implemented flows, limitations, and the honest demonstration path.

For the local presentation preview, open `/auth/login`, enter an email, choose a role, and select **Enter demo workspace**. This development-only preview skips verification and uses sample workspace screens; it is not an authenticated Supabase account, and protected API/database actions still require a real signed-in account. The password sign-in option remains available for real accounts.

## Validation

```powershell
npx tsc --noEmit
npm run build
```

These checks do not replace applying migrations to a disposable local database and testing authorization with multiple accounts.

## Project documents

- [Architecture](./docs/ARCHITECTURE.md)
- [Demo readiness and script](./docs/DEMO_READINESS.md)
- [AI-tool declaration](./docs/AI_TOOL_DECLARATION.md)
- [Backend gaps](./docs/BACKEND_GAPS.md)
- [Database setup](./docs/DATABASE.md)
- [Deployment](./docs/DEPLOYMENT.md)
