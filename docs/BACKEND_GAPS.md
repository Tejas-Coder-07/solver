# Backend gaps

This document records controls that still use browser-local state or sample data rather than persistent backend operations. API-backed actions require a signed-in account and valid database records.

## Demo-mode interaction behavior

In development, role routes opened with the demo cookie are handled by the local preview UI. Demo actions do not call protected Supabase APIs or change server records. The visible Demo Mode control exits the preview; the account menu switches among Student, Researcher, Mentor, Sponsor, and Admin. Browser-local changes are scoped to the demo email and stored under the versioned `gardenia-demo:v1:` key prefix. The seeded fixtures remain present and are overlaid with demo decisions; removing a demo session does not delete them.

Implemented local workflows include task completion, joining a project, access and mentorship requests, contribution drafts, skill verification progress, notification read state, message drafts, sponsor proposal decisions, mentor contribution review decisions, admin project and organization decisions, user role/status changes, and announcement drafts. Important approve/reject/cancel operations ask for confirmation and update their row immediately. These are presentation interactions, not proof of authorization or backend approval.

The additive backend migrations and API routes provide foundations for project review/publication, role-access requests, private project files, conversations, messages, notifications, recommendations and AI execution records. All six migrations have been applied to the configured Supabase demo project and the core tables are present. Authorization and end-to-end workflows still need testing with real role accounts. The database currently has no profiles or projects; existing browser-side demo fixtures have not been deleted.

## Shared shell

| Screen/control | Current behavior | Backend needed |
| --- | --- | --- |
| Global search | Searches navigation and local project, people, and task fixtures in Demo Mode; authenticated sessions use the search API. | Search indexing and broader ranking are not implemented. |
| Theme toggle | Persists the selected theme in browser storage. | None unless the preference should follow the account across devices. |
| Email-only role entry | In development, enter an email and choose Student, Researcher, Mentor, Sponsor, or Admin to preview the existing sample workspace without verification. This demo cookie cannot authorize protected database APIs. Real account sign-in remains available separately. | None for the local preview; real records require a verified Supabase account. |
| Messages | Demo role routes search sample conversations and save sent messages in browser-local state. Authenticated messaging APIs remain separate and are not exercised by Demo Mode. | Durable demo-independent conversation records and authenticated-flow end-to-end testing. |
| Generic role-page empty states | Authenticated pages without connected records show empty states instead of preview fallbacks. Several legacy role pages still use sample data; see role sections below. | Per-page queries and mutations for the remaining preview modules. |
| Signup role request | Requested non-admin roles are persisted for administrator review; Admin > User Management includes approve/reject controls through the protected role-decision function. | End-to-end verification with administrator and signup accounts. |
| Project lifecycle | Sponsors can submit projects for review; administrators can approve/reject; sponsors can publish approved projects. Charter edits append versions through the project API. | Complete edit form and end-to-end verification with role accounts. |

## Sponsor

| Screen/control | Current behavior | Backend needed |
| --- | --- | --- |
| Create New Funding Call | Form validates and saves to dashboard-local state only. | Funding-call persistence and management API. |
| Proposal Shortlist / Decline | Updates the proposal state locally. | Proposal decision API and durable status. |
| Upcoming Reviews / View Calendar | Opens sample review details or a calendar page; no calendar records are stored. | Review scheduling and calendar data. |
| Funding Allocation | Donut segments filter the local legend; View Details opens a sample breakdown. | Funding and allocation ledger. |
| Research Impact | Legend toggles local chart series; View Report opens the reports section. | Persisted impact metrics and report generation. |
| Credits Awarded / Recent Contributions | Displays sample amounts and contribution rows. | Credit ledger and contribution records. |
| Switch Organization | Changes the selected organization in local state. | Organization membership and persisted active-organization selection. |
| Charter Templates | Displays dashboard sample content; no template CRUD is connected. | Charter-template storage and management. |
| Payments & Rewards | Reads authorized persisted credit-ledger entries. Explicitly does not represent credits as money or claim that an escrow/payment occurred. | Real-money escrow and payout provider, reconciliation, and payment audit workflow. |
| Impact & Reports, Researchers, AI Insights, Settings | Sections use preview content or empty states. | Analytics, researcher directory, insights, and account settings services. |
| Access Requests | Demo decisions are confirmed and persisted in local browser state. Authenticated accounts may use the existing request-decision API with valid records. | Valid authenticated requests and end-to-end backend decision testing. |

## Student

| Screen/control | Current behavior | Backend needed |
| --- | --- | --- |
| Task progress control | Marking a sample task done updates its status and persists it locally. | Task progress persistence for authenticated tasks. |
| Sample contribution | New Contribution opens a form and saves a local draft; sample tasks have no backend UUID. | Real task/project records and contribution submission for persistent submissions. |
| Skills & Verification | Start verification updates a local progress state. | Skill evidence records and verification workflow. |
| Credits | Displays the preview balance/history. | Credit ledger and account-specific history. |
| Mentor Feedback / reply | Feedback and replies are local sample state. | Feedback records and reply persistence. |
| Notifications | Demo notices can be marked read and persist in the browser; authenticated pages use the existing API. | Valid account and notification records; no new notification API is required. |
| AI Assistant | Demo prompts show local preview feedback and do not call protected APIs. | Configured AI runtime and authorized project context for a real response. |
| Switch to Live | A development-only control; only opens the live dashboard for a matching authenticated role. | None; keep the production route authenticated. |

## Mentor

| Screen/control | Current behavior | Backend needed |
| --- | --- | --- |
| Today's Schedule / Calendar | Uses sample events and local detail panels. | Calendar and schedule persistence. |
| Candidate Matching / candidate profiles | Uses sample candidates and local profile details. | Candidate search, matching, and profile data. |
| Contribution Review: Approve / Request Changes / Reject | Decisions are confirmed, displayed on the item, and saved locally in Demo Mode. | Authenticated reviewer and valid contribution IDs/data; no new approval API is required. |
| Credits Recommended | Displays sample recommendations. | Credit recommendation and ledger workflow. |
| AI Insights, Skill Verification, Task Management, Mentor Reports, Resources | Uses local sample panels or empty states. | Insights, verification, task, reporting, and resource services. |
| Messages | Conversation list, read state, direct/project conversation creation, and sending use authenticated APIs. | Unread counts, participant display names, real-time updates, pagination, and student navigation. |

## Admin

| Screen/control | Current behavior | Backend needed |
| --- | --- | --- |
| User Growth, Project Status, Contribution Activity charts | Uses sample chart data; legend and filters are local. | Analytics queries over persisted platform records. |
| Pending Project Approvals: Approve / Reject | Updates preview state only. | Project approval workflow and audit trail. |
| Add New User | Form validates and adds a local preview user. | User provisioning/invitation API and audit logging. |
| Send Announcement / Announcements | Creates local preview announcement state. | Announcement storage, delivery, and recipient targeting. |
| Platform Health / Security Events | Uses sample service and event details. | Monitoring, security-event ingestion, and audit queries. |
| Reports, Platform Settings, Help & Support, Messages | Preview content or empty states. | Reporting, settings persistence, support, and messaging services. |
| Organization verification | Demo decisions are confirmed and saved locally. Authenticated admin pages use the existing decision API. | Authenticated admin and valid verification records; no new decision API is required. |
| User role changes | Uses the existing admin role API. Errors restore the prior role and are surfaced. | Authenticated admin and valid user IDs; no new role API is required. |
| AI Mesh Monitor | Uses the local mesh registry/sample telemetry. | Live worker health and monitoring data. |

## Researcher

No additional researcher-specific local mutation controls were introduced in this dashboard pass. Researcher menu destinations that show previews, sample counts, or generic empty states still need the corresponding live query and mutation APIs where applicable. Existing authenticated researcher routes remain subject to their current server-side authorization and data requirements.
