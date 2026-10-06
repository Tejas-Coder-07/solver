'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Dispatch, FormEvent, KeyboardEvent, SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Building2, CheckCircle2, ClipboardCheck,
  Database, FileCheck2, FolderKanban, Gauge, Megaphone, Network, Server, Settings, Shield,
  ShieldCheck, Sparkles, Star, Users, X,
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

const initialOrganizations = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'IIT Bangalore', type: 'University', submitted: 'Oct 4, 2026', initials: 'I', color: 'bg-blue-600' },
  { id: '22222222-2222-4222-8222-222222222222', name: 'GreenTech Labs', type: 'Research Institute', submitted: 'Oct 3, 2026', initials: 'G', color: 'bg-emerald-600' },
  { id: '33333333-3333-4333-8333-333333333333', name: 'HealthAI Foundation', type: 'NGO', submitted: 'Oct 2, 2026', initials: 'H', color: 'bg-teal-600' },
  { id: '44444444-4444-4444-8444-444444444444', name: 'NIT Trichy', type: 'University', submitted: 'Oct 1, 2026', initials: 'N', color: 'bg-orange-600' },
  { id: '55555555-5555-4555-8555-555555555555', name: 'Sustainable India', type: 'Private Org', submitted: 'Sep 30, 2026', initials: 'S', color: 'bg-amber-600' },
];

const initialProjects = [
  { title: 'AI for Soil Analysis', organization: 'IIT Bangalore', submitted: 'Oct 4, 2026', initials: 'A', art: 'bg-emerald-700' },
  { title: 'Blockchain for Carbon Credits', organization: 'GreenTech Labs', submitted: 'Oct 3, 2026', initials: 'B', art: 'bg-indigo-600' },
  { title: 'IoT for Rural Healthcare', organization: 'HealthAI Foundation', submitted: 'Oct 2, 2026', initials: 'I', art: 'bg-blue-600' },
  { title: 'Smart Water Management', organization: 'NIT Trichy', submitted: 'Oct 1, 2026', initials: 'W', art: 'bg-cyan-600' },
  { title: 'Renewable Energy Grid', organization: 'Sustainable India', submitted: 'Sep 30, 2026', initials: 'R', art: 'bg-amber-600' },
];

const securityEvents = [
  { title: 'New login from unknown device', when: '2 minutes ago', detail: 'A sign-in from an unrecognized device was flagged for review. Sample event; no live security log is connected.', icon: Shield, color: 'bg-amber-600' },
  { title: 'Multiple failed login attempts', when: '15 minutes ago', detail: 'Several unsuccessful sign-in attempts were detected for a sample account. Sample event; no live security log is connected.', icon: AlertTriangle, color: 'bg-rose-600' },
  { title: 'Organization verification updated', when: '1 hour ago', detail: 'An organization verification event appears in this sample audit feed. No live security log is connected.', icon: Building2, color: 'bg-orange-600' },
  { title: 'Suspicious API activity detected', when: '3 hours ago', detail: 'An API activity pattern was flagged in the sample feed. No live security log is connected.', icon: Activity, color: 'bg-blue-600' },
  { title: 'User role modified', when: '5 hours ago', detail: 'A role-change event appears in this sample audit feed. No live security log is connected.', icon: Settings, color: 'bg-blue-600' },
];

const initialUsers = [
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'Rahul Sharma', role: 'Student', roleCode: 'STUDENT', joined: 'Joined 2 hours ago', status: 'Verified', initials: 'RS', color: 'from-orange-300 to-rose-500' },
  { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', name: 'Sneha Iyer', role: 'Researcher', roleCode: 'RESEARCHER', joined: 'Joined 4 hours ago', status: 'Verified', initials: 'SI', color: 'from-amber-200 to-orange-500' },
  { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', name: 'Aditya Reddy', role: 'Mentor', roleCode: 'MENTOR', joined: 'Joined 6 hours ago', status: 'Pending', initials: 'AR', color: 'from-violet-300 to-indigo-600' },
  { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', name: 'Kavya Nair', role: 'Student', roleCode: 'STUDENT', joined: 'Joined 8 hours ago', status: 'Verified', initials: 'KN', color: 'from-sky-300 to-blue-600' },
  { id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', name: 'Vikram Patel', role: 'Sponsor', roleCode: 'SPONSOR', joined: 'Joined 1 day ago', status: 'Verified', initials: 'VP', color: 'from-emerald-300 to-teal-600' },
];
type DashboardUser = {
  id: string;
  name: string;
  role: string;
  roleCode: string;
  joined: string;
  status: string;
  initials: string;
  color: string;
};

const meshAgents = [
  { title: 'Research Agent', tasks: '12 tasks', color: 'bg-violet-600', icon: Sparkles },
  { title: 'Analysis Agent', tasks: '8 tasks', color: 'bg-blue-600', icon: BarChart3 },
  { title: 'Evidence Agent', tasks: '15 tasks', color: 'bg-emerald-600', icon: ShieldCheck },
  { title: 'Contribution Agent', tasks: '10 tasks', color: 'bg-orange-500', icon: FileCheck2 },
  { title: 'Reporting Agent', tasks: '6 tasks', color: 'bg-rose-600', icon: ClipboardCheck },
];

const quickActions = [
  { label: 'Add New User', icon: Users, kind: 'user' },
  { label: 'Verify Organization', icon: Building2, kind: 'organization' },
  { label: 'Approve Project', icon: FolderKanban, kind: 'project' },
  { label: 'View Reports', icon: BarChart3, kind: 'reports' },
  { label: 'Send Announcement', icon: Megaphone, kind: 'announcement' },
  { label: 'Manage AI Agents', icon: Network, kind: 'agents' },
];
const platformServices = [
  { name: 'Database', icon: Database },
  { name: 'AI Mesh Services', icon: Network },
  { name: 'File Storage', icon: Server },
  { name: 'API Services', icon: Gauge },
];

function SectionTitle({ title, href, linkLabel = 'View All' }: { title: string; href: string; linkLabel?: string }) {
  return <div className="mb-2 flex items-center justify-between gap-2"><h2 className="text-[10px] font-bold text-slate-100">{title}</h2><Link href={href} className="inline-flex shrink-0 items-center gap-1 text-[8px] font-semibold text-sky-400 hover:text-sky-300">{linkLabel} <ArrowRight className="size-3" aria-hidden="true" /></Link></div>;
}

const userGrowthSeries = [
  { name: 'Students', color: '#8b5cf6', legendColor: 'bg-violet-500', value: '102', values: [30, 54, 73, 101, 127, 151, 174, 195] },
  { name: 'Researchers', color: '#06b6d4', legendColor: 'bg-cyan-500', value: '48', values: [22, 37, 48, 66, 82, 105, 127, 151] },
  { name: 'Mentors', color: '#10b981', legendColor: 'bg-emerald-500', value: '18', values: [8, 13, 17, 22, 27, 31, 37, 43] },
  { name: 'Sponsors', color: '#f59e0b', legendColor: 'bg-amber-500', value: '8', values: [4, 7, 10, 13, 17, 20, 24, 28] },
  { name: 'Organizations', color: '#eab308', legendColor: 'bg-yellow-400', value: '24', values: [3, 6, 8, 11, 13, 17, 20, 24] },
];

function LineChart({ visibleSeries }: { visibleSeries: Set<string> }) {
  const points = (values: number[]) => values.map((value, index) => `${30 + index * 33},${190 - value * .72}`).join(' ');
  return <svg viewBox="0 0 300 220" className="h-28 w-full" role="img" aria-label="User growth by role over the last six months">
    {[0, 50, 100, 150, 200].map((value) => <g key={value}><path d={`M26 ${190 - value * .72}H275`} stroke="#24344a" strokeDasharray="3 4" /><text x="0" y={193 - value * .72} fill="#64748b" fontSize="7">{value}</text></g>)}
    {userGrowthSeries.filter((item) => visibleSeries.has(item.name)).map((item) => <g key={item.name}><polyline points={points(item.values)} fill="none" stroke={item.color} strokeWidth="2" />{item.values.map((value, index) => <circle key={`${item.name}-${index}`} cx={30 + index * 33} cy={190 - value * .72} r="2" fill={item.color} />)}</g>)}
    {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, index) => <text key={month} x={26 + index * 38} y="210" fill="#64748b" fontSize="7">{month}</text>)}
  </svg>;
}

export function AdminDashboardDemo() {
  const { currentUser } = useRole();
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [projects, setProjects] = useState(initialProjects);
  const [users, setUsers] = useState<DashboardUser[]>(initialUsers);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ kind: string; label: string } | null>(null);
  const [formValue, setFormValue] = useState('');
  const [visibleGrowth, setVisibleGrowth] = useState(() => new Set(userGrowthSeries.map(({ name }) => name)));
  const [visibleProjectStatuses, setVisibleProjectStatuses] = useState(() => new Set(['Active', 'Under Review', 'Completed', 'On Hold', 'Rejected']));
  const [visibleContributionSeries, setVisibleContributionSeries] = useState(() => new Set(['Submitted', 'Verified', 'Under Review']));
  const [detail, setDetail] = useState<{ title: string; body: string; userId?: string } | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [busyOrganizationId, setBusyOrganizationId] = useState<string | null>(null);
  const adminName = currentUser.name || 'System Administrator';

  const toggleSetValue = (setValue: Dispatch<SetStateAction<Set<string>>>, value: string) => {
    setValue((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const decideOrganization = async (organization: (typeof initialOrganizations)[number]) => {
    if (busyOrganizationId) return;
    if (!organizations.some((item) => item.id === organization.id)) return;
    setBusyOrganizationId(organization.id);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/organization-verifications/${organization.id}/decision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'APPROVED' }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? 'Verification decision could not be recorded.');
      setOrganizations((items) => items.filter((item) => item.id !== organization.id));
      setNotice(`${organization.name} was approved.`);
    } catch (decisionError) {
      setError(`${organization.name}: ${decisionError instanceof Error ? decisionError.message : 'Verification decision could not be recorded.'}`);
    } finally {
      setBusyOrganizationId(null);
    }
  };

  const saveUserRole = async (userId: string) => {
    const user = users.find((item) => item.id === userId);
    if (!user || busyUserId) return;
    const previousRole = user.roleCode;
    const nextRole = selectedRoles[userId] ?? previousRole;
    if (!['STUDENT', 'RESEARCHER', 'MENTOR', 'SPONSOR', 'ADMIN'].includes(nextRole)) return;
    setBusyUserId(userId);
    setError(null);
    setNotice(null);
    setUsers((items) => items.map((item) => item.id === userId
      ? { ...item, roleCode: nextRole as typeof item.roleCode, role: `${nextRole[0]}${nextRole.slice(1).toLowerCase()}` }
      : item));
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? 'Role update failed.');
      setNotice(`${user.name}'s role was updated.`);
    } catch (updateError) {
      setUsers((items) => items.map((item) => item.id === userId
        ? { ...item, roleCode: previousRole, role: `${previousRole[0]}${previousRole.slice(1).toLowerCase()}` }
        : item));
      setSelectedRoles((items) => ({ ...items, [userId]: previousRole }));
      setError(`${user.name}'s role was not changed: ${updateError instanceof Error ? updateError.message : 'Role update failed.'}`);
    } finally {
      setBusyUserId(null);
    }
  };

  const runAction = (kind: string, label: string) => {
    if (kind === 'organization') {
      document.querySelector('#organizations')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (kind === 'project') {
      if (projects.length) {
        const item = projects[0];
        setProjects((items) => items.slice(1));
        setNotice(`${item.title} was approved in this preview.`);
      } else {
        document.querySelector('#approvals')?.scrollIntoView({ behavior: 'smooth' });
        setNotice('There are no pending project approvals in this preview.');
      }
      return;
    }
    setFormValue('');
    setDialog({ kind, label });
  };

  const submitAction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = formValue.trim();
    if (!value || !dialog) return;
    if (dialog.kind === 'user') {
      setUsers((items) => [{
        id: crypto.randomUUID(), name: value, role: 'Student', roleCode: 'STUDENT', joined: 'Just now',
        status: 'Pending', initials: value.split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase(),
        color: 'from-blue-400 to-violet-600',
      }, ...items]);
    }
    setNotice(`${dialog.label}: “${value}” was added to this local preview.`);
    setDialog(null);
  };

  return <div className="-mx-4 -mt-6 space-y-2 px-2 pb-8 pt-0 sm:-mx-6 sm:px-2 lg:-mx-8 lg:px-2">
    <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_15.5rem]">
      <main className="min-w-0 space-y-2.5">
        <section id="overview" className="relative isolate flex min-h-[8.5rem] items-center overflow-hidden rounded-xl border border-blue-900/50 bg-[radial-gradient(ellipse_at_68%_45%,rgba(37,99,235,.45),transparent_36%),linear-gradient(110deg,#07182c,#0a2b4d_54%,#08182c)] p-4 sm:min-h-[9rem] sm:p-5">
          <div className="absolute inset-y-0 right-0 -z-10 w-[55%] opacity-85" aria-hidden="true"><svg viewBox="0 0 600 200" className="size-full" fill="none"><defs><radialGradient id="admin-globe"><stop stopColor="#34d399" stopOpacity=".85" /><stop offset=".65" stopColor="#2563eb" stopOpacity=".55" /><stop offset="1" stopColor="#0f172a" stopOpacity="0" /></radialGradient></defs><circle cx="365" cy="95" r="108" fill="url(#admin-globe)" /><circle cx="365" cy="95" r="68" stroke="#60a5fa" strokeOpacity=".55" /><ellipse cx="365" cy="95" rx="30" ry="68" stroke="#60a5fa" strokeOpacity=".55" /><path d="M298 95h134M308 63h114m-114 64h114" stroke="#60a5fa" strokeOpacity=".45" /><path d="m321 66 19-8 13 9 22-5 16 13-5 16-19 6-8 16-19-2-12 13-15-14 7-17-11-15z" fill="#34d399" fillOpacity=".7" /><path d="M46 160V55h110v105m-92-105V34h73v21m-64-21 28-19 28 19m211 122V65h115v95m-93-95V42h70v23m-60-23 25-20 25 20M0 170h600" stroke="#7dd3fc" strokeOpacity=".65" strokeWidth="2" /></svg></div>
          <div className="relative min-w-0 max-w-xl xl:max-w-[58%]"><p className="text-[10px] font-medium text-blue-100">Welcome back,</p><h1 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">{adminName} <span aria-label="waving hand">👋</span></h1><p className="mt-1 max-w-lg text-[9px] leading-4 text-blue-100/80 sm:text-[10px]">Manage the platform, verify organizations, monitor research, and ensure impactful collaboration.</p><div className="mt-3 flex flex-wrap gap-2"><Link href="/admin/analytics" className="rounded-md bg-blue-600 px-3 py-2 text-[9px] font-bold text-white hover:bg-blue-500">View Platform Overview</Link><Link href="/admin/users" className="rounded-md border border-white/20 bg-slate-950/30 px-3 py-2 text-[9px] font-semibold text-white hover:bg-white/10">Manage Users</Link></div></div><blockquote className="relative z-10 ml-auto hidden max-w-[14rem] shrink-0 rounded-lg border border-white/10 bg-slate-950/35 px-4 py-3 text-right shadow-lg xl:block"><p className="text-xs font-medium italic leading-5 text-blue-50">“Good governance turns collaboration into lasting impact.”</p><cite className="mt-2 block text-[8px] not-italic text-sky-200">— Admin principle</cite></blockquote><span className="absolute right-3 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/80 px-2 py-1 text-[7px] font-bold text-white"><span className="size-1.5 rounded-full bg-emerald-200" />Demo Mode</span>
        </section>

        <section aria-label="Platform summary" className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-5">
          {[
            { title: 'Total Users', value: '186', detail: '102 Students · 48 Researchers', sub: '18 Mentors · 8 Sponsors · 10 Admins', change: '12%', icon: Users, color: 'bg-blue-600', href: '/admin/users' },
            { title: 'Organizations', value: '24', detail: '18 Verified · 4 Pending', sub: '2 Rejected', change: '4', icon: Building2, color: 'bg-violet-600', href: '/admin/organizations' },
            { title: 'Research Projects', value: '38', detail: '28 Active · 6 Under Review', sub: '4 Completed', change: '6', icon: FolderKanban, color: 'bg-emerald-600', href: '/admin/projects' },
            { title: 'Access Requests', value: '12', detail: '8 Pending · 3 Approved', sub: '1 Rejected', change: '↓ 3', icon: ClipboardCheck, color: 'bg-orange-500', href: '/admin/access-requests' },
            { title: 'Total Contributions', value: '420', detail: '156 Verified · 42 Under Review', sub: '222 Pending', change: '18%', icon: Star, color: 'bg-pink-600', href: '/admin/contributions' },
          ].map(({ title, value, detail, sub, change, icon: Icon, color, href }) => <Link href={href} key={title} className="block rounded-lg border border-[#1c2a3d] bg-[#0d1624] p-2 transition hover:border-blue-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"><div className="flex items-center gap-2"><span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${color} text-white`}><Icon className="size-4" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="truncate text-[7px] text-slate-400">{title}</p><p className="text-base font-extrabold leading-5 text-white">{value}</p></div><span className={`text-[7px] font-bold ${change.startsWith('↓') ? 'text-rose-400' : 'text-emerald-400'}`}>{change.startsWith('↓') ? '' : '↑ '}{change}</span></div><p className="mt-1 truncate text-[6px] text-slate-400">{detail}</p><p className="truncate text-[6px] text-slate-500">{sub}</p></Link>)}
        </section>

        {notice && <p role="status" className="rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-[8px] text-emerald-300">{notice}</p>}
        {error && <p role="alert" className="rounded-md bg-rose-500/10 px-2.5 py-1.5 text-[8px] text-rose-300">{error}</p>}

        <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.9fr)_minmax(0,.9fr)]">
          <section id="analytics" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-2.5"><SectionTitle title="User Growth" href="#analytics" /><p className="-mt-1 text-[7px] text-slate-400">Last 6 months · select a role to show or hide it</p><div className="mt-1 flex gap-2"><div className="min-w-0 flex-1"><LineChart visibleSeries={visibleGrowth} /></div><ul className="space-y-1 pt-2 text-[7px]">{userGrowthSeries.map(({ name, value, legendColor }) => <li key={name}><button type="button" aria-pressed={visibleGrowth.has(name)} onClick={() => toggleSetValue(setVisibleGrowth, name)} className={`flex w-full items-center gap-1 whitespace-nowrap text-left ${visibleGrowth.has(name) ? 'text-slate-300' : 'text-slate-500 line-through'}`}><i className={`size-1.5 rounded-full ${legendColor} ${visibleGrowth.has(name) ? '' : 'opacity-30'}`} />{name}<span className="ml-auto pl-1 text-slate-400">{value}</span></button></li>)}</ul></div></section>

          <section id="projects" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-2.5"><SectionTitle title="Project Status" href="#projects" /><p className="mb-1 text-[6px] text-slate-500">Select donut segments or statuses to filter the chart</p>{(() => { const statuses = [{ label: 'Active', count: 28, color: '#3b82f6', legendColor: 'bg-blue-500' }, { label: 'Under Review', count: 6, color: '#10b981', legendColor: 'bg-emerald-500' }, { label: 'Completed', count: 4, color: '#f59e0b', legendColor: 'bg-amber-500' }, { label: 'On Hold', count: 0, color: '#f97316', legendColor: 'bg-orange-500' }, { label: 'Rejected', count: 0, color: '#f43f5e', legendColor: 'bg-rose-500' }]; const selected = statuses.filter(({ label }) => visibleProjectStatuses.has(label)); const total = selected.reduce((sum, item) => sum + item.count, 0); let cursor = 0; const segments = selected.map((item) => { const start = cursor; cursor += total ? item.count / total * 100 : 0; return { ...item, start, end: cursor }; }); const toggleSegment = (label: string) => toggleSetValue(setVisibleProjectStatuses, label); const handleSegmentKey = (event: KeyboardEvent<SVGElement>, label: string) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSegment(label); } }; const point = (percentage: number) => { const angle = percentage / 100 * Math.PI * 2 - Math.PI / 2; return [50 + 45 * Math.cos(angle), 50 + 45 * Math.sin(angle)]; }; return <div className="flex items-center gap-2"><div className="relative flex size-[5.6rem] shrink-0 items-center justify-center"><svg viewBox="0 0 100 100" className="absolute inset-0 size-full" role="group" aria-label={`${total} projects in selected statuses`}>{segments.filter(({ count }) => count > 0).map((segment) => { const [startX, startY] = point(segment.start); const [endX, endY] = point(segment.end); const isFull = segment.end - segment.start > 99.99; const path = `M 50 50 L ${startX} ${startY} A 45 45 0 ${segment.end - segment.start > 50 ? 1 : 0} 1 ${endX} ${endY} Z`; return isFull ? <circle key={segment.label} cx="50" cy="50" r="45" fill={segment.color} role="button" tabIndex={0} aria-label={`Filter ${segment.label} projects`} onClick={() => toggleSegment(segment.label)} onKeyDown={(event) => handleSegmentKey(event, segment.label)} className="cursor-pointer focus-visible:stroke-white focus-visible:stroke-2" /> : <path key={segment.label} d={path} fill={segment.color} role="button" tabIndex={0} aria-label={`Filter ${segment.label} projects`} onClick={() => toggleSegment(segment.label)} onKeyDown={(event) => handleSegmentKey(event, segment.label)} className="cursor-pointer focus-visible:stroke-white focus-visible:stroke-2" />; })}</svg><div className="pointer-events-none relative z-10 flex size-[4.1rem] flex-col items-center justify-center rounded-full bg-[#0d1624]"><span className="text-base font-bold text-white">{total}</span><span className="text-[6px] text-slate-400">Selected Projects</span></div></div><ul className="min-w-0 flex-1 space-y-1 text-[7px]">{statuses.map(({ label, count, legendColor }) => <li key={label}><button type="button" aria-pressed={visibleProjectStatuses.has(label)} onClick={() => toggleSegment(label)} className={`flex w-full items-center gap-1 whitespace-nowrap text-left ${visibleProjectStatuses.has(label) ? 'text-slate-300' : 'text-slate-500 line-through'}`}><i className={`size-1.5 rounded-full ${legendColor} ${visibleProjectStatuses.has(label) ? '' : 'opacity-30'}`} />{label}<span className="ml-auto pl-1 text-slate-400">{count} ({Math.round(count / 38 * 100)}%)</span></button></li>)}</ul></div>; })()}</section>

          <section id="contributions" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-2.5"><SectionTitle title="Contribution Activity" href="#contributions" /><div className="mb-2 flex justify-center gap-2 text-[6px]">{[{ name: 'Submitted', color: 'bg-blue-500' }, { name: 'Verified', color: 'bg-emerald-500' }, { name: 'Under Review', color: 'bg-amber-400' }].map(({ name, color }) => <button key={name} type="button" aria-pressed={visibleContributionSeries.has(name)} onClick={() => toggleSetValue(setVisibleContributionSeries, name)} className={`flex items-center text-slate-400 ${visibleContributionSeries.has(name) ? '' : 'opacity-40 line-through'}`}><i className={`mr-1 inline-block size-1.5 rounded-full ${color}`} />{name}</button>)}</div><svg viewBox="0 0 250 145" className="h-28 w-full" role="img" aria-label="Monthly contribution activity"><path d="M25 20H246M25 50H246M25 80H246M25 110H246" stroke="#26364b" strokeDasharray="3 4" />{[0, 1, 2, 3, 4, 5, 6].map((month, index) => { const x = 35 + index * 30; const values = [35, 48, 43, 64, 72, 59, 86]; return <g key={month}>{visibleContributionSeries.has('Submitted') && <rect x={x} y={112 - values[index] * .65} width="6" height={values[index] * .65} rx="1" fill="#3b82f6" />}{visibleContributionSeries.has('Verified') && <rect x={x + 7} y={112 - values[index] * .45} width="6" height={values[index] * .45} rx="1" fill="#10b981" />}{visibleContributionSeries.has('Under Review') && <rect x={x + 14} y={112 - values[index] * .32} width="6" height={values[index] * .32} rx="1" fill="#f59e0b" />}<text x={x - 2} y="130" fill="#64748b" fontSize="7">{['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][index]}</text></g>; })}</svg></section>
        </div>

        <div className="grid gap-2.5 xl:grid-cols-2">
          <section id="organizations" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-2.5"><SectionTitle title="Pending Organization Verifications" href="#organizations" /><div className="grid grid-cols-[minmax(0,1.1fr)_minmax(4.5rem,.8fr)_minmax(5rem,.8fr)_auto_auto] gap-1 border-b border-[#203047] pb-1 text-[6px] font-semibold text-slate-500"><span>Organization</span><span>Type</span><span>Submitted On</span><span>Status</span><span>Action</span></div><ul className="divide-y divide-[#1c2a3d]">{organizations.map((organization) => <li key={organization.id} className="grid grid-cols-[minmax(0,1.1fr)_minmax(4.5rem,.8fr)_minmax(5rem,.8fr)_auto_auto] items-center gap-1 py-1"><span className="flex min-w-0 items-center gap-1.5"><span className={`flex size-5 shrink-0 items-center justify-center rounded ${organization.color} text-[7px] font-bold text-white`}>{organization.initials}</span><span className="truncate text-[7px] font-semibold text-slate-200">{organization.name}</span></span><span className="truncate text-[6px] text-slate-400">{organization.type}</span><span className="text-[6px] text-slate-400">{organization.submitted}</span><span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[6px] text-amber-300">Pending</span><button type="button" disabled={busyOrganizationId !== null} onClick={() => void decideOrganization(organization)} className="rounded bg-blue-600 px-2 py-1 text-[6px] font-bold text-white hover:bg-blue-500 disabled:cursor-wait disabled:opacity-50">{busyOrganizationId === organization.id ? 'Verifying…' : 'Verify'}</button></li>)}</ul>{!organizations.length && <p className="py-4 text-center text-[8px] text-slate-400">All organization verifications are reviewed.</p>}</section>

          <section id="approvals" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-2.5"><SectionTitle title="Pending Project Approvals" href="#approvals" /><div className="grid grid-cols-[minmax(0,1.1fr)_minmax(4rem,.8fr)_minmax(5rem,.8fr)_auto_auto] gap-1 border-b border-[#203047] pb-1 text-[6px] font-semibold text-slate-500"><span>Project Title</span><span>Organization</span><span>Submitted On</span><span className="col-span-2">Action</span></div><ul className="divide-y divide-[#1c2a3d]">{projects.map((project) => <li key={project.title} className="grid grid-cols-[minmax(0,1.1fr)_minmax(4rem,.8fr)_minmax(5rem,.8fr)_auto_auto] items-center gap-1 py-1"><span className="flex min-w-0 items-center gap-1.5"><span className={`flex size-5 shrink-0 items-center justify-center rounded ${project.art} text-[7px] font-bold text-white`}>{project.initials}</span><span className="truncate text-[7px] font-semibold text-slate-200">{project.title}</span></span><span className="truncate text-[6px] text-slate-400">{project.organization}</span><span className="text-[6px] text-slate-400">{project.submitted}</span><button type="button" onClick={() => { setProjects((items) => items.filter((item) => item.title !== project.title)); setNotice(`${project.title} was approved in this preview.`); }} className="rounded bg-emerald-700 px-2 py-1 text-[6px] font-bold text-white hover:bg-emerald-600">Approve</button><button type="button" onClick={() => { setProjects((items) => items.filter((item) => item.title !== project.title)); setNotice(`${project.title} was rejected in this preview.`); }} className="rounded bg-rose-700 px-2 py-1 text-[6px] font-bold text-white hover:bg-rose-600">Reject</button></li>)}</ul>{!projects.length && <p className="py-4 text-center text-[8px] text-slate-400">All project approvals are reviewed.</p>}</section>
        </div>

        <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <section id="mesh" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-2.5"><SectionTitle title="AI Mesh System Monitor" href="/admin/mesh" linkLabel="View Details" /><div className="grid grid-cols-2 gap-1 sm:grid-cols-5">{meshAgents.map(({ title, tasks, color, icon: Icon }) => <article key={title} className="rounded-md border border-[#203047] bg-[#101b2b] p-1.5"><div className="flex items-center gap-1.5"><span className={`flex size-6 shrink-0 items-center justify-center rounded ${color} text-white`}><Icon className="size-3" aria-hidden="true" /></span><span className="truncate text-[6px] font-semibold text-slate-200">{title}</span></div><p className="mt-1 text-[6px] text-emerald-300">● Online</p><p className="mt-0.5 text-[6px] text-slate-500">{tasks}</p></article>)}</div></section>

          <section id="settings" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-2.5"><h2 className="mb-2 text-[10px] font-bold text-slate-100">Quick Actions</h2><div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">{quickActions.map(({ label, icon: Icon, kind }) => { const href = kind === 'reports' ? '/admin/reports' : kind === 'agents' ? '/admin/mesh' : null; const content = <><span className="flex size-5 shrink-0 items-center justify-center rounded bg-blue-600 text-white"><Icon className="size-3" aria-hidden="true" /></span><span className="truncate">{label}</span></>; const className = 'flex min-w-0 items-center gap-1.5 rounded-md border border-[#203047] bg-[#101b2b] px-2 py-2 text-left text-[7px] font-semibold text-slate-200 hover:border-blue-500/50 hover:bg-[#14233a]'; return href ? <Link key={label} href={href} className={className}>{content}</Link> : <button key={label} type="button" onClick={() => runAction(kind, label)} className={className}>{content}</button>; })}</div></section>
        </div>
      </main>

      <aside className="space-y-2.5">
        <section id="health" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3"><SectionTitle title="Platform Health" href="#health" /><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[8px] font-semibold text-emerald-300"><CheckCircle2 className="size-3" />All systems operational</span><span className="text-sm font-extrabold text-emerald-400">99.9%</span></div><p className="mb-2 text-right text-[6px] text-slate-500">Uptime</p><ul className="space-y-1.5">{platformServices.map(({ name, icon: HealthIcon }) => <li key={name}><button type="button" onClick={() => setDetail({ title: name, body: `${name} is operational in this dashboard sample. Health values shown here are preview data, not a live service check.` })} className="flex w-full items-center gap-2 rounded text-left text-[7px] hover:bg-white/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-blue-400"><HealthIcon className="size-3 text-emerald-400" /><span className="min-w-0 flex-1 text-slate-300">{name}</span><span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[6px] text-emerald-300">Operational</span></button></li>)}</ul></section>

        <section id="audit" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3"><SectionTitle title="Recent Security Events" href="#audit" /><ul className="divide-y divide-[#1c2a3d]">{securityEvents.map(({ title, when, detail: eventDetail, icon: Icon, color }) => <li key={title}><button type="button" onClick={() => setDetail({ title, body: eventDetail })} className="flex w-full items-center gap-1.5 py-2 text-left hover:bg-white/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-blue-400 first:pt-0 last:pb-0"><span className={`flex size-6 shrink-0 items-center justify-center rounded ${color} text-white`}><Icon className="size-3" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[7px] font-semibold text-slate-200">{title}</span><span className="block text-[6px] text-slate-500">{when} · Sample event</span></span></button></li>)}</ul></section>

        <section id="users" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3"><SectionTitle title="Latest Users" href="#users" /><ul className="divide-y divide-[#1c2a3d]">{users.slice(0, 6).map((user) => <li key={user.id}><button type="button" onClick={() => { setSelectedRoles((roles) => ({ ...roles, [user.id]: roles[user.id] ?? user.roleCode })); setDetail({ title: user.name, body: `${user.status} account · ${user.joined}. This is sample dashboard data; role updates are sent to the admin API.`, userId: user.id }); }} className="flex w-full items-center gap-1.5 py-2 text-left hover:bg-white/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-blue-400 first:pt-0 last:pb-0"><span className={`flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${user.color} text-[7px] font-bold text-white`}>{user.initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-[7px] font-semibold text-slate-200">{user.name}</span><span className="block text-[6px] text-slate-500">{user.role} · {user.joined}</span></span><span className={`rounded-full px-1.5 py-0.5 text-[6px] ${user.status === 'Verified' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{user.status}</span></button></li>)}</ul></section>
        <span id="announcements" className="sr-only" /><span id="requests" className="sr-only" /><span id="reports" className="sr-only" />
      </aside>
    </div>

    {detail && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget && !busyUserId) setDetail(null); }}><section role="dialog" aria-modal="true" aria-labelledby="admin-detail-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">{detail.userId ? 'Sample user detail' : 'Dashboard sample detail'}</p><h2 id="admin-detail-title" className="mt-1 text-base font-bold text-white">{detail.title}</h2></div><button type="button" aria-label="Close details" disabled={Boolean(busyUserId)} onClick={() => setDetail(null)} className="rounded-md p-1 text-slate-400 hover:bg-white/5 disabled:opacity-50"><X className="size-4" /></button></div><p className="mt-3 text-xs leading-5 text-slate-300">{detail.body}</p>{detail.userId && error && <p role="alert" className="mt-3 rounded-md bg-rose-500/10 px-2.5 py-1.5 text-[10px] text-rose-300">{error}</p>}{detail.userId && (() => { const user = users.find((item) => item.id === detail.userId); if (!user) return null; const selectedRole = selectedRoles[user.id] ?? user.roleCode; return <div className="mt-4"><label htmlFor="sample-user-role" className="block text-xs font-semibold text-slate-200">Role</label><select id="sample-user-role" disabled={busyUserId === user.id} value={selectedRole} onChange={(event) => setSelectedRoles((roles) => ({ ...roles, [user.id]: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2.5 text-xs text-white">{['STUDENT', 'RESEARCHER', 'MENTOR', 'SPONSOR', 'ADMIN'].map((role) => <option key={role} value={role}>{role}</option>)}</select><p className="mt-2 text-[9px] leading-4 text-slate-500">Preview user IDs are sample UUIDs and may not exist in the API. The server response will be shown; a failed request restores the previous role.</p><div className="mt-4 flex justify-end gap-2"><button type="button" disabled={Boolean(busyUserId)} onClick={() => setDetail(null)} className="rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">Close</button><button type="button" disabled={Boolean(busyUserId) || selectedRole === user.roleCode} onClick={() => void saveUserRole(user.id)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">{busyUserId === user.id ? 'Saving…' : 'Save role'}</button></div></div>; })()}</section></div>}

    {dialog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setDialog(null); }}><form role="dialog" aria-modal="true" aria-labelledby="admin-action-title" onSubmit={submitAction} className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Admin workspace</p><h2 id="admin-action-title" className="mt-1 text-base font-bold text-white">{dialog.label}</h2></div><button type="button" aria-label="Close action" onClick={() => setDialog(null)} className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" /></button></div><label className="mt-4 block text-xs font-semibold text-slate-200">{dialog.kind === 'user' ? 'User name' : 'Announcement'}<input autoFocus value={formValue} onChange={(event) => setFormValue(event.target.value)} maxLength={120} required placeholder={dialog.kind === 'user' ? 'e.g. Alex Morgan' : 'Write an announcement'} className="mt-2 w-full rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500" /></label><p className="mt-2 text-[9px] leading-4 text-slate-500">This action updates only the local preview and does not change platform data.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDialog(null)} className="rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/5">Cancel</button><button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500">Continue</button></div></form></div>}
  </div>;
}
