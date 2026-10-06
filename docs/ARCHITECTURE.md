# GARDENIA architecture

## Purpose and runtime

GARDENIA is a web prototype for role-based, charter-governed research collaboration. The stack is Next.js 15 App Router, React 19, TypeScript, and Supabase. Supabase Auth identifies the user; PostgreSQL stores platform records; PostgreSQL row-level security (RLS) and transaction functions enforce data access and multi-row state changes; Supabase Storage holds private documents. Firebase is not configured or used.

```text
Browser
  | Supabase Auth session cookie
  v
Next.js middleware and server components
  | user-scoped Supabase client / authenticated REST requests
  v
Supabase Auth -> PostgreSQL + RLS + SECURITY DEFINER workflow functions
               -> private Storage buckets + object policies
```

The browser uses the public Supabase anon/publishable key and its authenticated session. Server routes reuse that user's session. No service-role key is required by the application path. The admin SQL editor has a separate optional server-only PostgreSQL connection and is privileged; it must not be enabled with a broad or publicly exposed credential.

## Identity, roles, and authorization

Supabase Auth owns credentials and sessions. A database trigger creates a `profiles` row with the least-privileged `STUDENT` role. Signup metadata may request an elevated role, but the request is stored separately; only an administrator decision function changes the profile role and writes an audit event. Application middleware validates the Auth user, loads the profile, and redirects role-mismatched routes. Route handlers repeat authentication and role checks; RLS remains the final database authorization boundary.

Project and organization access is represented by membership, access requests/grants, task assignment, and project resource scopes. Private Storage paths are checked against project/user scope. Project charters are versioned and not directly editable or deletable. These controls require the migrations to be applied to the same Supabase project used by the application.

## Core persisted workflows

The initial schema stores organizations, problems, projects, charters, memberships, milestones, tasks, documents, skills, experiments, AI provenance, contributions, evidence, reviews, credits, notifications, and audit events. Later migrations add role-access requests, project lifecycle states, conversations/messages, recommendations and AI execution records.

Important multi-row operations use PostgreSQL functions rather than optimistic client writes:

- Signup and role-request approval keep requested privilege separate from account creation.
- Project submission, administrative review, publication and charter versioning validate state and record audit events.
- Contribution submission records evidence; human review checks project access, author conflicts, charter compliance, scores, and explicit credit awards.
- An approved contribution writes its credit award and a hash-chained contribution-ledger entry in the same database transaction.
- Conversations are created through a membership-checking function. Message reads and sends are limited by conversation membership; read cursors are stored per member.

## Integrity model and limits

The contribution ledger is append-only at the table-policy/trigger layer. Its SHA-256 chain links each serialized ledger payload to the previous entry. This detects unauthorized edits if verification recomputes the chain from a trusted database snapshot. It is not an external blockchain, independent timestamp authority, or protection against a privileged database owner rewriting both data and hashes. The verifier must check sequence, previous hashes, and recomputed entry hashes; a tampered historical row should produce a failed verification result.

An AI provenance row associates a recorded AI action with a human user, project, and charter version. That is attribution metadata, not proof that the human authored every part of an artifact. The current mesh integration does not provide a configured production model provider, reliable copied-content detection, or an independent originality verdict. Any similarity flag should be presented as a review signal, not proof of plagiarism.

## Money, credits, and non-monetary work

Credits and contribution-ledger entries are platform reputation/credit records. They are not rupees and do not represent funds held in escrow. The repository does not integrate a payment processor, custody funds, implement milestone escrow/release/refunds, or provide financial settlement. A project with no monetary compensation therefore cannot yet be contrasted in the database with a fully implemented paid project. Never use the sample funding figures in a financial claim or demo as evidence of a completed payment.

## Deployment and operational dependencies

The deployer supplies the Supabase URL and public anon/publishable key through uncommitted environment configuration, applies migrations to the intended database, configures Auth redirect URLs, and creates test accounts for each role. Do not push migrations without checking the Supabase project reference. The workspace inspected for this architecture has no `.env.local`, key, linked CLI session, or local Docker database, so remote migration status and RLS behavior have not been verified here.

Before production or a judging demo, apply migrations to a disposable Supabase project and test both allowed and denied requests for each role, including private brief access, invitation/charter acceptance, dispute paths, storage, and ledger tampering. Real escrow requires a payment provider, webhook signature validation, idempotent transactions, reconciliation, refunds/disputes, and legal/compliance review; it is a separate system integration.
