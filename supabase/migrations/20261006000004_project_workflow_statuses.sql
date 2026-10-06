alter type public.project_status add value if not exists 'SUBMITTED';
alter type public.project_status add value if not exists 'ADMIN_VERIFIED';
alter type public.project_status add value if not exists 'PUBLISHED';
alter type public.project_status add value if not exists 'REJECTED';
alter type public.contribution_status add value if not exists 'REVISION_REQUIRED';
alter type public.skill_verification_status add value if not exists 'NOT_STARTED';
alter type public.skill_verification_status add value if not exists 'IN_REVIEW';
