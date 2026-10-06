'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Award,
  BellRing,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCheck,
  ClipboardCheck,
  Coins,
  Database,
  FileCheck2,
  FileClock,
  FileText,
  FlaskConical,
  FolderKanban,
  HeartHandshake,
  Microscope,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/types';
import { useRole } from '@/context/RoleContext';
import {
  ActivityFeed,
  DocumentCard,
  EmptyState,
  MockAction,
  NotificationPanel,
  Panel,
  ProgressBar,
  ProjectCard,
  SkillCard,
  StatCard,
  StatusBadge,
  TextLink,
  UserAvatar,
} from '@/components/ui/Gardenia';
import {
  demoActivity,
  demoAccessRequests,
  demoContributions,
  demoNotifications,
  demoPeople,
  demoProjects,
  demoSkills,
  demoStudentTasks,
  pageTitles,
  roleName,
} from '@/lib/mock-data';
import { cn } from '@/lib/cn';
import { useDemoState } from '@/lib/use-demo-state';

const knownRoles = new Set(['student', 'researcher', 'mentor', 'sponsor', 'admin']);
const roleBySlug: Record<string, UserRole> = {
  student: 'STUDENT',
  researcher: 'RESEARCHER',
  mentor: 'MENTOR',
  sponsor: 'SPONSOR',
  admin: 'ADMIN',
};

const projectSections = [
  ['Overview', 'overview'],
  ['Charter', 'charter'],
  ['Team', 'team'],
  ['Research', 'research'],
  ['Implementation', 'implementation'],
  ['Experiments', 'experiments'],
  ['AI Workspace', 'ai-workspace'],
  ['Evidence', 'evidence'],
  ['Access', 'access'],
  ['Milestones', 'milestones'],
  ['Contributions', 'contributions'],
  ['Activity', 'activity'],
] as const;

const titleCase = (value: string) => pageTitles[value] ?? value.split('-').map((word) => word[0]?.toUpperCase() + word.slice(1)).join(' ');
const projectPath = (id: string, section = 'overview') => `/projects/${id}/${section}`;
type MentorshipRequest = { id: string; studentName: string; email: string; mentor: string; status: 'Pending' | 'Approved' | 'Rejected' };

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-700">{eyebrow}</p>
        <h1 className="text-balance mt-1 text-2xl font-extrabold text-slate-950">{title}</h1>
        <p className="text-pretty mt-1 max-w-2xl text-xs leading-5 text-slate-600">{description}</p>
      </div>
      {action}
    </header>
  );
}

function Dashboard({ role }: { role: UserRole }) {
  const student = role === 'STUDENT';
  const researcher = role === 'RESEARCHER';
  const mentor = role === 'MENTOR';
  const sponsor = role === 'SPONSOR';
  const admin = role === 'ADMIN';
  const person = role === 'SPONSOR' ? 'MedScan Labs' : role === 'ADMIN' ? 'Gardenia' : role === 'MENTOR' ? 'Prof. Sharma' : role === 'RESEARCHER' ? 'Dr. Ananya' : 'Sharath';
  const [applications, setApplications] = useState(12);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [mentorDecisions, setMentorDecisions] = useDemoState<Record<string, string>>('mentor-dashboard-decisions', {});
  const [mentorshipRequests, setMentorshipRequests] = useDemoState<MentorshipRequest[]>('mentorship-requests', []);
  const stats = student
    ? [
        { label: 'Active Projects', value: '2', detail: 'You are collaborating on', icon: FolderKanban, tone: 'violet' },
        { label: 'Pending Tasks', value: '3', detail: 'Across your projects', icon: ClipboardCheck, tone: 'blue' },
        { label: 'Access Request', value: '1', detail: 'Waiting for a decision', icon: BriefcaseBusiness, tone: 'amber' },
        { label: 'Skill Verifications', value: '5', detail: '3 verified skills', icon: ShieldCheck, tone: 'emerald' },
      ]
    : researcher
      ? [
          { label: 'Active Projects', value: '4', detail: 'Across 3 domains', icon: FolderKanban, tone: 'blue' },
          { label: 'Applications', value: '2', detail: 'Awaiting a response', icon: FileClock, tone: 'violet' },
          { label: 'Publications', value: '6', detail: 'Research outputs', icon: BookOpen, tone: 'emerald' },
          { label: 'Access Requests', value: '1', detail: 'Pending review', icon: BriefcaseBusiness, tone: 'amber' },
        ]
      : mentor
        ? [
            { label: 'Active Projects', value: '5', detail: 'Mentoring 3 teams', icon: FolderKanban, tone: 'blue' },
            { label: 'Pending Approvals', value: '18', detail: '4 reviews · 9 applicants', icon: ClipboardCheck, tone: 'amber' },
            { label: 'Contributors', value: '24', detail: 'Across your teams', icon: Users, tone: 'emerald' },
            { label: 'Credits Earned', value: '420', detail: 'This research cycle', icon: Coins, tone: 'violet' },
          ]
        : sponsor
          ? [
              { label: 'Sponsored Projects', value: '3', detail: 'Across 2 research areas', icon: FolderKanban, tone: 'amber' },
              { label: 'Research Problems', value: '12', detail: 'Published opportunities', icon: Microscope, tone: 'blue' },
              { label: 'Pending Requests', value: '2', detail: 'Researcher applications', icon: Users, tone: 'violet' },
              { label: 'Active Teams', value: '5', detail: 'Researchers and mentors', icon: HeartHandshake, tone: 'emerald' },
            ]
          : [
              { label: 'Total Users', value: '128', detail: '+12 this month', icon: Users, tone: 'blue' },
              { label: 'Active Projects', value: '15', detail: 'Across all research areas', icon: FolderKanban, tone: 'emerald' },
              { label: 'Pending Verifications', value: '12', detail: 'Need admin review', icon: ShieldCheck, tone: 'amber' },
              { label: 'Organizations', value: '8', detail: 'Verified partners', icon: BriefcaseBusiness, tone: 'violet' },
            ];

  const leftPanel = student || researcher ? 'Active Projects' : sponsor ? 'Sponsored Projects' : mentor ? 'Pending Approvals' : 'Verification Queue';
  const statDestinations: Record<string, string> = {
    'Active Projects': `/${role.toLowerCase()}/projects`,
    'Pending Tasks': '/student/my-work',
    'Access Requests': `/${role.toLowerCase()}/access-requests`,
    'Skill Verifications': '/student/skills',
    Applications: '/researcher/applications',
    Publications: '/researcher/contributions',
    'Pending Approvals': '/mentor/queue',
    Contributors: '/mentor/students',
    'Credits Earned': '/mentor/credits',
    'Sponsored Projects': '/sponsor/projects',
    'Research Problems': '/sponsor/research-problems',
    'Pending Requests': '/sponsor/access-requests',
    'Active Teams': '/sponsor/researchers',
    'Total Users': '/admin/users',
    'Pending Verifications': '/admin/verification',
    Organizations: '/admin/organizations',
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <PageIntro
        eyebrow={roleName(role)}
        title={`${student ? 'Good morning' : researcher ? 'Welcome back' : sponsor ? 'Welcome' : admin ? 'System Overview' : 'Welcome back'}, ${person} ${student ? '👋' : ''}`}
        description={admin ? 'Monitor platform health, verification, and research governance.' : sponsor ? 'Track your research projects and real-world impact.' : mentor ? 'Guide teams and help great research move forward.' : researcher ? 'Continue your research journey and collaborative work.' : 'Continue making an impact in real research.'}
        action={student ? <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-right shadow-sm"><p className="text-[10px] text-slate-500">Current Credits</p><p className="text-lg font-extrabold tabular-nums text-slate-900">420 <span className="text-[9px] font-semibold text-emerald-700">↑ 12%</span></p></div> : sponsor ? <MockAction onClick={() => window.location.assign('/sponsor/research-problems')}><Plus className="mr-1 inline size-3" /> Publish a research problem</MockAction> : undefined}
      />

      <section aria-label={`${roleName(role)} summary`} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} href={statDestinations[stat.label]} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.95fr)]">
        <Panel title={leftPanel} action={<TextLink href={role === 'ADMIN' ? '/admin/verification' : role === 'SPONSOR' ? '/sponsor/projects' : `/${role.toLowerCase()}/projects`}>View all</TextLink>}>
          {(student || researcher || sponsor) ? (
            <div className="grid gap-3 md:grid-cols-2">
              {demoProjects.slice(0, 2).map((project) => (
                <ProjectCard key={project.id} project={project} href={projectPath(project.id)} />
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {(mentor && mentorshipRequests.some((request) => request.status === 'Pending')
                ? mentorshipRequests.filter((request) => request.status === 'Pending').map((request) => ({
                    name: request.studentName,
                    role: `Mentorship request · ${request.mentor}`,
                    requestId: request.id,
                  }))
                : demoPeople.slice(0, 3).map((personItem) => ({ name: personItem.name, role: personItem.role, requestId: null }))).map((personItem, index) => (
                <li key={personItem.requestId ?? personItem.name} className="flex items-center gap-2.5 py-2.5">
                  <UserAvatar name={personItem.name} tone={['rose', 'blue', 'amber'][index]} />
                  <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-slate-800">{admin ? ['MedScan Labs (Company)', 'Northstar Research', 'Dr. K. Mehta'][index] : personItem.name}</p><p className="truncate text-[9px] text-slate-500">{admin ? 'Organization verification' : personItem.role}</p></div>
                  {admin ? <Link href="/admin/verification" className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">Review queue</Link> : <div className="flex items-center gap-1">{mentorDecisions[personItem.name] ? <StatusBadge tone={mentorDecisions[personItem.name] === 'Approved' ? 'emerald' : 'rose'}>{mentorDecisions[personItem.name]}</StatusBadge> : <><MockAction tone="neutral" onClick={() => setSelectedPerson(personItem.name)}>View</MockAction><MockAction tone="neutral" onClick={() => { if (!window.confirm(`Reject ${personItem.name}'s request?`)) return; if (personItem.requestId) setMentorshipRequests((items) => items.map((item) => item.id === personItem.requestId ? { ...item, status: 'Rejected' } : item)); else setMentorDecisions((current) => ({ ...current, [personItem.name]: 'Rejected' })); setApplications((count) => Math.max(0, count - 1)); }}>Reject</MockAction><MockAction onClick={() => { if (!window.confirm(`Approve ${personItem.name}'s request?`)) return; if (personItem.requestId) setMentorshipRequests((items) => items.map((item) => item.id === personItem.requestId ? { ...item, status: 'Approved' } : item)); else setMentorDecisions((current) => ({ ...current, [personItem.name]: 'Approved' })); setApplications((count) => Math.max(0, count - 1)); }}>Approve</MockAction></>}</div>}
                </li>
              ))}
            </ul>
          )}
          {selectedPerson && <div role="dialog" aria-label="Request details" className="mt-3 flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-[10px] text-indigo-900"><span>Sample request details for {selectedPerson}: awaiting mentor review.</span><button type="button" onClick={() => setSelectedPerson(null)} className="font-semibold underline">Close</button></div>}
          {mentor && <div className="mt-3 text-right"><StatusBadge tone="amber">{applications} pending approvals</StatusBadge></div>}
        </Panel>
        <Panel title={student ? 'Notifications' : admin ? 'Recent Audit Activity' : mentor ? 'Recent Reviews' : sponsor ? 'Recent Applications' : 'Recent Research Activity'} action={<TextLink href={student ? '/student/notifications' : `/${role.toLowerCase()}/messages`}>View all</TextLink>}>
          <NotificationPanel items={demoNotifications.slice(0, 4)} />
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Panel title={student ? 'My Skills' : researcher ? 'Research Activity' : mentor ? 'Recommended Contributors · Skill matching' : sponsor ? 'Project Progress' : 'Platform Activity'} action={<TextLink href={student ? '/student/skills' : mentor ? '/mentor/skills' : sponsor ? '/sponsor/projects' : '/admin/audit'}>View all</TextLink>} className="xl:col-span-1">
          {student ? (
            <div className="grid grid-cols-2 gap-2">{demoSkills.slice(0, 4).map((skill) => <SkillCard key={skill.name} {...skill} />)}</div>
          ) : sponsor ? (
            <div className="space-y-3">{demoProjects.slice(0, 3).map((project) => <div key={project.id}><div className="mb-1 flex justify-between gap-2 text-[10px]"><span className="truncate font-semibold text-slate-800">{project.title}</span><span className="shrink-0 tabular-nums text-slate-500">{project.progress}%</span></div><ProgressBar value={project.progress} /></div>)}</div>
          ) : mentor ? (
            <ul className="divide-y divide-slate-100">{demoPeople.slice(0, 3).map((personItem) => <li key={personItem.name} className="flex items-center gap-2 py-2"><UserAvatar name={personItem.name} tone="blue" size="size-7" /><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-slate-800">{personItem.name}</p><p className="truncate text-[9px] text-slate-500">{personItem.skills.join(' · ')}</p></div><StatusBadge tone="emerald">Matched</StatusBadge></li>)}</ul>
          ) : (
            <ActivityFeed items={demoActivity.slice(0, 3)} />
          )}
        </Panel>
        <Panel title={researcher ? 'AI Research Activity' : mentor ? 'Skill Matching' : sponsor ? 'Rewards & Credits' : student ? 'Recent Activity' : 'Recent Audit Activity'} action={<TextLink href={researcher ? '/researcher/ai-workspace' : mentor ? '/mentor/skills' : sponsor ? '/sponsor/rewards' : student ? '/student/my-work' : '/admin/audit'}>View all</TextLink>} className="xl:col-span-1">
          {sponsor ? <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3"><Wallet className="size-5 text-amber-700" aria-hidden="true" /><div><p className="text-sm font-bold tabular-nums text-slate-900">12,400 credits</p><p className="text-[10px] text-slate-600">Reward pool across sponsored projects</p></div></div> : <ActivityFeed items={demoActivity.slice(0, 3)} />}
        </Panel>
        <Panel title={student ? 'Recent Activity' : researcher ? 'My Research Projects' : mentor ? 'Credits' : sponsor ? 'Active Teams' : 'System Health'} action={<TextLink href={student ? '/student/contributions' : researcher ? '/researcher/projects' : mentor ? '/mentor/credits' : sponsor ? '/sponsor/reports' : '/admin/security'}>View all</TextLink>} className="xl:col-span-1">
          {student || researcher ? <ActivityFeed items={demoActivity.slice(0, 3)} /> : sponsor ? <ActivityFeed items={demoActivity.slice(1, 4)} /> : admin ? <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3"><CheckCheck className="size-5 text-emerald-700" aria-hidden="true" /><div><p className="text-sm font-bold text-slate-900">All systems operational</p><p className="text-[10px] text-slate-600">Last checked a few minutes ago</p></div></div> : <div className="flex items-center justify-between rounded-lg bg-violet-50 p-3"><div><p className="text-lg font-bold tabular-nums text-slate-900">420</p><p className="text-[10px] text-slate-600">Credits earned this cycle</p></div><Coins className="size-5 text-violet-700" aria-hidden="true" /></div>}
        </Panel>
      </section>

      <p className="text-center text-[9px] text-slate-400">GARDENIA preview · Dashboard numbers and activity are realistic sample data.</p>
    </div>
  );
}

function StudentDashboard() {
  const projects = demoProjects.slice(0, 2);
  return (
    <div className="mx-auto max-w-[1500px] space-y-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-700">Student / Contributor</p>
          <h1 className="text-balance mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">Good morning, Sharath 👋</h1>
          <p className="text-pretty mt-1 text-[11px] text-slate-600">Continue making an impact in real research.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/student/projects" className="rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-indigo-700">Explore Projects</Link>
          <Link href="/student/my-work" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 hover:bg-slate-50">View My Tasks</Link>
          <Link href="/student/credits" className="min-w-32 rounded-xl border border-slate-200 bg-white px-4 py-2 text-right shadow-sm">
            <span className="block text-[9px] text-slate-500">Current Credits</span>
            <span className="text-base font-extrabold tabular-nums text-slate-950">420</span>
            <span className="ml-2 text-[9px] font-semibold text-emerald-700">Top 12% ↑</span>
          </Link>
        </div>
      </header>

      <section aria-label="Student dashboard summary" className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Projects" value="2" detail="You're part of 2 research teams" icon={FolderKanban} tone="violet" href="/student/projects" />
        <StatCard label="Pending Tasks" value="3" detail="1 due within 48 hours" icon={ClipboardCheck} tone="blue" href="/student/my-work" />
        <StatCard label="Access Requests" value="1" detail="Waiting for project approval" icon={BriefcaseBusiness} tone="amber" href="/student/access" />
        <StatCard label="Skill Verifications" value="5" detail="3 skills verified" icon={ShieldCheck} tone="emerald" href="/student/skills" />
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <Panel title="Active Projects" action={<TextLink href="/student/projects">View all</TextLink>}>
          <div className="grid gap-2 md:grid-cols-2">
            {projects.map((project) => <ProjectCard key={project.id} project={project} href={projectPath(project.id)} />)}
          </div>
        </Panel>
        <Panel title="Recent Notifications" action={<TextLink href="/student/notifications">View all</TextLink>}>
          <NotificationPanel items={demoNotifications.slice(0, 4)} />
        </Panel>
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        <Panel title="My Skills" action={<TextLink href="/student/skills">View all</TextLink>}>
          <div className="grid gap-2 sm:grid-cols-2">
            {demoSkills.slice(0, 4).map((skill) => <SkillCard key={skill.name} {...skill} />)}
          </div>
        </Panel>
        <Panel title="Recent Activity" action={<TextLink href="/student/my-work">View all</TextLink>}>
          <ActivityFeed items={demoActivity} />
        </Panel>
      </section>
      <p className="text-center text-[9px] text-slate-400">Student workspace preview · dashboard counts and activity are sample data.</p>
    </div>
  );
}

function ProjectListing({ role }: { role: UserRole }) {
  const [query, setQuery] = useState('');
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [publishNotice, setPublishNotice] = useState('');
  const [newProjects, setNewProjects] = useDemoState<{ id: string; title: string; summary: string }[]>('sponsor-project-drafts', []);
  const projects = demoProjects.filter((project) => `${project.title} ${project.domain} ${project.sponsor}`.toLowerCase().includes(query.toLowerCase()));
  const publishProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTitle.trim();
    const summary = newSummary.trim();
    if (!title || !summary) return;
    setNewProjects((items) => [{ id: `draft-${Date.now()}`, title, summary }, ...items]);
    setPublishNotice(`“${title}” was saved as a demo research opportunity.`);
    setNewTitle('');
    setNewSummary('');
    setShowPublishForm(false);
  };
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <PageIntro eyebrow={roleName(role)} title={role === 'SPONSOR' ? 'Your research projects' : 'Explore research projects'} description="Discover collaborative research with clear goals, shared evidence, and teams built to make an impact." action={role === 'SPONSOR' && <MockAction onClick={() => setShowPublishForm((show) => !show)}><Plus className="mr-1 inline size-3" /> {showPublishForm ? 'Close form' : 'Publish research problem'}</MockAction>} />
      {publishNotice && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">{publishNotice}</div>}
      {showPublishForm && role === 'SPONSOR' && <form onSubmit={publishProject} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><label className="text-[10px] font-semibold text-slate-700">Research title<input required value={newTitle} onChange={(event) => setNewTitle(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" /></label><label className="text-[10px] font-semibold text-slate-700">Public summary<textarea required value={newSummary} onChange={(event) => setNewSummary(event.target.value)} className="mt-1 block min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" /></label><button type="submit" className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-[10px] font-semibold text-white">Save demo opportunity</button></form>}
      <label className="flex max-w-lg items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm"><Search className="size-4 text-slate-400" aria-hidden="true" /><span className="sr-only">Search projects</span><input className="w-full text-xs outline-none placeholder:text-slate-400" placeholder="Search projects, research areas, sponsors..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => <ProjectCard key={project.id} project={project} href={projectPath(project.id)} />)}
        {newProjects.filter((project) => `${project.title} ${project.summary}`.toLowerCase().includes(query.toLowerCase())).map((project) => <article key={project.id} className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm"><StatusBadge tone="emerald">Demo draft</StatusBadge><h2 className="mt-3 text-sm font-bold text-slate-900">{project.title}</h2><p className="mt-2 text-xs leading-5 text-slate-600">{project.summary}</p><p className="mt-3 text-[9px] text-slate-500">This opportunity is saved locally and is not publicly submitted.</p></article>)}
      </div>
      {projects.length === 0 && newProjects.length === 0 && <EmptyState title="No matching projects" description="Try a broader term such as climate, medical imaging, or materials." action={<MockAction tone="neutral" onClick={() => setQuery('')}>Clear search</MockAction>} />}
    </div>
  );
}

function AIWorkspace() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const agents = [
    ['Research Agent', 'Finds relevant literature and evidence', 'Ready', Microscope],
    ['Analysis Agent', 'Summarizes datasets and research patterns', 'Ready', BrainCircuit],
    ['Integrity Agent', 'Checks research methodology and evidence quality', 'Ready', ShieldCheck],
    ['Contribution Agent', 'Reviews contribution detail and evidence', 'Ready', FileCheck2],
    ['Reporting Agent', 'Drafts project summaries and progress reports', 'Ready', FileText],
  ] as const;
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <PageIntro eyebrow="AI Mesh · UI preview" title="AI Workspace" description="A project-aware AI mesh concept for research support. Agent cards and reports are illustrative only; no AI runtime is connected." />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><Activity className="size-5" aria-hidden="true" /></span><div><p className="text-xs font-bold text-slate-900">AI Mesh status</p><p className="text-[10px] text-slate-500">Concept preview · execution disabled</p></div></div>
        <StatusBadge tone="amber">UI only · No agents running</StatusBadge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map(([name, detail, status, Icon]) => <article key={name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><span className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><Icon className="size-4" aria-hidden="true" /></span><StatusBadge tone="emerald">{status}</StatusBadge></div><h2 className="mt-3 text-xs font-bold text-slate-900">{name}</h2><p className="text-pretty mt-1 text-[10px] leading-4 text-slate-500">{detail}</p><MockAction tone="neutral" onClick={() => setSelectedAgent(selectedAgent === name ? null : name)}>{selectedAgent === name ? 'Hide capabilities' : 'View capabilities'}</MockAction>{selectedAgent === name && <p role="status" className="mt-3 rounded-lg bg-indigo-50 p-2 text-[9px] leading-4 text-indigo-900">{name} can help organize research evidence and generate suggestions. This is a UI-only demo; no agent is invoked.</p>}</article>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Recent AI reports"><ActivityFeed items={[
          { name: 'Brain MRI model analysis', detail: 'AI for Medical Image Analysis · sample report', time: '2 hr ago', initials: 'AN', tone: 'violet' },
          { name: 'Battery dataset summary', detail: 'Sustainable Battery Material Discovery', time: 'Yesterday', initials: 'RS', tone: 'blue' },
          { name: 'Research integrity checklist', detail: 'Climate Change Data Analysis', time: '2 days ago', initials: 'IN', tone: 'emerald' },
        ]} /></Panel>
        <Panel title="AI analysis · sample">
          <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-4"><div className="flex items-center gap-2"><Sparkles className="size-4 text-indigo-700" aria-hidden="true" /><p className="text-xs font-bold text-slate-900">Medical image model analysis</p></div><p className="text-pretty mt-2 text-[10px] leading-5 text-slate-600">The sample review highlights dataset representativeness, evaluation consistency, and the need to report sensitivity alongside accuracy. This illustrative analysis is not a generated model output.</p><div className="mt-3 flex gap-2"><StatusBadge tone="blue">Quality review</StatusBadge><StatusBadge tone="amber">Mentor review pending</StatusBadge></div></div>
        </Panel>
      </div>
    </div>
  );
}

function SkillsPage({ role = 'STUDENT' }: { role?: UserRole }) {
  const [verification, setVerification] = useDemoState<Record<string, string>>('skill-verification', {});
  const matching = role === 'MENTOR';
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <PageIntro eyebrow="Skills & growth" title={matching ? 'Skills & Matching' : 'My Skills'} description={matching ? 'Compare researcher skill profiles with active project needs. Matching suggestions are illustrative and do not run through an AI service.' : 'A transparent view of skills, self-assessments, and mentor review. Verification shown here is sample data only.'} action={!matching && <MockAction onClick={() => setVerification((current) => ({ ...current, started: 'true', 'Computer Vision': 'In progress' }))}><Plus className="mr-1 inline size-3" /> Start a skill test</MockAction>} />
      {verification.started && <div role="status" className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">Sample skill verification started. Your progress is saved in this browser.</div>}
      {matching ? <div className="grid gap-3 md:grid-cols-2">{demoPeople.map((person) => <article key={person.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><UserAvatar name={person.name} tone="blue" size="size-10" /><div><h2 className="text-xs font-bold text-slate-900">{person.name}</h2><p className="text-[10px] text-slate-500">{person.role}</p></div><StatusBadge tone="emerald">{person.status}</StatusBadge></div><div className="mt-3 flex flex-wrap gap-1.5">{person.skills.map((skill) => <StatusBadge key={skill} tone="blue">{skill}</StatusBadge>)}</div><p className="mt-3 text-[9px] text-slate-500">Suggested for AI for Medical Image Analysis · sample match</p></article>)}</div> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{demoSkills.map((skill) => { const status = verification[skill.name] ?? skill.status; return <article key={skill.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-2"><h2 className="text-xs font-bold text-slate-900">{skill.name}</h2><StatusBadge tone={status === 'Verified' ? 'emerald' : 'amber'}>{status}</StatusBadge></div><p className="mt-2 text-[10px] text-slate-500">{skill.detail}</p>{skill.score > 0 && <div className="mt-3"><ProgressBar value={skill.score} label="Assessment score" /></div>}<div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-[9px] text-slate-500">AI Mesh analysis · illustrative</span><span className="text-[10px] font-semibold tabular-nums text-slate-700">{skill.score ? `${skill.score}%` : 'Not tested'}</span></div><button type="button" disabled={status === 'Verified' || status === 'In progress'} onClick={() => setVerification((current) => ({ ...current, [skill.name]: 'In progress', started: 'true' }))} className="mt-3 w-full rounded-lg border border-indigo-200 px-3 py-2 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50">{status === 'Verified' ? 'Verified' : status === 'In progress' ? 'Verification started' : 'Start verification'}</button></article>; })}</div>}
    </div>
  );
}

function StudentProjects() {
  const [filter, setFilter] = useState('All Projects');
  const [query, setQuery] = useState('');
  const [joinedProjects, setJoinedProjects] = useDemoState<string[]>('joined-projects', []);
  const tabs = ['All Projects', 'Active', 'Recruiting', 'Planning'];
  const filtered = demoProjects.filter((project) => {
    const textMatch = `${project.title} ${project.sponsor} ${project.domain}`.toLowerCase().includes(query.toLowerCase());
    const statusMatch = filter === 'All Projects'
      || (filter === 'Active' && project.status === 'In progress')
      || (filter === 'Recruiting' && project.status === 'Recruiting')
      || (filter === 'Planning' && project.status === 'Planning');
    return textMatch && statusMatch;
  });
  return (
    <div className="mx-auto max-w-[1500px] space-y-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <PageIntro eyebrow="Student workspace" title="Projects" description="Discover research projects and opportunities that match your interests." action={<Link href="/student/my-work" className="rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-indigo-700"><Plus className="mr-1 inline size-3" /> Find a Project</Link>} />
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Filter projects">{tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={filter === tab} onClick={() => setFilter(tab)} className={cn('shrink-0 rounded-lg px-3 py-2 text-[10px] font-semibold', filter === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>{tab}</button>)}</div>
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 sm:w-64"><Search className="size-3.5 text-slate-400" aria-hidden="true" /><span className="sr-only">Search projects</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full text-[10px] outline-none" placeholder="Search projects..." /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((project) => <article key={project.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><ProjectCard project={project} href={projectPath(project.id)} /><button type="button" disabled={joinedProjects.includes(project.id)} onClick={() => { if (window.confirm(`Request to join ${project.title}?`)) joinedProjects.includes(project.id) || setJoinedProjects((current) => [...current, project.id]); }} className="mt-2 w-full rounded-lg border border-indigo-200 px-3 py-2 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-50 disabled:text-emerald-700">{joinedProjects.includes(project.id) ? 'Join request submitted' : 'Request to join'}</button></article>)}</div>
      {filtered.length === 0 && <EmptyState title="No projects match this view" description="Change the filter or search for another research area." action={<MockAction tone="neutral" onClick={() => { setFilter('All Projects'); setQuery(''); }}>Show all projects</MockAction>} />}
    </div>
  );
}

function StudentMyWork() {
  const [filter, setFilter] = useState('All Tasks');
  const [projectFilter, setProjectFilter] = useState('All Projects');
  const [statuses, setStatuses] = useDemoState<Record<string, string>>('task-statuses', {});
  const tabs = ['All Tasks', 'In Progress', 'Completed', 'Drafts'];
  const tasks = demoStudentTasks.filter((task) => {
    const status = statuses[task.id] ?? task.status;
    const statusMatch = filter === 'All Tasks'
      || (filter === 'In Progress' && status === 'In Progress')
      || (filter === 'Completed' && status === 'Completed')
      || (filter === 'Drafts' && status === 'Not Started');
    return statusMatch && (projectFilter === 'All Projects' || task.project === projectFilter);
  });
  return (
    <div className="mx-auto max-w-[1500px] space-y-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <PageIntro eyebrow="Student workspace" title="My Work" description="Track assigned tasks, deadlines, and submissions across your projects." action={<Link href="/student/contributions" className="rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-indigo-700"><Plus className="mr-1 inline size-3" /> Submit Work</Link>} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Filter tasks">{tabs.map((tab) => <button type="button" role="tab" aria-selected={filter === tab} key={tab} onClick={() => setFilter(tab)} className={cn('shrink-0 rounded-lg px-3 py-2 text-[10px] font-semibold', filter === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>{tab}</button>)}</div>
        <label className="text-[10px] text-slate-500">Project <select aria-label="Filter tasks by project" value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] text-slate-700"><option>All Projects</option>{[...new Set(demoStudentTasks.map((task) => task.project))].map((project) => <option key={project}>{project}</option>)}</select></label>
      </div>
      <Panel title="Assigned Tasks" action={<span className="text-[9px] text-slate-500">{tasks.length} tasks</span>}>
        <div className="hidden grid-cols-[minmax(0,2fr)_1.2fr_0.7fr_0.8fr_0.6fr_0.7fr] gap-3 border-b border-slate-100 pb-2 text-[9px] font-semibold uppercase text-slate-500 md:grid"><span>Task</span><span>Project</span><span>Deadline</span><span>Status</span><span>Priority</span><span>Action</span></div>
        <ul className="divide-y divide-slate-100">{tasks.map((task) => {
          const status = statuses[task.id] ?? task.status;
          return <li key={task.id} className="grid gap-2 py-3 md:grid-cols-[minmax(0,2fr)_1.2fr_0.7fr_0.8fr_0.6fr_0.7fr] md:items-center md:gap-3"><div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-[9px] font-bold text-indigo-700">{task.icon}</span><span className="min-w-0"><span className="block truncate text-[10px] font-semibold text-slate-900">{task.title}</span><span className="block truncate text-[9px] text-slate-500 md:hidden">{task.project}</span></span></div><span className="hidden truncate text-[9px] text-slate-600 md:block">{task.project}</span><span className="text-[9px] text-slate-600">Due in {task.due}</span><StatusBadge tone={status === 'Completed' ? 'emerald' : status === 'In Progress' ? 'blue' : 'slate'}>{status}</StatusBadge><StatusBadge tone={task.priority === 'High' ? 'rose' : task.priority === 'Medium' ? 'amber' : 'slate'}>{task.priority}</StatusBadge><button type="button" disabled={status === 'Completed'} onClick={() => setStatuses((current) => ({ ...current, [task.id]: 'Completed' }))} className="w-fit rounded-lg border border-slate-200 px-2 py-1.5 text-[9px] font-semibold text-slate-700 hover:bg-slate-50 disabled:text-emerald-700">{status === 'Completed' ? 'Done' : 'Mark done'}</button></li>;
        })}</ul>
      </Panel>
      {tasks.length === 0 && <EmptyState title="No tasks in this filter" description="Choose another task status to see your assigned work." action={<MockAction tone="neutral" onClick={() => setFilter('All Tasks')}>View all tasks</MockAction>} />}
    </div>
  );
}

function StudentAIWorkspace() {
  const [activeTab, setActiveTab] = useState('Research Agent');
  const [prompt, setPrompt] = useState('');
  const [notice, setNotice] = useState('');
  const agents = ['Research Agent', 'Analysis Agent', 'Literature Agent', 'Code Agent'];
  const sessions = [
    ['MRI detection preliminary analysis', 'AI for Medical Image Analysis', '2 hours ago'],
    ['Dataset coverage review', 'AI for Medical Image Analysis', 'Yesterday'],
    ['Battery research notes', 'Sustainable Battery Material Discovery', '2 days ago'],
  ];
  return (
    <div className="mx-auto max-w-[1500px] space-y-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <PageIntro eyebrow="AI Mesh · UI preview" title="AI Workspace" description="Research assistants to organize research thoughts. Agent cards are visual concepts only; no AI service is connected." />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-100 p-3" role="tablist" aria-label="Select AI assistant">{agents.map((agent) => <button type="button" role="tab" aria-selected={activeTab === agent} key={agent} onClick={() => setActiveTab(agent)} className={cn('shrink-0 rounded-lg px-3 py-2 text-[10px] font-semibold', activeTab === agent ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100')}>{agent}</button>)}</div>
          <div className="p-4">
            <div className="mb-4 flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><Sparkles className="size-4" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold text-slate-900">{activeTab}</p><p className="text-[9px] text-slate-500">AI Mesh concept · sample session</p></div><StatusBadge tone="emerald">Available</StatusBadge></div>
            <div className="space-y-2 rounded-lg bg-slate-50 p-3"><p className="text-pretty rounded-lg border border-slate-200 bg-white p-3 text-[10px] leading-4 text-slate-700">How should we compare MRI model performance across the evaluation cohort?</p><p className="text-pretty ml-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-[10px] leading-4 text-slate-700">Consider reporting sensitivity and specificity alongside overall accuracy. Keep the data split fixed and document cohort composition so results remain interpretable and reproducible.</p>{notice && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-[9px] text-amber-900">{notice}</p>}</div>
            <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (prompt.trim()) { setNotice('Prompt saved in this local preview. No AI service was contacted.'); setPrompt(''); } }}><label className="sr-only" htmlFor="student-ai-prompt">Type your research prompt</label><input id="student-ai-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-[10px]" placeholder="Type your research prompt..." /><button type="submit" aria-label="Submit prompt to local preview" className="flex size-10 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"><Send className="size-4" aria-hidden="true" /></button></form>
          </div>
        </section>
        <div className="space-y-3">
          <Panel title="Recent Sessions" action={<StatusBadge tone="slate">3 sessions</StatusBadge>}><ul className="divide-y divide-slate-100">{sessions.map(([title, project, time]) => <li key={title} className="flex items-start gap-2.5 py-3 first:pt-1"><span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-700"><BrainCircuit className="size-3.5" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-slate-800">{title}</p><p className="truncate text-[9px] text-slate-500">{project}</p></div><span className="shrink-0 text-[9px] text-slate-400">{time}</span></li>)}</ul></Panel>
          <Panel title="Suggested Actions"><ul className="space-y-2">{['Compare model architectures', 'Summarize research literature', 'Generate experiment plan'].map((action) => <li key={action}><button type="button" onClick={() => { setActiveTab(action.includes('literature') ? 'Literature Agent' : action.includes('experiment') ? 'Analysis Agent' : 'Research Agent'); setNotice(`${action} selected. Add context above to continue.`); }} className="flex w-full items-center justify-between rounded-lg border border-slate-100 p-2 text-left text-[9px] font-medium text-slate-700 hover:bg-slate-50">{action}<ArrowRight className="size-3 text-slate-400" aria-hidden="true" /></button></li>)}</ul></Panel>
        </div>
      </div>
      <p className="text-center text-[9px] text-slate-400">Research prompts and AI responses are examples only.</p>
    </div>
  );
}

function StudentContributions() {
  const [period, setPeriod] = useState('This Year');
  const [detail, setDetail] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftProject, setDraftProject] = useState(demoProjects[0].title);
  const [contributions, setContributions] = useDemoState('student-contributions', demoContributions);
  const saveDraft = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = draftTitle.trim();
    if (!title) {
      setDetail('Add a contribution title before saving.');
      return;
    }
    setContributions((current) => [{
      id: `demo-contribution-${Date.now()}`,
      title,
      project: draftProject,
      type: 'Research',
      submitted: new Date().toLocaleDateString(),
      status: 'Draft',
      credits: null,
      suggestedCredits: null,
      reviewer: 'Not submitted',
    }, ...current]);
    setDetail(`“${title}” was saved as a draft.`);
    setDraftTitle('');
    setShowNewForm(false);
  };
  const chart = [
    { month: 'Jan', verified: 2, pending: 1 }, { month: 'Feb', verified: 3, pending: 1 },
    { month: 'Mar', verified: 4, pending: 2 }, { month: 'Apr', verified: 3, pending: 1 },
    { month: 'May', verified: 5, pending: 2 }, { month: 'Jun', verified: 4, pending: 1 },
  ];
  return (
    <div className="mx-auto max-w-[1500px] space-y-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <PageIntro eyebrow="Student workspace" title="Contributions" description="Track your research contributions, submissions, and verified impact." action={<MockAction onClick={() => setShowNewForm((show) => !show)}><Plus className="mr-1 inline size-3" /> {showNewForm ? 'Close form' : 'New Contribution'}</MockAction>} />
      {detail && <div role="status" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-[10px] text-indigo-800">{detail}</div>}
      {showNewForm && <form onSubmit={saveDraft} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end"><label className="text-[10px] font-semibold text-slate-700">Contribution title<input required value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" placeholder="Describe your work" /></label><label className="text-[10px] font-semibold text-slate-700">Project<select value={draftProject} onChange={(event) => setDraftProject(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">{demoProjects.map((project) => <option key={project.id}>{project.title}</option>)}</select></label><button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-[10px] font-semibold text-white hover:bg-indigo-700">Save draft</button></form>}
      <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total Contributions" value="18" detail="Across 2 projects" icon={FileCheck2} tone="blue" /><StatCard label="Verified" value="12" detail="Reviewed by mentors" icon={CheckCheck} tone="emerald" /><StatCard label="Pending Review" value="3" detail="Awaiting mentor feedback" icon={FileClock} tone="amber" /><StatCard label="Credits Earned" value="420" detail="Recognized contributions" icon={Coins} tone="violet" /></section>
      <Panel title="Contribution Overview" action={<select aria-label="Contribution period" value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[9px]"><option>This Year</option><option>Last 6 Months</option><option>All Time</option></select>}>
        <div className="flex h-36 items-end justify-around gap-3 border-b border-slate-100 px-2 pt-4" role="img" aria-label={`Monthly contribution activity, ${period}`}>{chart.map((month) => <div key={month.month} className="flex h-full min-w-7 flex-1 flex-col items-center justify-end gap-1"><div className="flex h-24 items-end gap-1"><span className="w-3 rounded-t bg-indigo-500" style={{ height: `${month.verified * 16}px` }} /><span className="w-3 rounded-t bg-teal-300" style={{ height: `${month.pending * 16}px` }} /></div><span className="text-[9px] text-slate-500">{month.month}</span></div>)}</div>
        <div className="mt-2 flex gap-4 text-[9px] text-slate-500"><span><i className="mr-1 inline-block size-2 rounded-sm bg-indigo-500" />Verified</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-teal-300" />Pending review</span></div>
      </Panel>
      <Panel title="My Contributions" action={<span className="text-[9px] text-slate-500">{contributions.length} records</span>}><ul className="divide-y divide-slate-100">{contributions.map((contribution) => <li key={contribution.id} className="grid gap-2 py-3 md:grid-cols-[minmax(0,1.8fr)_0.8fr_0.9fr_0.7fr_0.7fr_0.6fr] md:items-center md:gap-3"><div className="flex min-w-0 items-center gap-2"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><FileText className="size-4" aria-hidden="true" /></span><span className="min-w-0"><span className="block truncate text-[10px] font-semibold text-slate-900">{contribution.title}</span><span className="block truncate text-[9px] text-slate-500">{contribution.project}</span></span></div><StatusBadge tone="blue">{contribution.type}</StatusBadge><span className="text-[9px] text-slate-500">{contribution.submitted}</span><StatusBadge tone={contribution.status === 'Verified' ? 'emerald' : contribution.status === 'Under Review' ? 'amber' : 'slate'}>{contribution.status}</StatusBadge><span className="text-[9px] text-slate-600">{contribution.credits ? `+${contribution.credits} credits` : `Suggested ${contribution.suggestedCredits ?? '—'}`}</span><button type="button" onClick={() => setDetail(`${contribution.title}: sample AI suggests ${contribution.suggestedCredits ?? 'no'} credits; mentor review is ${contribution.status === 'Verified' ? 'complete' : 'pending'}.`)} className="w-fit rounded-lg border border-slate-200 px-2 py-1.5 text-[9px] font-semibold text-indigo-700 hover:bg-indigo-50">View</button></li>)}</ul></Panel>
      <p className="text-center text-[9px] text-slate-400">AI analysis and credit suggestions are illustrative. Final decisions require human review.</p>
    </div>
  );
}

function StudentAccess() {
  const [filter, setFilter] = useState('My Access');
  const [requests, setRequests] = useDemoState('student-access-requests', demoAccessRequests);
  const [notice, setNotice] = useState('');
  const tabs = ['My Access', `Pending (${requests.filter((item) => item.status === 'Pending').length})`, `Approved (${requests.filter((item) => item.status === 'Approved').length})`, 'Rejected'];
  const visible = requests.filter((request) => filter === 'My Access'
    || (filter.startsWith('Pending') && request.status === 'Pending')
    || (filter.startsWith('Approved') && request.status === 'Approved')
    || (filter === 'Rejected' && request.status === 'Rejected'));
  return (
    <div className="mx-auto max-w-[1500px] space-y-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <PageIntro eyebrow="Student workspace" title="Access Requests" description="Manage access to project resources and datasets." action={<a href="#available-resources" className="rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-indigo-700"><Plus className="mr-1 inline size-3" /> Request Access</a>} />
      {notice && <div role="status" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-[10px] text-indigo-800">{notice}</div>}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm" role="tablist" aria-label="Filter access requests">{tabs.map((tab) => <button key={tab} role="tab" aria-selected={filter === tab} type="button" onClick={() => setFilter(tab)} className={cn('shrink-0 rounded-lg px-3 py-2 text-[10px] font-semibold', filter === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>{tab}</button>)}</div>
      <Panel title="Project Resource Access" action={<span className="text-[9px] text-slate-500">{visible.length} requests</span>}>      <ul className="divide-y divide-slate-100">{visible.map((request) => <li key={request.id} className="grid gap-2 py-3 md:grid-cols-[minmax(0,1.6fr)_0.65fr_0.7fr_0.75fr_0.8fr_0.55fr] md:items-center md:gap-3"><div className="min-w-0"><p className="truncate text-[10px] font-semibold text-slate-900">{request.name}</p><p className="truncate text-[9px] text-slate-500">{request.project}</p></div><span className="text-[9px] text-slate-600">{request.resource}</span><StatusBadge tone={request.status === 'Approved' ? 'emerald' : request.status === 'Rejected' || request.status === 'Cancelled' ? 'rose' : 'amber'}>{request.status}</StatusBadge><span className="text-[9px] text-slate-500">{request.updated}</span><span className="truncate text-[9px] text-slate-500">Reviewed by {request.reviewer}</span>{request.status === 'Pending' ? <button type="button" onClick={() => { if (!window.confirm(`Cancel the access request for ${request.name}?`)) return; setRequests((current) => current.map((item) => item.id === request.id ? { ...item, status: 'Cancelled' } : item)); setNotice(`${request.name}'s request was cancelled.`); }} className="w-fit rounded-lg border border-slate-200 px-2.5 py-1.5 text-[9px] font-semibold text-slate-700">Cancel</button> : <button type="button" onClick={() => setNotice(`${request.name}: ${request.resource} for ${request.project} · ${request.status}.`)} className="w-fit rounded-lg border border-slate-200 px-2.5 py-1.5 text-[9px] font-semibold text-slate-700">View</button>}</li>)}</ul></Panel>
      <div id="available-resources"><Panel title="Available Project Resources"><div className="grid gap-2 sm:grid-cols-2">{demoProjects.slice(0, 3).map((project) => { const pending = requests.some((request) => request.project === `For: ${project.title}` && request.status === 'Pending'); return <article key={project.id} className="rounded-lg border border-slate-100 p-3"><p className="text-[10px] font-semibold text-slate-900">{project.title}</p><p className="mt-1 text-[9px] text-slate-500">{project.domain} · {project.sponsor}</p><button type="button" disabled={pending} onClick={() => { const request = { id: `access-${project.id}-${Date.now()}`, name: 'Sharath Swaroop', project: `For: ${project.title}`, resource: 'Project access', status: 'Pending', updated: new Date().toLocaleDateString(), reviewer: project.sponsor }; setRequests((current) => [request, ...current]); setNotice(`Access request submitted for ${project.title}.`); }} className="mt-2 rounded-md border border-indigo-200 px-2.5 py-1.5 text-[9px] font-semibold text-indigo-700 hover:bg-indigo-50 disabled:text-emerald-700">{pending ? 'Request pending' : 'Request project access'}</button></article>; })}</div></Panel></div>
    </div>
  );
}

function MentorFeedbackPage() {
  const { currentUser } = useRole();
  const [replies, setReplies] = useDemoState<Record<string, string>>('mentor-feedback-replies', {});
  const [mentorRequests, setMentorRequests] = useDemoState<MentorshipRequest[]>('mentorship-requests', []);
  const [selectedMentor, setSelectedMentor] = useState(demoPeople.find((person) => person.role === 'Mentor')?.name ?? demoPeople[0].name);
  const [replyDraft, setReplyDraft] = useState('');
  const [notice, setNotice] = useState('');
  const currentRequest = mentorRequests.find((request) => request.email === currentUser.email && request.mentor === selectedMentor);
  const feedback = [
    { id: 'feedback-python', mentor: 'Prof. Sharma', skill: 'Python', text: 'Your data pipeline is well structured. Add a brief note explaining how you handled missing values.' },
    { id: 'feedback-research', mentor: 'Dr. Ananya Rao', skill: 'Research practice', text: 'The latest literature review is thorough. Please cite the cohort selection criteria in the next revision.' },
  ];
  const requestMentor = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentRequest && currentRequest.status === 'Pending') {
      setNotice(`Your request to ${selectedMentor} is already pending.`);
      return;
    }
    setMentorRequests((items) => [...items.filter((item) => !(item.email === currentUser.email && item.mentor === selectedMentor)), {
      id: `mentor-request-${Date.now()}`,
      studentName: currentUser.name === 'demo' ? 'Sharath Swaroop' : currentUser.name,
      email: currentUser.email,
      mentor: selectedMentor,
      status: 'Pending',
    }]);
    setNotice(`Mentorship request sent to ${selectedMentor}.`);
  };
  const saveReply = (event: React.FormEvent<HTMLFormElement>, feedbackId: string) => {
    event.preventDefault();
    const text = replyDraft.trim();
    if (!text) return;
    setReplies((current) => ({ ...current, [feedbackId]: text }));
    setReplyDraft('');
    setNotice('Your reply was saved locally.');
  };
  return <div className="mx-auto max-w-[1000px] space-y-4 px-4 py-6 sm:px-6 lg:px-8"><PageIntro eyebrow="Student workspace" title="Mentor Feedback" description="Reply to mentor feedback or request mentorship. Demo requests and replies are stored in this browser." />{notice && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>}<Panel title="Request a mentor"><form onSubmit={requestMentor} className="flex flex-wrap items-end gap-2"><label className="min-w-56 flex-1 text-[10px] font-semibold text-slate-700">Choose a mentor<select value={selectedMentor} onChange={(event) => setSelectedMentor(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">{demoPeople.filter((person) => person.role === 'Mentor' || person.role === 'Research lead').map((person) => <option key={person.name}>{person.name}</option>)}</select></label><button disabled={currentRequest?.status === 'Pending' || currentRequest?.status === 'Approved'} type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-[10px] font-semibold text-white disabled:bg-slate-300">{currentRequest?.status === 'Pending' ? 'Request pending' : currentRequest?.status === 'Approved' ? 'Mentorship approved' : currentRequest?.status === 'Rejected' ? 'Request again' : 'Request mentorship'}</button></form>{currentRequest && <p className="mt-2 text-[9px] text-slate-500">Your request status: {currentRequest.status}</p>}</Panel><Panel title="Feedback and replies"><div className="space-y-3">{feedback.map((item) => <article key={item.id} className="rounded-lg border border-slate-100 p-3"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold text-slate-900">{item.mentor} · {item.skill}</p><StatusBadge tone="blue">Feedback</StatusBadge></div><p className="mt-2 text-[10px] leading-5 text-slate-600">{item.text}</p>{replies[item.id] ? <p className="mt-3 rounded-lg bg-indigo-50 p-2 text-[10px] text-indigo-900">Your reply: {replies[item.id]}</p> : <form onSubmit={(event) => saveReply(event, item.id)} className="mt-3 flex gap-2"><label className="sr-only" htmlFor={`feedback-reply-${item.id}`}>Reply to {item.mentor}</label><input id={`feedback-reply-${item.id}`} value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[10px]" placeholder="Write a reply..." /><button type="submit" disabled={!replyDraft.trim()} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-semibold text-indigo-700 disabled:opacity-40">Send reply</button></form>}</article>)}</div></Panel></div>;
}

function StudentMessages() {
  const [active, setActive] = useDemoState('student-active-conversation', 'Prof. Sharma');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [sent, setSent] = useDemoState<Record<string, string[]>>('student-messages', {});
  const conversations = [
    { name: 'Prof. Sharma', role: 'Mentor', preview: 'I reviewed your latest experiment results.', time: '2 min', tone: 'violet' },
    { name: 'AI for Medical Image Analysis', role: 'Project team', preview: 'Dataset v2 is now available.', time: '1 hr', tone: 'blue' },
    { name: 'Dr. Ananya Rao', role: 'Research lead', preview: 'Please add the cohort summary.', time: '3 hr', tone: 'emerald' },
    { name: 'Sustainable Battery Team', role: 'Project team', preview: 'Great, the update is ready.', time: 'Yesterday', tone: 'amber' },
  ];
  return (
    <div className="mx-auto max-w-[1500px] space-y-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <PageIntro eyebrow="Student workspace" title="Messages" description="Communicate with your project teams and mentors." />
      <section className="grid min-h-[32rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="border-b border-slate-100 p-3 md:border-b-0 md:border-r"><label className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"><Search className="size-3.5 text-slate-400" aria-hidden="true" /><span className="sr-only">Search conversations</span><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-[10px] outline-none" placeholder="Search conversations..." /></label><ul className="mt-3 flex gap-2 overflow-x-auto md:flex-col">{conversations.filter((conversation) => `${conversation.name} ${conversation.role} ${conversation.preview}`.toLowerCase().includes(search.toLowerCase())).map((conversation) => <li key={conversation.name} className="min-w-48 md:min-w-0"><button type="button" onClick={() => setActive(conversation.name)} className={cn('flex w-full items-center gap-2 rounded-lg p-2 text-left', active === conversation.name ? 'bg-indigo-50' : 'hover:bg-slate-50')}><UserAvatar name={conversation.name} tone={conversation.tone} /><span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-semibold text-slate-900">{conversation.name}</span><span className="block truncate text-[9px] text-slate-500">{conversation.preview}</span></span><span className="text-[8px] text-slate-400">{conversation.time}</span></button></li>)}</ul></aside>
        <div className="flex min-h-[26rem] min-w-0 flex-col"><header className="border-b border-slate-100 px-4 py-3"><p className="text-[10px] font-bold text-slate-900">{active}</p><p className="text-[9px] text-slate-500">{conversations.find((conversation) => conversation.name === active)?.role} · AI for Medical Image Analysis</p></header><div className="flex-1 space-y-3 overflow-y-auto p-4"><p className="max-w-[82%] rounded-xl bg-slate-100 p-3 text-[10px] leading-4 text-slate-700">Hi Sharath, I reviewed your latest experiment results. Could you add a short note about the evaluation cohort before our next check-in?</p><p className="text-pretty ml-auto max-w-[82%] rounded-xl bg-indigo-600 p-3 text-[10px] leading-4 text-white">Absolutely. I’ll add the cohort summary to the research workspace and share reproducibility notes.</p>{(sent[active] ?? []).map((sentMessage, index) => <p key={`${index}-${sentMessage}`} className="ml-auto max-w-[82%] rounded-xl bg-indigo-600 p-3 text-[10px] leading-4 text-white">{sentMessage}</p>)}</div><form className="flex gap-2 border-t border-slate-100 p-3" onSubmit={(event) => { event.preventDefault(); if (message.trim()) { setSent((current) => ({ ...current, [active]: [...(current[active] ?? []), message.trim()] })); setMessage(''); } }}><label htmlFor="student-message" className="sr-only">Write a message</label><input id="student-message" value={message} onChange={(event) => setMessage(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[10px]" placeholder="Type a message..." /><button type="submit" disabled={!message.trim()} aria-label="Send demo message" className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white disabled:opacity-50"><Send className="size-4" aria-hidden="true" /></button></form></div>
      </section>
      <p className="text-center text-[9px] text-slate-400">Sample conversation content; new messages are saved locally in this browser.</p>
    </div>
  );
}

function DataTable({ rows, headers }: { rows: { title: string; subtitle: string; status: string; meta: string }[]; headers?: string[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_1fr] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2 text-[9px] font-semibold uppercase text-slate-500 sm:grid">{(headers ?? ['Item', 'Status', 'Updated', 'Details']).map((header) => <span key={header}>{header}</span>)}</div>
      <ul className="divide-y divide-slate-100">
        {rows.map((row) => <li key={row.title} className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr] sm:items-center sm:gap-3"><div className="min-w-0"><p className="truncate text-[11px] font-semibold text-slate-900">{row.title}</p><p className="truncate text-[9px] text-slate-500">{row.subtitle}</p></div><div><StatusBadge tone={row.status.toLowerCase().includes('pending') ? 'amber' : row.status.toLowerCase().includes('approved') || row.status.toLowerCase().includes('verified') ? 'emerald' : 'blue'}>{row.status}</StatusBadge></div><span className="text-[10px] text-slate-500">{row.meta}</span><span className="text-[10px] text-slate-500 sm:truncate">{row.subtitle}</span></li>)}
      </ul>
    </div>
  );
}

function DemoMessagesPage({ role }: { role: UserRole }) {
  const [active, setActive] = useDemoState(`active-chat-${role.toLowerCase()}`, demoPeople[0].name);
  const [messages, setMessages] = useDemoState<Record<string, string[]>>(`messages-${role.toLowerCase()}`, {});
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const conversations = demoPeople.filter((person) => `${person.name} ${person.role} ${person.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => ({ ...current, [active]: [...(current[active] ?? []), text] }));
    setDraft('');
  };
  return <div className="mx-auto max-w-[1200px] space-y-4 px-4 py-6 sm:px-6 lg:px-8"><PageIntro eyebrow={roleName(role)} title="Messages" description="Demo conversations are local previews. Messages you send are saved in this browser." /><section className="grid min-h-[30rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-[18rem_minmax(0,1fr)]"><aside className="border-b border-slate-100 p-3 md:border-b-0 md:border-r"><label className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"><Search className="size-3.5 text-slate-400" aria-hidden="true" /><span className="sr-only">Search conversations</span><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-[10px] outline-none" placeholder="Search conversations" /></label><ul className="mt-3 space-y-1">{conversations.map((person) => <li key={person.name}><button type="button" aria-pressed={active === person.name} onClick={() => setActive(person.name)} className={cn('flex w-full items-center gap-2 rounded-lg p-2 text-left', active === person.name ? 'bg-indigo-50' : 'hover:bg-slate-50')}><UserAvatar name={person.name} /><span className="min-w-0"><span className="block truncate text-[10px] font-semibold text-slate-800">{person.name}</span><span className="block truncate text-[9px] text-slate-500">{person.role} · sample conversation</span></span></button></li>)}</ul>{conversations.length === 0 && <p className="p-3 text-[10px] text-slate-500">No matching conversations.</p>}</aside><div className="flex min-h-72 min-w-0 flex-col"><header className="border-b border-slate-100 px-4 py-3"><p className="text-[10px] font-bold text-slate-900">{active}</p><p className="text-[9px] text-slate-500">Sample project conversation</p></header><div className="flex-1 space-y-3 overflow-y-auto p-4"><p className="max-w-[80%] rounded-xl bg-slate-100 p-3 text-[10px] leading-4 text-slate-700">Thanks for sharing the latest project update. Please add your next research note in the workspace.</p>{(messages[active] ?? []).map((message, index) => <p key={`${index}-${message}`} className="ml-auto max-w-[80%] rounded-xl bg-indigo-600 p-3 text-[10px] leading-4 text-white">{message}</p>)}</div><form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-3"><label htmlFor="demo-message-input" className="sr-only">Write a message</label><input id="demo-message-input" value={draft} onChange={(event) => setDraft(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs" placeholder="Write a message..." /><button type="submit" disabled={!draft.trim()} className="rounded-lg bg-indigo-700 px-3 py-2 text-[10px] font-semibold text-white disabled:opacity-50">Send</button></form></div></section></div>;
}

function GenericRolePage({ role, section }: { role: UserRole; section: string }) {
  const [decision, setDecision] = useState<string | null>(null);
  const [decisions, setDecisions] = useDemoState<Record<string, string>>(`decisions-${role.toLowerCase()}-${section}`, {});
  const [showResearchForm, setShowResearchForm] = useState(false);
  const [researchTitle, setResearchTitle] = useState('');
  const [researchSummary, setResearchSummary] = useState('');
  const [researchDrafts, setResearchDrafts] = useDemoState<{ id: string; title: string; summary: string; status: string }[]>('research-submissions', []);
  const title = titleCase(section);
  const projectRows = demoProjects.map((project) => ({ title: project.title, subtitle: `${project.domain} · ${project.sponsor}`, status: project.status, meta: `${project.progress}% complete` }));
  const peopleRows = demoPeople.map((person) => ({ title: person.name, subtitle: person.role, status: person.status, meta: person.skills.join(', ') }));
  const accessRows = [
    { title: 'Dataset v2 · AI for Medical Image Analysis', subtitle: 'Requested by Sharath Swaroop', status: 'Pending review', meta: '2 hours ago' },
    { title: 'Research workspace · Climate Change Data Analysis', subtitle: 'Requested by Dr. Ananya Rao', status: 'Approved', meta: 'Yesterday' },
    { title: 'Mentor access · Sustainable Battery Materials', subtitle: 'Requested by Priya Nair', status: 'Pending review', meta: 'Yesterday' },
  ];
  const isAccess = section === 'access' || section === 'access-requests';
  const isProjects = section === 'projects' || section === 'research-workspace';
  const isApplication = section === 'applications' || section === 'research-problems' || (role === 'SPONSOR' && section === 'proposals');
  const isSkills = section === 'skills' || section === 'team';
  const rows = isProjects ? projectRows : isSkills ? peopleRows : isAccess ? accessRows : section === 'users' ? peopleRows : section === 'audit' || section === 'security' || section === 'governance' ? demoActivity.map((item) => ({ title: item.name, subtitle: item.detail, status: 'Recorded', meta: item.time })) : [
    { title: 'Baseline model methodology', subtitle: 'AI for Medical Image Analysis', status: 'Under review', meta: '2 hours ago' },
    { title: 'MRI dataset documentation', subtitle: 'Research evidence · Dr. Ananya Rao', status: 'Approved', meta: 'Yesterday' },
    { title: 'Battery chemistry comparison', subtitle: 'Sustainable Battery Material Discovery', status: 'Pending review', meta: '2 days ago' },
  ];

  if (section === 'ai-workspace') return <AIWorkspace />;
  if (section === 'skills') return <SkillsPage role={role} />;
  if (section === 'messages') return <DemoMessagesPage role={role} />;
  if (role === 'STUDENT' && section === 'mentor-feedback') return <MentorFeedbackPage />;

  const submitResearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = researchTitle.trim();
    const cleanSummary = researchSummary.trim();
    if (!cleanTitle || !cleanSummary) return;
    setResearchDrafts((items) => [{ id: `research-${Date.now()}`, title: cleanTitle, summary: cleanSummary, status: 'Pending review' }, ...items]);
    setDecision(`“${cleanTitle}” was submitted for review in the demo.`);
    setResearchTitle('');
    setResearchSummary('');
    setShowResearchForm(false);
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <PageIntro eyebrow={roleName(role)} title={title} description={pageDescription(role, section)} action={(role === 'RESEARCHER' && section === 'research-problems') || (role === 'SPONSOR' && section === 'research-problems') ? <MockAction onClick={() => setShowResearchForm((show) => !show)}><Plus className="mr-1 inline size-3" />{showResearchForm ? 'Close form' : role === 'SPONSOR' ? 'Create research call' : 'Submit research for review'}</MockAction> : section === 'applications' && role === 'RESEARCHER' ? <TextLink href="/researcher/research-problems">Explore research opportunities</TextLink> : undefined} />
      {decision && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">{decision}</div>}
      {showResearchForm && <form onSubmit={submitResearch} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><label className="text-[10px] font-semibold text-slate-700">Research title<input required value={researchTitle} onChange={(event) => setResearchTitle(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" /></label><label className="text-[10px] font-semibold text-slate-700">Public summary<textarea required value={researchSummary} onChange={(event) => setResearchSummary(event.target.value)} className="mt-1 block min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" /></label><button type="submit" className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-[10px] font-semibold text-white">Submit for review</button></form>}
      {researchDrafts.length > 0 && section === 'research-problems' && <Panel title="Your submissions"><ul className="divide-y divide-slate-100">{researchDrafts.map((draft) => <li key={draft.id} className="flex items-center justify-between gap-3 py-3"><div><p className="text-[10px] font-semibold text-slate-900">{draft.title}</p><p className="text-[9px] text-slate-500">{draft.summary}</p></div><StatusBadge tone="amber">{draft.status}</StatusBadge></li>)}</ul></Panel>}
      {section === 'messages' ? (
        <div className="grid min-h-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="border-b border-slate-100 p-3 md:border-b-0 md:border-r"><label className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"><Search className="size-3.5 text-slate-400" aria-hidden="true" /><input aria-label="Search messages" className="w-full bg-transparent text-[10px] outline-none" placeholder="Search conversations" /></label><ul className="mt-3 space-y-1">{demoPeople.slice(0, 3).map((person) => <li key={person.name}><button type="button" onClick={() => setDecision(`Showing the sample conversation with ${person.name}.`)} className="flex w-full items-center gap-2 rounded-lg bg-slate-50 p-2 text-left"><UserAvatar name={person.name} /><span className="min-w-0"><span className="block truncate text-[10px] font-semibold text-slate-800">{person.name}</span><span className="block truncate text-[9px] text-slate-500">Project update · Yesterday</span></span></button></li>)}</ul></aside>
          <section className="flex min-h-72 flex-col p-4"><div className="border-b border-slate-100 pb-3"><p className="text-xs font-bold text-slate-900">Dr. Ananya Rao</p><p className="text-[9px] text-slate-500">Research lead · AI for Medical Image Analysis</p></div><div className="flex-1 space-y-3 py-4"><p className="max-w-[80%] rounded-xl bg-slate-100 p-3 text-[10px] leading-4 text-slate-700">I’ve reviewed the dataset notes. Could you add a short summary of the baseline model results before our next check-in?</p><p className="ml-auto max-w-[80%] rounded-xl bg-indigo-50 p-3 text-[10px] leading-4 text-indigo-900">Absolutely. I’ll prepare the evaluation summary and attach it to the project workspace.</p></div><form className="flex gap-2 border-t border-slate-100 pt-3" onSubmit={(event) => { event.preventDefault(); setDecision('Message saved in the local preview only.'); }}><input aria-label="Write a message" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs" placeholder="Write a message..." /><button type="submit" aria-label="Send message in preview" className="flex size-9 items-center justify-center rounded-lg bg-indigo-700 text-white"><Send className="size-4" aria-hidden="true" /></button></form></section>
        </div>
      ) : section === 'ai-workspace' ? <AIWorkspace /> : section === 'skills' ? <SkillsPage /> : (
        <>
          {isApplication && role === 'SPONSOR' && section !== 'proposals' && <div className="grid gap-3 md:grid-cols-2">{demoProjects.slice(0, 4).map((project) => <article key={project.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-2"><StatusBadge tone="blue">{project.domain}</StatusBadge><StatusBadge tone="emerald">Published</StatusBadge></div><h2 className="text-balance mt-3 text-sm font-bold text-slate-900">{project.title}</h2><p className="text-pretty mt-1 text-[10px] leading-4 text-slate-600">{project.summary}</p><div className="mt-3 flex items-center justify-between text-[10px] text-slate-500"><span>{project.members} applicants</span><span>Reward: {project.reward}</span></div><MockAction onClick={() => setDecision(`Application panel opened for ${project.title}.`)}>Review applications</MockAction></article>)}</div>}
          {role === 'SPONSOR' && section === 'proposals' && <Panel title="Research proposals"><ul className="divide-y divide-slate-100">{demoProjects.slice(0, 4).map((project) => { const status = decisions[project.id] ?? 'Under review'; return <li key={project.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-slate-900">{project.title}</p><p className="text-[9px] text-slate-500">{project.domain} · {project.sponsor} · {project.reward}</p></div><StatusBadge tone={status === 'Shortlisted' ? 'emerald' : status === 'Declined' ? 'rose' : 'amber'}>{status}</StatusBadge>{status === 'Under review' && <div className="flex gap-2"><button type="button" onClick={() => { if (!window.confirm(`Decline the proposal “${project.title}”?`)) return; setDecisions((current) => ({ ...current, [project.id]: 'Declined' })); setDecision(`“${project.title}” was declined.`); }} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-semibold text-rose-700">Decline</button><button type="button" onClick={() => { if (!window.confirm(`Shortlist “${project.title}”?`)) return; setDecisions((current) => ({ ...current, [project.id]: 'Shortlisted' })); setDecision(`“${project.title}” was shortlisted.`); }} className="rounded-lg bg-emerald-700 px-3 py-2 text-[9px] font-semibold text-white">Shortlist</button></div>}</li>; })}</ul></Panel>}
          {role === 'MENTOR' && section === 'reviews' && <Panel title="Contribution review queue"><ul className="divide-y divide-slate-100">{demoContributions.filter((contribution) => contribution.status !== 'Verified').map((contribution) => { const status = decisions[contribution.id] ?? contribution.status; return <li key={contribution.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-slate-900">{contribution.title}</p><p className="text-[9px] text-slate-500">{contribution.project} · {contribution.reviewer}</p></div><StatusBadge tone={status === 'Approved' ? 'emerald' : status === 'Rejected' ? 'rose' : 'amber'}>{status}</StatusBadge>{status !== 'Approved' && status !== 'Rejected' && <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { if (!window.confirm(`Request changes to “${contribution.title}”?`)) return; setDecisions((current) => ({ ...current, [contribution.id]: 'Changes requested' })); setDecision(`Changes requested for “${contribution.title}”.`); }} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-semibold text-amber-700">Request changes</button><button type="button" onClick={() => { if (!window.confirm(`Reject “${contribution.title}”?`)) return; setDecisions((current) => ({ ...current, [contribution.id]: 'Rejected' })); setDecision(`“${contribution.title}” was rejected.`); }} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-semibold text-rose-700">Reject</button><button type="button" onClick={() => { if (!window.confirm(`Approve “${contribution.title}”?`)) return; setDecisions((current) => ({ ...current, [contribution.id]: 'Approved' })); setDecision(`“${contribution.title}” was approved in the demo.`); }} className="rounded-lg bg-emerald-700 px-3 py-2 text-[9px] font-semibold text-white">Approve</button></div>}</li>; })}</ul></Panel>}
          {section === 'credits' || section === 'rewards' ? <div className="grid gap-3 sm:grid-cols-3"><StatCard label="Available balance" value="420" detail="Sample credits" icon={Wallet} tone="violet" /><StatCard label="Pending review" value="180" detail="Awaiting mentor review" icon={FileClock} tone="amber" /><StatCard label="Awarded this cycle" value="1,260" detail="Across 4 contributions" icon={Award} tone="emerald" /></div> : null}
          {section === 'contributions' && <Panel title="AI Mesh Contribution Analysis"><div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3"><div className="flex items-center gap-2"><BrainCircuit className="size-4 text-indigo-700" aria-hidden="true" /><p className="text-[10px] font-bold text-slate-900">Contribution analysis · sample</p></div><p className="text-pretty mt-1 text-[10px] leading-4 text-slate-600">AI analysis suggests a preliminary award of 80 credits based on reproducibility and documentation. Mentor review remains the final decision.</p><div className="mt-2 flex gap-2"><StatusBadge tone="violet">Suggested: 80 credits</StatusBadge><StatusBadge tone="amber">Mentor review pending</StatusBadge></div></div><DataTable rows={rows} headers={['Contribution', 'Review status', 'Suggested credits', 'Project']} /></Panel>}
          {section === 'verification' && <Panel title="Organization and skill verification queue"><DataTable rows={[{ title: 'MedScan Labs', subtitle: 'Organization verification · submitted Oct 4', status: 'Pending review', meta: 'Private documents' }, { title: 'Python · Sharath Swaroop', subtitle: 'Skill test · score 92%', status: 'Verified', meta: 'AI analysis + mentor review' }, { title: 'Computer Vision · Priya Nair', subtitle: 'Skill test · assessment completed', status: 'Pending review', meta: 'Mentor review' }]} /></Panel>}
          {isAccess && <Panel title="Requests and approvals"><div className="space-y-3">{accessRows.map((row) => { const status = decisions[row.title] ?? row.status; const canDecide = ['SPONSOR', 'MENTOR', 'ADMIN'].includes(role); return <article key={row.title} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"><div className="min-w-0"><p className="text-[10px] font-semibold text-slate-900">{row.title}</p><p className="mt-1 text-[9px] text-slate-500">{row.subtitle} · {row.meta}</p><StatusBadge tone={status === 'Approved' ? 'emerald' : status === 'Rejected' ? 'rose' : 'amber'}>{status}</StatusBadge></div>{status === 'Pending review' && canDecide && <div className="flex gap-2"><MockAction tone="neutral" onClick={() => { if (!window.confirm(`Reject ${row.title}?`)) return; setDecisions((current) => ({ ...current, [row.title]: 'Rejected' })); setDecision(`${row.title} was rejected in this demo.`); }}>Reject</MockAction><MockAction onClick={() => { if (!window.confirm(`Approve ${row.title}?`)) return; setDecisions((current) => ({ ...current, [row.title]: 'Approved' })); setDecision(`${row.title} was approved in this demo.`); }}>Approve</MockAction></div>}</article>; })}</div><p className="mt-3 text-[9px] text-slate-500">Demo workflow decisions are stored locally in this browser and do not affect live records.</p></Panel>}
          {!isApplication && section !== 'credits' && section !== 'rewards' && section !== 'contributions' && section !== 'verification' && !isAccess && (
            <Panel title={section === 'team' ? 'Project collaborators' : section === 'skills' ? 'Skills and matching' : section === 'reports' ? 'Research reports' : section === 'audit' ? 'Recent audit activity' : title}>
              <DataTable rows={rows} />
            </Panel>
          )}
          {role === 'RESEARCHER' && (section === 'applications' || section === 'research-workspace') && <Panel title="Available research opportunities"><ul className="divide-y divide-slate-100">{demoProjects.slice(0, 3).map((project) => { const status = decisions[project.id] ?? 'Open'; return <li key={project.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-slate-900">{project.title}</p><p className="text-[9px] text-slate-500">{project.domain} · {project.sponsor} · {project.reward}</p></div><StatusBadge tone={status === 'Application submitted' ? 'emerald' : 'blue'}>{status}</StatusBadge>{status === 'Open' && <div className="flex gap-2"><button type="button" onClick={() => { if (!window.confirm(`Submit an application for ${project.title}?`)) return; setDecisions((current) => ({ ...current, [project.id]: 'Application submitted' })); setDecision(`Your application for “${project.title}” was submitted in the demo.`); }} className="rounded-lg bg-indigo-600 px-3 py-2 text-[9px] font-semibold text-white">Apply</button><button type="button" onClick={() => { setDecisions((current) => ({ ...current, [project.id]: 'Access requested' })); setDecision(`Access was requested for “${project.title}”.`); }} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-semibold text-slate-700">Request access</button></div>}</li>; })}</ul></Panel>}
        </>
      )}
      <p className="text-center text-[9px] text-slate-400">Sample data only · Actions on this screen do not contact a server.</p>
    </div>
  );
}

function pageDescription(role: UserRole, section: string) {
  if (section === 'projects') return 'Explore collaborative projects, research areas, milestones, and team opportunities.';
  if (section === 'access' || section === 'access-requests') return role === 'SPONSOR' ? 'Review researcher applications and manage project access requests.' : 'Follow project access requests and review decisions in one place.';
  if (section === 'applications') return 'Track submitted applications and find research opportunities aligned with your work.';
  if (section === 'research-problems') return 'Publish meaningful research questions and connect with the right collaborators.';
  if (section === 'messages') return 'Coordinate with research leads, mentors, sponsors, and project teammates.';
  if (section === 'team') return 'Meet the collaborators and contributors working across your research teams.';
  if (section === 'reports') return 'Track project progress, contributions, milestones, and research outcomes.';
  if (section === 'contributions') return 'Review shared contributions with transparent evidence and human review.';
  if (section === 'my-work') return 'Your assigned tasks, upcoming milestones, and work across projects.';
  if (section === 'governance') return 'Explore project charters, platform standards, and research governance reviews.';
  if (section === 'audit') return 'A readable sample history of platform and project activity.';
  if (section === 'security') return 'Review security posture and platform-level access signals.';
  return `A shared ${titleCase(section).toLowerCase()} workspace for ${roleName(role).toLowerCase()}s. Explore sample project data and common research workflows.`;
}

function DemoNotifications({ role }: { role: UserRole }) {
  const [read, setRead] = useDemoState<string[]>('notification-read', []);
  useEffect(() => {
    window.dispatchEvent(new Event('gardenia:notifications-updated'));
  }, [read]);
  return (
    <div className="mx-auto max-w-[1100px] space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <PageIntro eyebrow={roleName(role)} title="Notifications" description="Updates from your research workspace. Read status is saved locally for this demo." action={<button type="button" onClick={() => setRead(demoNotifications.map((item) => item.title))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 hover:bg-slate-50">Mark all as read</button>} />
      <Panel title="Recent notifications" action={<StatusBadge tone="blue">{demoNotifications.length - read.length} unread</StatusBadge>}>
        <ul className="divide-y divide-slate-100">{demoNotifications.map((item) => {
          const isRead = read.includes(item.title);
          return <li key={item.title} className="flex items-start gap-3 py-3">
            <span className={cn('mt-1 size-2 shrink-0 rounded-full', isRead ? 'bg-slate-300' : 'bg-indigo-600')} aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-slate-900">{item.title}</p><p className="mt-1 text-[9px] text-slate-500">{item.detail} · {item.time}</p></div>
            {!isRead && <button type="button" onClick={() => setRead((current) => [...current, item.title])} className="rounded-md border border-slate-200 px-2 py-1 text-[9px] font-semibold text-indigo-700 hover:bg-indigo-50">Mark read</button>}
            {isRead && <StatusBadge tone="slate">Read</StatusBadge>}
          </li>;
        })}</ul>
      </Panel>
    </div>
  );
}

function AdminWorkflowPage({ section }: { section: string }) {
  const [users, setUsers] = useDemoState('admin-users', [
    { id: 'demo-user-rahul', name: 'Rahul Sharma', email: 'rahul@example.demo', role: 'STUDENT', status: 'Active' },
    { id: 'demo-user-sneha', name: 'Sneha Iyer', email: 'sneha@example.demo', role: 'RESEARCHER', status: 'Active' },
    { id: 'demo-user-aditya', name: 'Aditya Reddy', email: 'aditya@example.demo', role: 'MENTOR', status: 'Pending verification' },
    { id: 'demo-user-kavya', name: 'Kavya Nair', email: 'kavya@example.demo', role: 'STUDENT', status: 'Active' },
  ]);
  const [organizations, setOrganizations] = useDemoState('admin-organizations', [
    { id: 'demo-org-iit', name: 'IIT Bangalore', category: 'University', status: 'Pending review' },
    { id: 'demo-org-green', name: 'GreenTech Labs', category: 'Research Institute', status: 'Pending review' },
    { id: 'demo-org-health', name: 'HealthAI Foundation', category: 'Non-profit', status: 'Pending review' },
  ]);
  const [projects, setProjects] = useDemoState('admin-project-approvals', [
    { id: 'demo-project-soil', title: 'AI for Soil Analysis', organization: 'IIT Bangalore' },
    { id: 'demo-project-carbon', title: 'Blockchain for Carbon Credits', organization: 'GreenTech Labs' },
    { id: 'demo-project-clinic', title: 'IoT for Rural Healthcare', organization: 'HealthAI Foundation' },
  ]);
  const [projectDecisions, setProjectDecisions] = useDemoState<Record<string, string>>('admin-project-decisions', {});
  const [announcements, setAnnouncements] = useDemoState<{ id: string; title: string; message: string }[]>('admin-announcements', []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [notice, setNotice] = useState('');
  const pageTitle = titleCase(section);
  const saveAnnouncement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = announcementTitle.trim();
    const message = announcementMessage.trim();
    if (!title || !message) return;
    setAnnouncements((items) => [{ id: `announcement-${Date.now()}`, title, message }, ...items]);
    setAnnouncementTitle('');
    setAnnouncementMessage('');
    setNotice('Announcement saved locally for this demo.');
  };

  if (section === 'users') {
    const addUser = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const cleanName = name.trim();
      const cleanEmail = email.trim();
      if (!cleanName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return;
      setUsers((items) => [{ id: `demo-user-${Date.now()}`, name: cleanName, email: cleanEmail, role, status: 'Invited' }, ...items]);
      setName('');
      setEmail('');
      setNotice(`${cleanName} was added to the demo user directory.`);
    };
    return <div className="mx-auto max-w-[1200px] space-y-4 px-4 py-6 sm:px-6 lg:px-8"><PageIntro eyebrow="Admin workspace" title="User Management" description="Manage sample users, roles, invitations, and account status. Changes are saved to this browser only." />{notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>}<Panel title="Add demo user"><form onSubmit={addUser} className="grid gap-2 sm:grid-cols-[1fr_1fr_0.7fr_auto] sm:items-end"><label className="text-[10px] font-semibold text-slate-700">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" /></label><label className="text-[10px] font-semibold text-slate-700">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" /></label><label className="text-[10px] font-semibold text-slate-700">Role<select value={role} onChange={(event) => setRole(event.target.value as UserRole)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">{(['STUDENT', 'RESEARCHER', 'MENTOR', 'SPONSOR'] as UserRole[]).map((item) => <option key={item} value={item}>{roleName(item)}</option>)}</select></label><button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-[10px] font-semibold text-white">Add user</button></form></Panel><Panel title="People"><ul className="divide-y divide-slate-100">{users.map((user) => <li key={user.id} className="flex flex-wrap items-center gap-2 py-3"><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-slate-900">{user.name}</p><p className="text-[9px] text-slate-500">{user.email} · {user.status}</p></div><select aria-label={`Role for ${user.name}`} value={user.role} onChange={(event) => { const nextRole = event.target.value as UserRole; if (!window.confirm(`Change ${user.name}'s role to ${roleName(nextRole)}?`)) return; setUsers((items) => items.map((item) => item.id === user.id ? { ...item, role: nextRole } : item)); setNotice(`${user.name}'s demo role was updated.`); }} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[9px]">{(['STUDENT', 'RESEARCHER', 'MENTOR', 'SPONSOR'] as UserRole[]).map((item) => <option key={item} value={item}>{roleName(item)}</option>)}</select><button type="button" onClick={() => { const nextStatus = user.status === 'Suspended' ? 'Active' : 'Suspended'; if (!window.confirm(`${nextStatus === 'Suspended' ? 'Suspend' : 'Reactivate'} ${user.name}?`)) return; setUsers((items) => items.map((item) => item.id === user.id ? { ...item, status: nextStatus } : item)); setNotice(`${user.name}'s status is now ${nextStatus}.`); }} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[9px] font-semibold text-slate-700">{user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}</button></li>)}</ul></Panel></div>;
  }

  if (section === 'organizations') return <div className="mx-auto max-w-[1100px] space-y-4 px-4 py-6 sm:px-6 lg:px-8"><PageIntro eyebrow="Admin workspace" title="Organizations" description="Review sample partner organizations. Decisions are local demo state, not verified database records." />{notice && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>}<Panel title="Organization verification"><ul className="divide-y divide-slate-100">{organizations.map((item) => <li key={item.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-slate-900">{item.name}</p><p className="text-[9px] text-slate-500">{item.category}</p></div><StatusBadge tone={item.status === 'Approved' ? 'emerald' : item.status === 'Rejected' ? 'rose' : 'amber'}>{item.status}</StatusBadge>{item.status === 'Pending review' && <div className="flex gap-2"><button type="button" onClick={() => { if (!window.confirm(`Reject verification for ${item.name}?`)) return; setOrganizations((items) => items.map((row) => row.id === item.id ? { ...row, status: 'Rejected' } : row)); setNotice(`${item.name} verification was rejected.`); }} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-semibold text-rose-700">Reject</button><button type="button" onClick={() => { if (!window.confirm(`Approve verification for ${item.name}?`)) return; setOrganizations((items) => items.map((row) => row.id === item.id ? { ...row, status: 'Approved' } : row)); setNotice(`${item.name} was verified in this demo.`); }} className="rounded-lg bg-emerald-700 px-3 py-2 text-[9px] font-semibold text-white">Verify</button></div>}</li>)}</ul></Panel></div>;

  if (section === 'projects' || section === 'verification') return <div className="mx-auto max-w-[1100px] space-y-4 px-4 py-6 sm:px-6 lg:px-8"><PageIntro eyebrow="Admin workspace" title={section === 'verification' ? 'Project Verification' : 'Research Projects'} description="Review and decide on sample project approvals. Every decision is confirmed and stored locally." />{notice && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>}<Panel title="Pending project approvals"><ul className="divide-y divide-slate-100">{projects.map((item) => { const status = projectDecisions[item.id] ?? 'Pending review'; return <li key={item.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-slate-900">{item.title}</p><p className="text-[9px] text-slate-500">{item.organization}</p></div><StatusBadge tone={status === 'Approved' ? 'emerald' : status === 'Rejected' ? 'rose' : 'amber'}>{status}</StatusBadge>{status === 'Pending review' && <div className="flex gap-2"><button type="button" onClick={() => { if (!window.confirm(`Reject “${item.title}”?`)) return; setProjectDecisions((current) => ({ ...current, [item.id]: 'Rejected' })); setNotice(`${item.title} was rejected.`); }} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px] font-semibold text-rose-700">Reject</button><button type="button" onClick={() => { if (!window.confirm(`Approve “${item.title}”?`)) return; setProjectDecisions((current) => ({ ...current, [item.id]: 'Approved' })); setNotice(`${item.title} was approved in the demo.`); }} className="rounded-lg bg-emerald-700 px-3 py-2 text-[9px] font-semibold text-white">Approve</button></div>}</li>; })}</ul></Panel></div>;

  if (section === 'announcements') return <div className="mx-auto max-w-[1100px] space-y-4 px-4 py-6 sm:px-6 lg:px-8"><PageIntro eyebrow="Admin workspace" title="Announcements" description="Draft and manage sample platform announcements. No message is sent to real users." />{notice && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>}<Panel title="Create announcement"><form onSubmit={saveAnnouncement} className="space-y-3"><label className="block text-[10px] font-semibold text-slate-700">Title<input required value={announcementTitle} onChange={(event) => setAnnouncementTitle(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" /></label><label className="block text-[10px] font-semibold text-slate-700">Message<textarea required value={announcementMessage} onChange={(event) => setAnnouncementMessage(event.target.value)} className="mt-1 block min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" /></label><button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-[10px] font-semibold text-white">Save announcement</button></form></Panel><Panel title="Saved demo announcements">{announcements.length ? <ul className="divide-y divide-slate-100">{announcements.map((item) => <li key={item.id} className="flex items-start gap-3 py-3"><div className="flex-1"><p className="text-[10px] font-semibold text-slate-900">{item.title}</p><p className="mt-1 text-[10px] text-slate-600">{item.message}</p></div><button type="button" onClick={() => { if (!window.confirm(`Delete “${item.title}”?`)) return; setAnnouncements((items) => items.filter((announcement) => announcement.id !== item.id)); setNotice('Announcement deleted.'); }} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[9px] font-semibold text-rose-700">Delete</button></li>)}</ul> : <p className="text-[10px] text-slate-500">No announcements have been drafted yet.</p>}</Panel></div>;

  return <GenericRolePage role="ADMIN" section={section} />;
}

function ProjectWorkspace({ id, section }: { id: string; section: string }) {
  const { currentRole } = useRole();
  const [accessRequests, setAccessRequests] = useDemoState<{ projectId: string; resource: string; reason: string; status: string }[]>('project-access-requests', []);
  const project = demoProjects.find((item) => item.id === id) ?? demoProjects[0];
  const currentAccessRequest = [...accessRequests].reverse().find((request) => request.projectId === project.id && ['Pending', 'Approved'].includes(request.status));
  const accessRequested = Boolean(currentAccessRequest);
  const activeSection = projectSections.some(([, path]) => path === section) ? section : 'overview';
  const title = project.title;
  const navLinks = projectSections;
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 lg:flex">
      <aside className="flex w-full flex-col border-b border-slate-800 bg-slate-950 px-4 py-4 lg:sticky lg:top-0 lg:h-dvh lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
        <Link href="/student/projects" className="mb-5 inline-flex items-center gap-2 text-[10px] text-slate-400 hover:text-white"><ArrowDownRight className="size-3" aria-hidden="true" />Back to Projects</Link>
        <p className="mb-1 truncate text-[9px] text-slate-500">Projects&nbsp; › &nbsp;{project.domain}</p>
        <p className="line-clamp-2 text-xs font-bold leading-5 text-white">{title}</p>
        <nav aria-label="Project workspace sections" className="mt-4 flex gap-1 overflow-x-auto lg:flex-1 lg:flex-col lg:overflow-y-auto">
          {navLinks.map(([label, path]) => <Link key={path} href={projectPath(project.id, path)} aria-current={activeSection === path ? 'page' : undefined} className={cn('shrink-0 rounded-lg px-3 py-2 text-[10px] font-medium', activeSection === path ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white')}>{label}</Link>)}
        </nav>
        <div className="mt-4 hidden items-center gap-2 border-t border-slate-800 pt-4 text-[9px] text-slate-400 lg:flex"><UserAvatar name="Sharath Swaroop" tone="violet" size="size-7" /><span>Sharath Swaroop<br />Contributor</span></div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0"><p className="truncate text-[9px] text-slate-500">{project.domain} · project workspace</p><h1 className="text-balance mt-1 truncate text-lg font-bold text-white">{title}</h1></div>
          <div className="flex flex-wrap items-center gap-2"><StatusBadge tone="emerald">{project.tags[0]}</StatusBadge><StatusBadge tone="blue">{project.tags[1]}</StatusBadge><StatusBadge tone="rose">{project.tags[2] ?? project.status}</StatusBadge><StatusBadge tone="amber">Due in 6 days</StatusBadge></div>
        </header>
        <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
          <nav aria-label="Project subsection navigation" className="hidden gap-1 overflow-x-auto border-b border-slate-800 pb-2 lg:flex">{[['Overview', 'overview'], ['Team', 'team'], ['Milestones', 'milestones'], ['Resources', 'evidence']].map(([label, path]) => <Link key={label} href={projectPath(project.id, path)} className={cn('shrink-0 rounded px-3 py-2 text-[10px]', activeSection === path ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white')}>{label}</Link>)}</nav>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_17rem]">
            <ProjectSectionContent
              project={project}
              role={currentRole}
              section={activeSection}
              accessRequested={accessRequested}
              accessStatus={currentAccessRequest?.status ?? null}
              accessRequests={accessRequests.filter((request) => request.projectId === project.id)}
              onRequestAccess={(resource, reason) => setAccessRequests((current) => [...current, { projectId: project.id, resource, reason, status: 'Pending' }])}
              onDecideAccess={(resource, status) => {
                if (!window.confirm(`${status} access to ${resource}?`)) return;
                setAccessRequests((current) => current.map((request) => request.projectId === project.id && request.resource === resource
                  ? { ...request, status }
                  : request));
              }}
            />
            <aside className="space-y-4">
              {activeSection === 'overview' && <section className="rounded-xl border border-slate-800 bg-slate-900 p-4"><h2 className="text-xs font-bold text-white">Quick Actions</h2><div className="mt-3 grid gap-2">{[['View Charter', 'charter'], ['Request Access', 'access'], ['Open AI Workspace', 'ai-workspace'], ['Submit Deliverable', 'contributions']].map(([label, path]) => <Link key={path} href={projectPath(project.id, path)} className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2.5 text-[10px] font-semibold text-slate-100 hover:bg-indigo-700">{label}<ArrowRight className="size-3" aria-hidden="true" /></Link>)}</div></section>}
              <section className="rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="flex items-center justify-between"><h2 className="text-xs font-bold text-white">Project Team</h2><Link href={projectPath(project.id, 'team')} className="text-[9px] text-indigo-300">View all</Link></div><ul className="mt-3 space-y-3">{demoPeople.slice(0, 3).map((person) => <li key={person.name} className="flex items-center gap-2"><UserAvatar name={person.name} tone="indigo" /><div><p className="text-[10px] font-semibold text-slate-200">{person.name}</p><p className="text-[9px] text-slate-500">{person.role}</p></div></li>)}</ul></section>
              <section className="rounded-xl border border-slate-800 bg-slate-900 p-4"><h2 className="text-xs font-bold text-white">Next Milestone</h2><p className="mt-2 text-[10px] font-medium text-slate-300">Baseline model + report</p><p className="mt-1 text-[9px] text-rose-300">Due in 6 days</p><div className="mt-3"><ProgressBar value={60} tone="violet" /></div></section>
            </aside>
          </div>
          <p className="text-center text-[9px] text-slate-500">Project workspace preview · all people, documents, progress, and activity are sample data.</p>
        </div>
      </main>
    </div>
  );
}

function ProjectSectionContent({
  project,
  role,
  section,
  accessRequested,
  accessStatus,
  accessRequests,
  onRequestAccess,
  onDecideAccess,
}: {
  project: (typeof demoProjects)[number];
  role: UserRole;
  section: string;
  accessRequested: boolean;
  accessStatus: string | null;
  accessRequests: { resource: string; reason: string; status: string }[];
  onRequestAccess: (resource: string, reason: string) => void;
  onDecideAccess: (resource: string, status: 'Approved' | 'Rejected') => void;
}) {
  const [resource, setResource] = useState('Research dataset v2');
  const [reason, setReason] = useState('');
  const [requestError, setRequestError] = useState('');
  const shellClass = 'rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm';
  if (section === 'ai-workspace') return <AIWorkspace />;
  if (section === 'access') return <section className="rounded-xl border border-indigo-900 bg-indigo-950/60 p-4"><p className="text-xs font-bold text-white">{role === 'SPONSOR' || role === 'MENTOR' ? 'Project access requests' : 'Request project access'}</p>{role === 'SPONSOR' || role === 'MENTOR' ? <ul className="mt-3 space-y-2">{accessRequests.length ? accessRequests.map((request) => <li key={`${request.resource}-${request.reason}`} className="rounded-lg border border-slate-700 p-3"><p className="text-[10px] font-semibold text-white">{request.resource} · {request.status}</p><p className="mt-1 text-[9px] text-slate-300">{request.reason}</p>{request.status === 'Pending' && <div className="mt-2 flex gap-2"><MockAction tone="neutral" onClick={() => onDecideAccess(request.resource, 'Rejected')}>Reject</MockAction><MockAction onClick={() => onDecideAccess(request.resource, 'Approved')}>Approve</MockAction></div>}</li>) : <li className="text-[10px] text-slate-300">No demo requests have been submitted yet.</li>}</ul> : role === 'ADMIN' ? <p className="mt-2 text-[10px] text-slate-300">Access decisions are managed by the project sponsor or mentor.</p> : <><p className="text-pretty mt-1 text-[10px] text-slate-300">Choose a resource scope and explain how it supports your research work.</p><label className="mt-3 block text-[10px] font-medium text-slate-300">Resource scope<select disabled={accessRequested} value={resource} onChange={(event) => setResource(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"><option>Research dataset v2</option><option>Implementation workspace</option><option>Project charter</option></select></label><label className="mt-3 block text-[10px] font-medium text-slate-300">Reason<textarea disabled={accessRequested} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white" placeholder="Describe how access supports your work." /></label>{requestError && <p role="alert" className="mt-2 text-[10px] text-rose-300">{requestError}</p>}<MockAction disabled={accessRequested} onClick={() => { if (!reason.trim()) { setRequestError('Explain why this resource is needed before submitting.'); return; } onRequestAccess(resource, reason.trim()); setRequestError(''); }}>{accessStatus === 'Approved' ? 'Access approved' : accessRequested ? 'Access request sent' : 'Submit access request'}</MockAction>{accessRequested && <p className="mt-2 text-[10px] text-emerald-300" role="status">Access request status: {accessStatus}.</p>}</>}</section>;
  if (section === 'overview') return <div className="space-y-4"><section className={shellClass}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-bold text-white">Problem Statement</h2><p className="text-pretty mt-2 max-w-3xl text-[10px] leading-5 text-slate-300">{project.summary}</p></div><span className="flex size-24 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-2xl" aria-label="Research lab illustration">🔬</span></div><div className="mt-4 grid gap-2 sm:grid-cols-4">{[['Domain', project.domain], ['Type', 'Research + Implementation'], ['Timeline', '3 months'], ['Reward', project.reward]].map(([label, value]) => <div key={label} className="rounded-lg border border-slate-800 bg-slate-950 p-2"><p className="text-[8px] text-slate-500">{label}</p><p className="mt-1 text-[9px] font-semibold text-slate-200">{value}</p></div>)}</div><div className="mt-4"><ProgressBar value={project.progress} label="Project progress" tone="violet" /></div></section><DocumentsPanel /><ActivityPanel /></div>;
  if (section === 'charter') return <section className={shellClass}><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-white">Project Charter · Version 2</h2><StatusBadge tone="emerald">Approved</StatusBadge></div><p className="text-pretty mt-3 text-xs leading-5 text-slate-300">Establish a reproducible research workflow to evaluate {project.domain.toLowerCase()} methods, document limitations, and share evidence with the project team.</p><dl className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-slate-950 p-3"><dt className="text-[9px] text-slate-500">Research objectives</dt><dd className="mt-1 text-[10px] text-slate-200">Replicable methods, transparent evaluation, accessible findings.</dd></div><div className="rounded-lg bg-slate-950 p-3"><dt className="text-[9px] text-slate-500">Contribution policy</dt><dd className="mt-1 text-[10px] text-slate-200">Human-reviewed evidence and documented author contributions.</dd></div><div className="rounded-lg bg-slate-950 p-3"><dt className="text-[9px] text-slate-500">Data governance</dt><dd className="mt-1 text-[10px] text-slate-200">Approved project resources only; no sensitive data in public reports.</dd></div><div className="rounded-lg bg-slate-950 p-3"><dt className="text-[9px] text-slate-500">Last review</dt><dd className="mt-1 text-[10px] text-slate-200">Oct 3 · Dr. Ananya Rao</dd></div></dl><div className="mt-4"><DocumentCard title="Project Charter v2.pdf" kind="Approved · 420 KB" access="Team" /></div></section>;
  if (section === 'team') return <section className={shellClass}><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-white">Project Team</h2><StatusBadge tone="blue">{project.members} collaborators</StatusBadge></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{demoPeople.map((person) => <article key={person.name} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3"><UserAvatar name={person.name} tone="indigo" size="size-9" /><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold text-slate-100">{person.name}</p><p className="text-[9px] text-slate-500">{person.role}</p></div><span className="text-right text-[9px] text-slate-400">{person.skills.join(' · ')}</span></article>)}</div><div className="mt-4 rounded-lg border border-slate-800 p-3"><p className="text-[10px] font-semibold text-slate-200">Request a mentor</p><p className="mt-1 text-[9px] text-slate-500">Ask for research guidance from an experienced mentor.</p><Link href="/researcher/access" className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-indigo-300">Request mentor access <ArrowRight className="size-3" aria-hidden="true" /></Link></div></section>;
  if (section === 'research') return <div className="space-y-4"><section className={shellClass}><h2 className="text-sm font-bold text-white">Research notes</h2><ul className="mt-3 space-y-3">{[['Literature review: evaluation methods', 'Compare sensitivity and specificity reporting across recent studies.', 'Dr. Ananya Rao · Oct 4'], ['Dataset review: sample coverage', 'Document cohort representation and image acquisition settings.', 'Sharath Swaroop · Oct 2'], ['Research question', 'Which evaluation design best supports reproducible early-stage findings?', 'Team note · Sep 29']].map(([title, detail, author]) => <li key={title} className="rounded-lg border border-slate-800 bg-slate-950 p-3"><p className="text-[10px] font-semibold text-slate-100">{title}</p><p className="mt-1 text-[9px] leading-4 text-slate-400">{detail}</p><p className="mt-2 text-[8px] text-slate-500">{author}</p></li>)}</ul></section><DocumentsPanel /></div>;
  if (section === 'implementation') return <section className={shellClass}><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-white">Implementation plan</h2><StatusBadge tone="blue">3 workstreams</StatusBadge></div><div className="mt-4 space-y-4">{[['Baseline model & evaluation', 60, 'In progress'], ['Dataset documentation', 80, 'In review'], ['Reproducibility package', 25, 'Planned']].map(([title, value, status]) => <div key={String(title)}><div className="mb-1 flex justify-between gap-3 text-[10px]"><span className="font-semibold text-slate-200">{title}</span><span className="text-slate-400">{status}</span></div><ProgressBar value={Number(value)} tone="violet" /></div>)}</div><div className="mt-4 rounded-lg bg-slate-950 p-3"><p className="text-[9px] font-semibold text-slate-200">Current implementation note</p><p className="mt-1 text-[9px] leading-4 text-slate-400">Evaluation scripts should record data split, model configuration, and environment version for each run.</p></div></section>;
  if (section === 'experiments') return <section className={shellClass}><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-white">Experiments</h2><StatusBadge tone="amber">Execution UI only</StatusBadge></div><p className="text-pretty mt-1 text-[9px] text-slate-400">Documented experiment examples; no jobs are being executed.</p><div className="mt-3 space-y-2">{[['Baseline model evaluation', 'Compare sensitivity across a held-out cohort', 'Results documented'], ['Augmentation sensitivity analysis', 'Assess the impact of image normalization choices', 'In review'], ['Reproducibility check', 'Repeat selected runs with fixed configuration', 'Planned']].map(([name, goal, status]) => <article key={name} className="rounded-lg border border-slate-800 bg-slate-950 p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-[10px] font-semibold text-slate-100">{name}</p><p className="mt-1 text-[9px] text-slate-400">{goal}</p></div><StatusBadge tone={status === 'Planned' ? 'amber' : 'blue'}>{status}</StatusBadge></div></article>)}</div></section>;
  if (section === 'evidence') return <div className="space-y-4"><section className={shellClass}><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-white">Research Evidence</h2><StatusBadge tone="blue">6 shared items</StatusBadge></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{[['Problem Statement.pdf', '2.4 MB', 'Public'], ['Dataset Guide.pdf', '1.2 MB', 'Team'], ['Evaluation Criteria.pdf', '800 KB', 'Team'], ['NDA & IP Terms.pdf', '600 KB', 'Restricted']].map(([name, size, access]) => <DocumentCard key={name} title={name} kind={size} access={access} />)}</div></section><section className={shellClass}><h2 className="text-xs font-bold text-white">Evidence notes</h2><p className="text-pretty mt-2 text-[9px] leading-4 text-slate-400">Methods, sources, and provenance are recorded alongside project evidence so collaborators can interpret and reproduce findings.</p></section></div>;
  if (section === 'milestones') return <section className={shellClass}><h2 className="text-sm font-bold text-white">Project Milestones</h2><ol className="mt-4 space-y-4">{[['Baseline model + report', 'Oct 12', 'In progress'], ['Dataset review', 'Oct 18', 'Upcoming'], ['Reproducibility package', 'Oct 25', 'Planned'], ['Final research report', 'Nov 3', 'Planned']].map(([name, due, status], index) => <li key={name} className="flex gap-3"><span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold', index === 0 ? 'bg-violet-100 text-violet-700' : 'bg-slate-800 text-slate-400')}>{index + 1}</span><div className="flex-1 border-b border-slate-800 pb-3"><div className="flex flex-wrap justify-between gap-2"><p className="text-[10px] font-semibold text-slate-200">{name}</p><StatusBadge tone={index === 0 ? 'violet' : 'slate'}>{status}</StatusBadge></div><p className="mt-1 text-[9px] text-slate-500">Target date · {due}</p></div></li>)}</ol></section>;
  if (section === 'contributions') return <div className="space-y-3"><section className={shellClass}><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-white">Contribution review</h2><StatusBadge tone="blue">Human review required</StatusBadge></div><p className="mt-1 text-[9px] text-slate-400">AI analysis is illustrative only. Mentors make all final review and credit decisions.</p></section>{[['Baseline evaluation summary', 'Sharath Swaroop', 80, 'Mentor review pending'], ['MRI dataset documentation', 'Priya Nair', 60, 'Approved'], ['Literature review notes', 'Karan Patel', 45, 'Under review']].map(([name, author, credits, status]) => <section key={String(name)} className={shellClass}><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="text-[10px] font-bold text-slate-100">{name}</h3><p className="mt-1 text-[9px] text-slate-500">Submitted by {author}</p></div><StatusBadge tone={status === 'Approved' ? 'emerald' : 'amber'}>{status}</StatusBadge></div><div className="mt-3 rounded-lg border border-indigo-900 bg-indigo-950/60 p-3"><p className="text-[9px] font-semibold text-indigo-200">AI analysis · sample</p><p className="mt-1 text-[9px] leading-4 text-slate-300">Evidence completeness and reproducibility are strong; verify cohort coverage in mentor review.</p></div><p className="mt-2 text-[9px] text-slate-400">Suggested credits <span className="font-bold text-slate-100">{credits}</span> · Final credits <span className="font-bold text-slate-100">{status === 'Approved' ? credits : 'Pending'}</span></p></section>)}</div>;
  if (section === 'activity') return <section className={shellClass}><h2 className="text-sm font-bold text-white">Project Activity</h2><div className="mt-3"><ActivityFeed items={demoActivity} /></div></section>;
  return <section className={shellClass}><h2 className="text-sm font-bold text-white">{titleCase(section)}</h2><p className="text-pretty mt-2 text-[10px] leading-5 text-slate-300">{sectionDescription(section)}</p></section>;
}

function DocumentsPanel() {
  return <section className="rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="flex items-center justify-between"><h2 className="text-xs font-bold text-white">Key Documents</h2><StatusBadge tone="blue">4 documents</StatusBadge></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{[['Problem Statement.pdf', '2.4 MB', 'Public'], ['Dataset Guide.pdf', '1.2 MB', 'Team'], ['Evaluation Criteria.pdf', '800 KB', 'Team'], ['NDA & IP Terms.pdf', '600 KB', 'Restricted']].map(([name, size, access]) => <DocumentCard key={name} title={name} kind={size} access={access} />)}</div></section>;
}

function ActivityPanel() {
  return <section className="rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="flex items-center justify-between"><h2 className="text-xs font-bold text-white">Recent Project Activity</h2><Activity className="size-4 text-slate-400" aria-hidden="true" /></div><div className="mt-3"><ActivityFeed items={demoActivity.slice(0, 3)} /></div></section>;
}

function sectionDescription(section: string) {
  const descriptions: Record<string, string> = {
    charter: 'The project charter establishes goals, research principles, ownership, and how project contributions are reviewed.',
    team: 'Meet the researchers, mentors, and contributors working together on this project.',
    research: 'Review literature, research notes, shared methods, and project findings.',
    implementation: 'Track the implementation plan, technical decisions, and deliverables.',
    experiments: 'Review documented experiments, hypotheses, and reproducibility notes.',
    'ai-workspace': 'AI Mesh research and analysis agents are represented as UI concepts only. No runtime is connected.',
    evidence: 'Browse project-approved evidence, datasets, and supporting documents.',
    access: 'Request the project resources required for your contribution.',
    milestones: 'Track upcoming research milestones and team progress.',
    contributions: 'Review submitted work, AI analysis summaries, mentor reviews, and suggested credits.',
    activity: 'A timestamped timeline of project discussions and changes.',
    overview: 'Project goals, research scope, and collaboration status.',
  };
  return descriptions[section] ?? 'Explore the project workspace and its shared research resources.';
}

export function RoleScreen({ segments }: { segments: string[] }) {
  const { currentRole } = useRole();
  if (segments[0] === 'projects') {
    if (segments.length === 1 && currentRole === 'STUDENT') return <StudentProjects />;
    if (segments.length === 1) return <ProjectListing role={currentRole} />;
    const id = segments[1] ?? demoProjects[0].id;
    const section = segments[2] ?? 'overview';
    return <ProjectWorkspace id={id} section={section} />;
  }
  const roleSlug = segments[0] ?? 'student';
  const role: UserRole = knownRoles.has(roleSlug) ? roleBySlug[roleSlug] : 'STUDENT';
  const roleSection = segments[1] ?? 'dashboard';
  const selectedSection = roleSection === 'tasks'
    ? 'my-work'
    : roleSection === 'recommended'
      ? 'projects'
      : roleSection === 'ai-assistant'
        ? 'ai-workspace'
        : roleSection === 'skill-verification' || roleSection === 'candidate-matching'
          ? 'skills'
          : roleSection === 'queue'
            ? 'reviews'
            : roleSection === 'project-verification'
              ? 'verification'
              : roleSection === 'research-workspace' || roleSection === 'workspace' || roleSection === 'my-research'
      ? 'research-workspace'
      : roleSection === 'access-requests' || roleSection === 'requests'
        ? 'access-requests'
        : roleSection;
  const isDashboard = selectedSection === '' || selectedSection === 'dashboard';
  if (selectedSection === 'notifications') return <DemoNotifications role={role} />;
  if (role === 'ADMIN' && ['projects', 'verification', 'organizations', 'users', 'announcements'].includes(selectedSection)) {
    return <AdminWorkflowPage section={selectedSection} />;
  }
  if (role === 'STUDENT') {
    if (isDashboard) return <StudentDashboard />;
    if (selectedSection === 'projects') return <StudentProjects />;
    if (selectedSection === 'my-work') return <StudentMyWork />;
    if (selectedSection === 'ai-workspace') return <StudentAIWorkspace />;
    if (selectedSection === 'skills') return <SkillsPage />;
    if (selectedSection === 'contributions') return <StudentContributions />;
    if (selectedSection === 'access' || selectedSection === 'access-requests') return <StudentAccess />;
    if (selectedSection === 'messages') return <StudentMessages />;
  }
  return isDashboard ? <Dashboard role={role} /> : selectedSection === 'projects' ? <ProjectListing role={role} /> : <GenericRolePage role={role} section={selectedSection} />;
}
