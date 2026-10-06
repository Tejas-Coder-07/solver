# Demo readiness and demonstration script

## Readiness verdict

The current repository is **not ready to claim the requested funded-project acceptance story**. The configured hosted Supabase project is connected and all six migrations have been applied; schema and migration status were verified. It currently contains zero profiles and zero projects, so role-based end-to-end behavior has not been tested with demo accounts. Existing browser-side demo fixtures were not removed. Firebase is not configured and is not a fallback in this implementation.

The schema and routes do support real Auth-backed profiles, role access requests, project lifecycle decisions, membership/access scopes, contributions, human reviews, credit awards, append-only contribution ledger entries, audit events, and authenticated messaging. A reviewer can record an `ESCALATE_DISPUTE` outcome, but a full dispute-resolution workflow is not complete.

The following submission requirements are not implemented end-to-end:

| Requested capability | Current state |
| --- | --- |
| Two reproducible seeded projects (funded and non-monetary) | No safe demo-account/data seed is configured; no monetary project funding model exists. |
| ₹1,00,000 escrow, milestone funding, payout shares/refunds | Not implemented; there is no payment-provider integration. Credit awards are not money. |
| Explicit charter acceptance/version re-acceptance | Charter versions exist, but member acceptance and re-acceptance enforcement are not complete. |
| AI milestones/skills and explainable, conflict-filtered matching | Recommendation storage exists; live AI generation and conflict-of-interest matching are not implemented. |
| Human-owned AI work audit and copied-content review flags | AI provenance schema exists; end-to-end execution/provenance and similarity review are incomplete. |
| Historical ledger tamper verification UI/test | Ledger writes are hash chained and append-only, but a full verifier and demo tamper test are not implemented. |
| Corner cases (withdrawal, failed research, disputes, silence, AI share, gaming, compensation change, minors) | Several have partial schema concepts only. Do not claim they are fully handled. |

## Honest 3-minute video outline

Record only after configuring a test Supabase project, applying migrations, creating separate accounts for each role, and verifying access with those accounts. Do not show real personal information or payment credentials.

1. **0:00-0:25 — Product and roles.** Introduce Gardenia and sign in with the sponsor account. State that the current demo tracks credits, not money.
2. **0:25-0:55 — Project and charter.** Show a project and its stored charter/version, if test records exist. Do not claim member acceptance is enforced.
3. **0:55-1:25 — Membership/access.** Sign in as a permitted participant and show the project workspace. If demonstrating a private brief, separately verify a non-member is denied before recording.
4. **1:25-2:05 — Contribution and human review.** Submit evidence as a contributor, then review it as a different authorized mentor/researcher. Show the human comments and credit decision.
5. **2:05-2:35 — Ledger and audit.** Show the recorded contribution ledger entry and audit event. Explain that it is a tamper-evident database hash chain, not a blockchain or cash settlement.
6. **2:35-3:00 — Honest limitations.** Name the missing payment escrow, AI provider, and corner-case workflows; do not present mock data as a completed feature.

If the judging brief requires the paid and non-monetary acceptance story, this outline is not a substitute for implementing and testing those missing workflows.

## Five-minute live-demo plan

- **Minutes 0-1:** Explain the Supabase-backed architecture, authenticated roles, and the exact database project used.
- **Minutes 1-2:** Show sponsor project/charter records and project access decisions; demonstrate the non-member denial from a separate account.
- **Minutes 2-3:** Submit and review a contribution with evidence, rubric scores, comments, and a non-cash credit award.
- **Minutes 3-4:** Show the contribution ledger/audit records and explain the limits of the hash-chain integrity model.
- **Minutes 4-5:** Answer questions by distinguishing implemented behavior from planned payment escrow, AI matching, similarity review, and corner cases.

## Pre-demo checks

- Confirm `.env.local` points to the intended disposable/demo Supabase project.
- Apply and inspect every migration in order; do not push to a production project.
- Create an administrator, sponsor, researcher/mentor, and student through Supabase Auth; grant roles through the protected admin workflow.
- Exercise both allowed and denied access to a confidential project resource with separate accounts.
- Verify no dashboard is showing local mock values as database-backed data.
- Do not record a money transfer, escrow, copied-content detection, AI generation, or ledger tamper-verification demonstration unless those exact paths have been implemented and tested.
