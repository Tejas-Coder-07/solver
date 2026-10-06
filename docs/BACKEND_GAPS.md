# Backend gaps

This document records controls that still use browser-local state or sample data rather than persistent backend operations. API-backed actions require a signed-in account and valid database records.

The additive backend migrations and API routes provide foundations for project review/publication, role-access requests, private project files, conversations, messages, notifications, recommendations and AI execution records. All six migrations have been applied to the configured Supabase demo project and the core tables are present. Authorization and end-to-end workflows still need testing with real role accounts. The database currently has no profiles or projects; existing browser-side demo fixtures have not been deleted.

## Shared shell

| Screen/control | Current behavior | Backend needed |
| --- | --- | --- |
| Global search | Searches authorized projects, people, tasks, and local pages through the search API. | Search indexing and broader ranking are not implemented. |
| Theme toggle | Persists the selected theme in browser storage. | None unless the preference should follow the account across devices. |
| Email-only role entry | In development, enter an email and choose Student, Researcher, Mentor, Sponsor, or Admin to preview the existing sample workspace without verification. This demo cookie cannot authorize protected database APIs. Real account sign-in remains available separately. | None for the local preview; real records require a verified Supabase account. |
| Messages | Sponsor, researcher, mentor, and admin message pages load conversations, mark them read, create direct/project conversations, and send persisted messages through authenticated APIs. | Unread counts, participant display names, real-time updates, pagination, and student message navigation. |
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
| Access Requests | Uses the existing authenticated request-decision API. | Valid authenticated requests and backend records; no new decision API is required. |

## Student

| Screen/control | Current behavior | Backend needed |
| --- | --- | --- |
| Task progress control | Progress is held in dashboard-local state. | Task progress persistence. |
| Sample task submission | Updates the preview locally because sample tasks do not have backend UUIDs. | Real task/project records and contribution submission for persistent submissions. |
| Skills & Verification | Displays sample skills and local verification progress. | Skill evidence records and verification workflow. |
| Credits | Displays the preview balance/history. | Credit ledger and account-specific history. |
| Mentor Feedback / reply | Feedback and replies are local sample state. | Feedback records and reply persistence. |
| Notifications | Loads and marks notifications read through existing APIs when authenticated; failures are shown in the preview. | Valid account and notification records; no new notification API is required. |
| AI Assistant | Calls the existing mesh-invoke API; an unconfigured or unauthenticated service reports an error rather than fabricating a response. | Configured AI runtime and authorized project context. |
| Switch to Live | A development-only control; only opens the live dashboard for a matching authenticated role. | None; keep the production route authenticated. |

## Mentor

| Screen/control | Current behavior | Backend needed |
| --- | --- | --- |
| Today's Schedule / Calendar | Uses sample events and local detail panels. | Calendar and schedule persistence. |
| Candidate Matching / candidate profiles | Uses sample candidates and local profile details. | Candidate search, matching, and profile data. |
| Contribution Review: Request Changes / Reject | Updates preview state only. | Review decision API for these outcomes. |
| Contribution Review: Approve | Uses the existing reviews API. Failed requests preserve the item and show an error; preview records may not be valid backend records. | Authenticated reviewer and valid contribution IDs/data; no new approval API is required. |
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
| Organization verification | Uses the existing decision API. Errors keep the request visible and are surfaced. | Authenticated admin and valid verification records; no new decision API is required. |
| User role changes | Uses the existing admin role API. Errors restore the prior role and are surfaced. | Authenticated admin and valid user IDs; no new role API is required. |
| AI Mesh Monitor | Uses the local mesh registry/sample telemetry. | Live worker health and monitoring data. |

## Researcher

No additional researcher-specific local mutation controls were introduced in this dashboard pass. Researcher menu destinations that show previews, sample counts, or generic empty states still need the corresponding live query and mutation APIs where applicable. Existing authenticated researcher routes remain subject to their current server-side authorization and data requirements.
