begin;

create table if not exists public.role_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  requested_role public.app_role not null check (requested_role <> 'ADMIN'),
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  decided_by uuid references public.profiles (id),
  decision_notes text,
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  unique (user_id, requested_role, status)
);

create index if not exists role_access_requests_status_created_idx
  on public.role_access_requests (status, requested_at desc);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);
create unique index if not exists skills_name_lower_unique_idx
  on public.skills (lower(name));

insert into public.skills (name, description) values
  ('Python', 'Python programming and scripting.'),
  ('Data Analysis', 'Data cleaning, exploration, and statistical analysis.'),
  ('Machine Learning', 'Machine learning model development and evaluation.'),
  ('Research Methods', 'Research design, methodology, and reproducibility.'),
  ('Scientific Writing', 'Technical and academic writing.'),
  ('Experimental Design', 'Design and execution of controlled experiments.'),
  ('SQL', 'Relational database querying and data modeling.'),
  ('Data Visualization', 'Communicating evidence with clear visualizations.')
on conflict do nothing;

alter table public.user_skills
  add column if not exists skill_id uuid references public.skills (id) on delete set null;
update public.user_skills claimed
set skill_id = catalog.id
from public.skills catalog
where claimed.skill_id is null
  and lower(trim(claimed.skill_name)) = lower(catalog.name);

alter table public.skill_verifications
  add column if not exists verification_method text not null default 'ADMIN_REVIEW',
  add column if not exists evidence jsonb not null default '{}'::jsonb,
  add column if not exists submitted_at timestamptz not null default now();

alter table public.project_charters
  add column if not exists status text not null default 'ACTIVE',
  add column if not exists updated_at timestamptz not null default now();

alter table public.project_access_requests
  add column if not exists charter_version integer;
alter table public.project_access_grants
  add column if not exists charter_version integer;
alter table public.project_documents
  add column if not exists access_level text not null default 'RESTRICTED';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.project_charters'::regclass
      and conname = 'project_charters_status_check'
  ) then
    alter table public.project_charters
      add constraint project_charters_status_check
      check (status in ('DRAFT', 'ACTIVE', 'SUPERSEDED'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.project_documents'::regclass
      and conname = 'project_documents_access_level_check'
  ) then
    alter table public.project_documents
      add constraint project_documents_access_level_check
      check (access_level in ('PUBLIC', 'TEAM', 'RESTRICTED', 'CONFIDENTIAL'));
  end if;
end;
$$;

alter table public.projects
  add column if not exists summary text not null default '',
  add column if not exists required_skills text[] not null default '{}',
  add column if not exists reward_rules jsonb not null default '{}'::jsonb,
  add column if not exists access_rules jsonb not null default '{}'::jsonb,
  add column if not exists submitted_at timestamptz,
  add column if not exists reviewed_at timestamptz,
  add column if not exists published_at timestamptz;

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('DIRECT', 'PROJECT')),
  project_id uuid references public.projects (id) on delete cascade,
  title text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  check ((kind = 'PROJECT' and project_id is not null) or (kind = 'DIRECT' and project_id is null))
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id),
  body text not null check (length(trim(body)) between 1 and 10000),
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create index if not exists conversation_members_user_idx
  on public.conversation_members (user_id, conversation_id);
create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at desc);

create table if not exists public.agent_executions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  project_id uuid not null references public.projects (id) on delete cascade,
  agent_type text not null,
  input jsonb not null,
  output jsonb,
  permissions jsonb not null default '{}'::jsonb,
  status text not null default 'QUEUED'
    check (status in ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'DENIED', 'CANCELLED')),
  error text,
  token_usage jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists agent_executions_project_created_idx
  on public.agent_executions (project_id, started_at desc);
create index if not exists agent_executions_user_created_idx
  on public.agent_executions (user_id, started_at desc);

create table if not exists public.contribution_analyses (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid not null references public.contributions (id) on delete cascade,
  execution_id uuid references public.agent_executions (id) on delete set null,
  recommendation jsonb not null,
  report text not null default '',
  recommended_credits integer check (recommended_credits is null or recommended_credits >= 0),
  created_at timestamptz not null default now()
);
create index if not exists contribution_analyses_contribution_created_idx
  on public.contribution_analyses (contribution_id, created_at desc);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  score numeric(5, 2) not null check (score between 0 and 100),
  reasons jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  unique (user_id, project_id)
);
create index if not exists recommendations_user_score_idx
  on public.recommendations (user_id, score desc);

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles profile
    where profile.id = (select auth.uid()) and profile.role = 'ADMIN'
  );
$$;

create or replace function public.can_manage_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.projects project
    where project.id = p_project_id
      and (
        project.sponsor_user_id = (select auth.uid())
        or project.lead_researcher_id = (select auth.uid())
        or public.is_platform_admin()
        or exists (
          select 1 from public.organization_members member
          where member.organization_id = project.sponsor_organization_id
            and member.user_id = (select auth.uid())
            and member.role in ('OWNER', 'ADMIN')
        )
      )
  );
$$;

create or replace function public.can_access_project(
  p_project_id uuid,
  p_resource_key text default 'overview'
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.projects project
    where project.id = p_project_id
      and (
        public.can_manage_project(project.id)
        or exists (
          select 1
          from public.project_members member
          where member.project_id = project.id
            and member.user_id = (select auth.uid())
            and member.status = 'ACTIVE'
            and (
              p_resource_key = 'overview'
              or (member.role = 'SPONSOR'
                and p_resource_key in ('charter', 'reports', 'milestones', 'contributions', 'activity'))
              or exists (
                select 1 from public.project_access_grants grant_row
                where grant_row.project_id = project.id
                  and grant_row.user_id = (select auth.uid())
                  and (
                    grant_row.resource_key = p_resource_key
                    or grant_row.resource_key = '*'
                    or (grant_row.resource_key = 'contributions' and p_resource_key like 'contribution:%')
                  )
                  and grant_row.revoked_at is null
                  and (grant_row.expires_at is null or grant_row.expires_at > now())
              )
            )
        )
        or exists (
          select 1 from public.project_tasks task
          where task.project_id = project.id
            and task.assigned_to = (select auth.uid())
            and p_resource_key = 'task:' || task.id::text
        )
      )
  );
$$;

create or replace function public.is_conversation_member(p_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.conversation_members member
    where member.conversation_id = p_conversation_id
      and member.user_id = (select auth.uid())
  );
$$;

create or replace function public.try_uuid(p_value text)
returns uuid
language plpgsql
immutable
strict
set search_path = ''
as $$
begin
  return p_value::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

create or replace function public.can_access_project_storage_object(
  p_bucket_id text,
  p_object_name text,
  p_write boolean default false
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_project_id uuid := public.try_uuid(split_part(p_object_name, '/', 1));
  v_resource_key text := split_part(p_object_name, '/', 2);
  v_task_id uuid;
begin
  if (select auth.uid()) is null or v_project_id is null then
    return false;
  end if;
  v_task_id := public.try_uuid(substring(v_resource_key from 6));

  if p_write then
    return public.can_manage_project(v_project_id)
      or (
        p_bucket_id in ('research-files', 'contribution-evidence')
        and public.can_access_project(v_project_id, v_resource_key)
      )
      or (
        p_bucket_id = 'contribution-evidence'
        and v_resource_key like 'task:%'
        and v_task_id is not null
        and exists (
          select 1 from public.project_tasks task
          where task.id = v_task_id
            and task.project_id = v_project_id
            and task.assigned_to = (select auth.uid())
        )
      );
  end if;

  return exists (
    select 1
    from public.project_documents document
    join public.projects project on project.id = document.project_id
    where document.project_id = v_project_id
      and document.object_path = p_object_name
      and document.access_level = 'PUBLIC'
      and project.status in ('PUBLISHED', 'ACTIVE')
  )
  or public.can_access_project(v_project_id, v_resource_key)
  or (
    p_bucket_id = 'contribution-evidence'
    and v_resource_key like 'task:%'
    and v_task_id is not null
    and exists (
      select 1 from public.project_tasks task
      where task.id = v_task_id
        and task.project_id = v_project_id
        and task.assigned_to = (select auth.uid())
    )
  );
end;
$$;

create or replace function public.create_conversation(
  p_kind text,
  p_project_id uuid default null,
  p_title text default null,
  p_member_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  conversation_id uuid;
  members uuid[];
  member_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentication required';
  end if;
  if p_kind not in ('DIRECT', 'PROJECT') then
    raise exception 'Conversation kind must be DIRECT or PROJECT';
  end if;
  if coalesce(array_length(p_member_ids, 1), 0) > 49 then
    raise exception 'A conversation may have at most 50 members';
  end if;
  if p_kind = 'PROJECT' and (
    p_project_id is null
    or not (
      public.can_manage_project(p_project_id)
      or exists (
        select 1 from public.project_members member
        where member.project_id = p_project_id
          and member.user_id = actor_id
          and member.status = 'ACTIVE'
      )
    )
  ) then
    raise exception 'Active project membership is required';
  end if;
  if p_kind = 'DIRECT' and p_project_id is not null then
    raise exception 'Direct conversations cannot reference a project';
  end if;

  select array_agg(distinct participant_id)
  into members
  from unnest(coalesce(p_member_ids, '{}'::uuid[]) || array[actor_id]) as participant_id;

  if p_kind = 'DIRECT' and cardinality(members) <> 2 then
    raise exception 'Direct conversations require exactly two participants';
  end if;
  if exists (
    select 1 from unnest(members) participant_id
    where not exists (select 1 from public.profiles profile where profile.id = participant_id)
  ) then
    raise exception 'Conversation participant does not exist';
  end if;
  if p_kind = 'PROJECT' and exists (
    select 1 from unnest(members) participant_id
    where not exists (
      select 1 from public.project_members member
      where member.project_id = p_project_id
        and member.user_id = participant_id
        and member.status = 'ACTIVE'
    )
    and not exists (
      select 1 from public.projects project
      where project.id = p_project_id and project.sponsor_user_id = participant_id
    )
  ) then
    raise exception 'Every project conversation participant must belong to the project';
  end if;

  insert into public.conversations (kind, project_id, title, created_by)
  values (p_kind, p_project_id, nullif(trim(coalesce(p_title, '')), ''), actor_id)
  returning id into conversation_id;

  foreach member_id in array members loop
    insert into public.conversation_members (conversation_id, user_id)
    values (conversation_id, member_id);
  end loop;

  return conversation_id;
end;
$$;

create or replace function public.capture_message_notification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recipient record;
  conversation_project_id uuid;
begin
  select conversation.project_id
  into conversation_project_id
  from public.conversations conversation
  where conversation.id = new.conversation_id;

  for recipient in
    select member.user_id
    from public.conversation_members member
    where member.conversation_id = new.conversation_id
      and member.user_id <> new.sender_id
  loop
    insert into public.notifications (user_id, project_id, title, message)
    values (
      recipient.user_id,
      conversation_project_id,
      'New message',
      'You received a new message.'
    );
  end loop;
  return new;
end;
$$;

drop trigger if exists messages_create_notifications on public.messages;
create trigger messages_create_notifications
  after insert on public.messages
  for each row execute function public.capture_message_notification();

create or replace function public.capture_access_request_charter_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select charter.version
  into new.charter_version
  from public.project_charters charter
  where charter.project_id = new.project_id
  order by charter.version desc
  limit 1;
  return new;
end;
$$;

drop trigger if exists access_request_capture_charter_version on public.project_access_requests;
create trigger access_request_capture_charter_version
  before insert on public.project_access_requests
  for each row execute function public.capture_access_request_charter_version();

create or replace function public.capture_access_grant_charter_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select charter.version
  into new.charter_version
  from public.project_charters charter
  where charter.project_id = new.project_id
  order by charter.version desc
  limit 1;
  return new;
end;
$$;

drop trigger if exists access_grant_capture_charter_version on public.project_access_grants;
create trigger access_grant_capture_charter_version
  before insert on public.project_access_grants
  for each row execute function public.capture_access_grant_charter_version();

create or replace function public.submit_project_for_review(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  project_row public.projects%rowtype;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;
  select * into project_row
  from public.projects project
  where project.id = p_project_id
  for update;
  if not found or project_row.status not in ('DRAFT', 'REJECTED') then
    raise exception 'Project is not in a submittable state';
  end if;
  if not (
    project_row.sponsor_user_id = (select auth.uid())
    or public.can_manage_organization(project_row.sponsor_organization_id)
  ) then
    raise exception 'Project sponsor authorization is required';
  end if;
  if project_row.sponsor_organization_id is null or not exists (
    select 1 from public.organizations organization
    where organization.id = project_row.sponsor_organization_id
      and organization.verification_status = 'APPROVED'
  ) then
    raise exception 'A verified organization is required before project review';
  end if;
  if not exists (
    select 1 from public.project_charters charter
    where charter.project_id = p_project_id and charter.status = 'ACTIVE'
  ) then
    raise exception 'An active project charter is required';
  end if;

  update public.projects
  set status = 'SUBMITTED', submitted_at = now(), reviewed_at = null, updated_at = now()
  where id = p_project_id;

  insert into public.audit_events (
    actor_id, project_id, action, resource_type, resource_id, outcome, details
  ) values (
    (select auth.uid()), p_project_id, 'PROJECT_SUBMITTED',
    'project', p_project_id::text, 'SUCCESS', 'Project submitted for administrator review.'
  );
end;
$$;

create or replace function public.decide_project_review(
  p_project_id uuid,
  p_decision text,
  p_review_notes text default ''
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  project_row public.projects%rowtype;
begin
  if (select auth.uid()) is null or not public.is_platform_admin() then
    raise exception 'Administrator access is required';
  end if;
  if p_decision not in ('APPROVE', 'REJECT') then
    raise exception 'Project decision must be APPROVE or REJECT';
  end if;

  select * into project_row
  from public.projects project
  where project.id = p_project_id
  for update;
  if not found or project_row.status <> 'SUBMITTED' then
    raise exception 'Submitted project not found';
  end if;
  if p_decision = 'APPROVE' and not exists (
    select 1 from public.organizations organization
    where organization.id = project_row.sponsor_organization_id
      and organization.verification_status = 'APPROVED'
  ) then
    raise exception 'The sponsoring organization is not verified';
  end if;

  update public.projects
  set status = case when p_decision = 'APPROVE' then 'ADMIN_VERIFIED' else 'REJECTED' end,
      reviewed_at = now(),
      updated_at = now()
  where id = p_project_id;

  insert into public.audit_events (
    actor_id, project_id, action, resource_type, resource_id, outcome, details, metadata
  ) values (
    (select auth.uid()), p_project_id, 'PROJECT_REVIEW_DECIDED',
    'project', p_project_id::text, 'SUCCESS',
    nullif(trim(coalesce(p_review_notes, '')), ''),
    jsonb_build_object('decision', p_decision)
  );
end;
$$;

create or replace function public.publish_project(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  project_row public.projects%rowtype;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;
  select * into project_row
  from public.projects project
  where project.id = p_project_id
  for update;
  if not found or project_row.status <> 'ADMIN_VERIFIED' then
    raise exception 'Only administrator-verified projects can be published';
  end if;
  if not (
    project_row.sponsor_user_id = (select auth.uid())
    or public.can_manage_organization(project_row.sponsor_organization_id)
  ) then
    raise exception 'Project sponsor authorization is required';
  end if;
  if not exists (
    select 1 from public.organizations organization
    where organization.id = project_row.sponsor_organization_id
      and organization.verification_status = 'APPROVED'
  ) then
    raise exception 'The sponsoring organization is not verified';
  end if;

  update public.projects
  set status = 'PUBLISHED', published_at = now(), updated_at = now()
  where id = p_project_id;

  insert into public.audit_events (
    actor_id, project_id, action, resource_type, resource_id, outcome, details
  ) values (
    (select auth.uid()), p_project_id, 'PROJECT_PUBLISHED',
    'project', p_project_id::text, 'SUCCESS', 'Administrator-verified project published.'
  );
end;
$$;

create or replace function public.update_sponsored_project(
  p_project_id uuid,
  p_title text,
  p_objective text,
  p_summary text,
  p_required_skills text[],
  p_reward_rules jsonb,
  p_access_rules jsonb,
  p_charter jsonb
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  project_row public.projects%rowtype;
  current_version integer;
  next_version integer;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;
  select * into project_row
  from public.projects project
  where project.id = p_project_id
  for update;
  if not found or project_row.status not in ('DRAFT', 'REJECTED') then
    raise exception 'Only draft or rejected projects may be edited';
  end if;
  if not (
    project_row.sponsor_user_id = (select auth.uid())
    or public.can_manage_organization(project_row.sponsor_organization_id)
  ) then
    raise exception 'Project sponsor authorization is required';
  end if;
  if length(trim(coalesce(p_title, ''))) not between 1 and 200
    or length(trim(coalesce(p_objective, ''))) not between 1 and 8000
    or length(trim(coalesce(p_summary, ''))) > 4000
    or jsonb_typeof(coalesce(p_reward_rules, '{}'::jsonb)) <> 'object'
    or jsonb_typeof(coalesce(p_access_rules, '{}'::jsonb)) <> 'object'
    or jsonb_typeof(coalesce(p_charter, '{}'::jsonb)) <> 'object' then
    raise exception 'Project details and charter are invalid';
  end if;

  select max(charter.version) into current_version
  from public.project_charters charter
  where charter.project_id = p_project_id;
  next_version := coalesce(current_version, 0) + 1;

  update public.project_charters
  set status = 'SUPERSEDED', updated_at = now()
  where project_id = p_project_id and status = 'ACTIVE';

  insert into public.project_charters (project_id, version, charter, created_by, status, updated_at)
  values (p_project_id, next_version, p_charter, (select auth.uid()), 'ACTIVE', now());

  update public.projects
  set title = trim(p_title),
      objective = trim(p_objective),
      summary = trim(coalesce(p_summary, '')),
      required_skills = coalesce(p_required_skills, '{}'),
      reward_rules = coalesce(p_reward_rules, '{}'::jsonb),
      access_rules = coalesce(p_access_rules, '{}'::jsonb),
      updated_at = now()
  where id = p_project_id;

  insert into public.audit_events (
    actor_id, project_id, action, resource_type, resource_id, outcome, details, metadata
  ) values (
    (select auth.uid()), p_project_id, 'PROJECT_CHARTER_VERSION_CREATED',
    'project_charter', p_project_id::text, 'SUCCESS',
    'Sponsor updated the draft project and appended a charter version.',
    jsonb_build_object('version', next_version, 'previous_version', current_version)
  );
  return next_version;
end;
$$;

create or replace function public.decide_role_access_request(
  p_request_id uuid,
  p_decision text,
  p_decision_notes text default ''
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_row public.role_access_requests%rowtype;
begin
  if (select auth.uid()) is null or not public.is_platform_admin() then
    raise exception 'Administrator access is required';
  end if;
  if p_decision not in ('APPROVED', 'REJECTED') then
    raise exception 'Decision must be APPROVED or REJECTED';
  end if;

  select * into request_row
  from public.role_access_requests request
  where request.id = p_request_id
  for update;
  if not found or request_row.status <> 'PENDING' then
    raise exception 'Pending role access request not found';
  end if;

  update public.role_access_requests
  set status = p_decision,
      decided_by = (select auth.uid()),
      decision_notes = nullif(trim(coalesce(p_decision_notes, '')), ''),
      decided_at = now()
  where id = p_request_id;

  if p_decision = 'APPROVED' then
    update public.profiles
    set role = request_row.requested_role, updated_at = now()
    where id = request_row.user_id;
  end if;

  insert into public.audit_events (
    actor_id, action, resource_type, resource_id, outcome, details, metadata
  ) values (
    (select auth.uid()), 'ROLE_ACCESS_REQUEST_DECIDED',
    'role_access_request', request_row.id::text, 'SUCCESS',
    coalesce(nullif(trim(p_decision_notes), ''), 'Role access request decision recorded.'),
    jsonb_build_object(
      'user_id', request_row.user_id,
      'requested_role', request_row.requested_role,
      'decision', p_decision
    )
  );
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role_text text;
  requested_role public.app_role;
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Gardenia user'
    )
  )
  on conflict (id) do nothing;

  requested_role_text := upper(trim(coalesce(new.raw_user_meta_data ->> 'requested_role', '')));
  if requested_role_text in ('RESEARCHER', 'MENTOR', 'SPONSOR') then
    requested_role := requested_role_text::public.app_role;
    insert into public.role_access_requests (user_id, requested_role)
    values (new.id, requested_role)
    on conflict do nothing;
  end if;
  return new;
end;
$$;

alter table public.role_access_requests enable row level security;
alter table public.skills enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.agent_executions enable row level security;
alter table public.contribution_analyses enable row level security;
alter table public.recommendations enable row level security;

drop policy if exists "Projects are visible only with overview access" on public.projects;
create policy "Published projects are discoverable; private projects require access"
  on public.projects for select to authenticated
  using (status in ('PUBLISHED', 'ACTIVE') or public.can_access_project(id, 'overview'));

drop policy if exists "Users can update their own non-role profile fields" on public.profiles;
create policy "Users can update their own non-role profile fields"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
revoke update on public.profiles from authenticated;
grant update (full_name, institution, bio, avatar_path, updated_at) on public.profiles to authenticated;

drop policy if exists "Authenticated users can request project resource access" on public.project_access_requests;
create policy "Authenticated users can request published project access"
  on public.project_access_requests for insert to authenticated
  with check (
    requester_id = (select auth.uid())
    and status = 'PENDING'
    and exists (
      select 1 from public.projects project
      where project.id = project_id and project.status in ('PUBLISHED', 'ACTIVE')
    )
  );

drop policy if exists "Project documents are visible only at their approved resource scope" on public.project_documents;
create policy "Project documents are visible only at their authorized scope"
  on public.project_documents for select to authenticated
  using (
    (access_level = 'PUBLIC' and exists (
      select 1 from public.projects project
      where project.id = project_id and project.status in ('PUBLISHED', 'ACTIVE')
    ))
    or public.can_access_project(project_id, resource_key)
    or (task_id is not null and exists (
      select 1 from public.project_tasks task
      where task.id = task_id and task.assigned_to = (select auth.uid())
    ))
  );

drop policy if exists "Role access requests are visible to their subject and admins" on public.role_access_requests;
create policy "Role access requests are visible to their subject and admins"
  on public.role_access_requests for select to authenticated
  using (user_id = (select auth.uid()) or public.is_platform_admin());
drop policy if exists "Role access requests are immutable outside administrator workflow" on public.role_access_requests;
create policy "Role access requests are immutable outside administrator workflow"
  on public.role_access_requests for all to authenticated
  using (false) with check (false);

drop policy if exists "Authenticated users can read the skill catalog" on public.skills;
create policy "Authenticated users can read the skill catalog"
  on public.skills for select to authenticated using (true);
drop policy if exists "Administrators can manage the skill catalog" on public.skills;
create policy "Administrators can manage the skill catalog"
  on public.skills for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "Conversation members can read conversations" on public.conversations;
create policy "Conversation members can read conversations"
  on public.conversations for select to authenticated
  using (public.is_conversation_member(id));
drop policy if exists "Conversation members can read memberships" on public.conversation_members;
create policy "Conversation members can read memberships"
  on public.conversation_members for select to authenticated
  using (public.is_conversation_member(conversation_id));
drop policy if exists "Members can update their own conversation read cursor" on public.conversation_members;
create policy "Members can update their own conversation read cursor"
  on public.conversation_members for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
drop policy if exists "Conversation participants can read messages" on public.messages;
create policy "Conversation participants can read messages"
  on public.messages for select to authenticated
  using (public.is_conversation_member(conversation_id));
drop policy if exists "Conversation participants can send messages as themselves" on public.messages;
create policy "Conversation participants can send messages as themselves"
  on public.messages for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and public.is_conversation_member(conversation_id)
  );
drop policy if exists "Messages are immutable" on public.messages;
create policy "Messages are immutable"
  on public.messages for update to authenticated using (false) with check (false);
drop policy if exists "Messages cannot be deleted" on public.messages;
create policy "Messages cannot be deleted"
  on public.messages for delete to authenticated using (false);

drop policy if exists "Users can read authorized AI execution records" on public.agent_executions;
create policy "Users can read authorized AI execution records"
  on public.agent_executions for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.can_access_project(project_id, 'ai-workspace')
  );
drop policy if exists "AI execution records are written only by the server gateway" on public.agent_executions;
create policy "AI execution records are written only by the server gateway"
  on public.agent_executions for all to authenticated
  using (false) with check (false);
drop policy if exists "Contribution analyses are visible to contributors and reviewers" on public.contribution_analyses;
create policy "Contribution analyses are visible to contributors and reviewers"
  on public.contribution_analyses for select to authenticated
  using (
    exists (
      select 1 from public.contributions contribution
      where contribution.id = contribution_id
        and (
          contribution.author_id = (select auth.uid())
          or public.can_access_project(contribution.project_id, 'contribution:' || contribution.id::text)
        )
    )
  );
drop policy if exists "Contribution analyses are written by the analysis service only" on public.contribution_analyses;
create policy "Contribution analyses are written by the analysis service only"
  on public.contribution_analyses for all to authenticated
  using (false) with check (false);
drop policy if exists "Users can read their project recommendations" on public.recommendations;
create policy "Users can read their project recommendations"
  on public.recommendations for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists "Recommendations are generated by the server only" on public.recommendations;
create policy "Recommendations are generated by the server only"
  on public.recommendations for all to authenticated
  using (false) with check (false);

drop trigger if exists contribution_analyses_are_append_only on public.contribution_analyses;
create trigger contribution_analyses_are_append_only
  before update or delete on public.contribution_analyses
  for each row execute function public.prevent_immutable_record_changes();

revoke all on public.role_access_requests, public.skills, public.conversations,
  public.conversation_members, public.messages, public.agent_executions,
  public.contribution_analyses, public.recommendations
  from anon, authenticated;
grant select on public.role_access_requests to authenticated;
grant select, insert, update, delete on public.skills to authenticated;
grant select on public.conversations to authenticated;
grant select on public.conversation_members to authenticated;
grant update (last_read_at) on public.conversation_members to authenticated;
grant select, insert on public.messages to authenticated;
grant select on public.agent_executions to authenticated;
grant select on public.contribution_analyses to authenticated;
grant select on public.recommendations to authenticated;

revoke all on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to authenticated;
revoke all on function public.is_conversation_member(uuid) from public, anon;
grant execute on function public.is_conversation_member(uuid) to authenticated;
revoke all on function public.try_uuid(text) from public, anon;
grant execute on function public.try_uuid(text) to authenticated;
revoke all on function public.can_access_project_storage_object(text, text, boolean) from public, anon;
grant execute on function public.can_access_project_storage_object(text, text, boolean) to authenticated;
revoke all on function public.create_conversation(text, uuid, text, uuid[]) from public, anon;
grant execute on function public.create_conversation(text, uuid, text, uuid[]) to authenticated;
revoke all on function public.submit_project_for_review(uuid) from public, anon;
grant execute on function public.submit_project_for_review(uuid) to authenticated;
revoke all on function public.decide_project_review(uuid, text, text) from public, anon;
grant execute on function public.decide_project_review(uuid, text, text) to authenticated;
revoke all on function public.publish_project(uuid) from public, anon;
grant execute on function public.publish_project(uuid) to authenticated;
revoke all on function public.update_sponsored_project(uuid, text, text, text, text[], jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.update_sponsored_project(uuid, text, text, text, text[], jsonb, jsonb, jsonb) to authenticated;
revoke all on function public.decide_role_access_request(uuid, text, text) from public, anon;
grant execute on function public.decide_role_access_request(uuid, text, text) to authenticated;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.capture_message_notification() from public, anon, authenticated;
revoke all on function public.capture_access_request_charter_version() from public, anon, authenticated;
revoke all on function public.capture_access_grant_charter_version() from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-resources', 'project-resources', false, 52428800, array['application/pdf', 'text/plain', 'text/markdown', 'image/jpeg', 'image/png', 'application/zip']),
  ('research-files', 'research-files', false, 104857600, array['application/pdf', 'text/plain', 'text/markdown', 'image/jpeg', 'image/png', 'application/zip', 'application/json']),
  ('contribution-evidence', 'contribution-evidence', false, 52428800, array['application/pdf', 'text/plain', 'text/markdown', 'image/jpeg', 'image/png', 'application/zip']),
  ('profile-files', 'profile-files', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Members can read organization verification objects" on storage.objects;
create policy "Members can read organization verification objects"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'organization-verification'
    and (
      split_part(name, '/', 2) = (select auth.uid())::text
      or public.can_manage_organization(public.try_uuid(split_part(name, '/', 1)))
      or public.is_platform_admin()
    )
  );
drop policy if exists "Organization owners can upload their verification objects" on storage.objects;
create policy "Organization owners can upload their verification objects"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'organization-verification'
    and split_part(name, '/', 2) = (select auth.uid())::text
    and public.can_manage_organization(public.try_uuid(split_part(name, '/', 1)))
  );
drop policy if exists "Verification objects cannot be overwritten" on storage.objects;
create policy "Verification objects cannot be overwritten"
  on storage.objects for update to authenticated using (false) with check (false);
drop policy if exists "Verification objects cannot be deleted" on storage.objects;
create policy "Verification objects cannot be deleted"
  on storage.objects for delete to authenticated using (false);

drop policy if exists "Project resources follow project access" on storage.objects;
create policy "Project resources follow project access"
  on storage.objects for select to authenticated
  using (
    bucket_id in ('project-resources', 'research-files', 'contribution-evidence')
    and public.can_access_project_storage_object(bucket_id, name)
  );
drop policy if exists "Authorized project members can upload scoped resources" on storage.objects;
create policy "Authorized project members can upload scoped resources"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('project-resources', 'research-files', 'contribution-evidence')
    and public.can_access_project_storage_object(bucket_id, name, true)
  );
drop policy if exists "Project resource objects cannot be overwritten" on storage.objects;
create policy "Project resource objects cannot be overwritten"
  on storage.objects for update to authenticated using (false) with check (false);
drop policy if exists "Project resource objects cannot be deleted" on storage.objects;
create policy "Project resource objects cannot be deleted"
  on storage.objects for delete to authenticated using (false);

drop policy if exists "Users can manage their own private profile files" on storage.objects;
create policy "Users can manage their own private profile files"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'profile-files'
    and split_part(name, '/', 1) = (select auth.uid())::text
  )
  with check (
    bucket_id = 'profile-files'
    and split_part(name, '/', 1) = (select auth.uid())::text
  );

notify pgrst, 'reload schema';
commit;
