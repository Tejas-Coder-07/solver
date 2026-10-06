'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Award, BookOpen, Bot, BriefcaseBusiness, Check,
  CheckSquare, ChevronRight, CircleDollarSign, Clock3, FileCheck2, FlaskConical, FolderKanban,
  HeartPulse, Leaf, MessageSquare, Send, ShieldCheck, Sparkles, Wallet, X,
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

const projects = [
  {
    title: 'AI for Climate Monitoring',
    organization: 'GreenEarth Foundation',
    description: 'Build ML models to analyze satellite imagery for deforestation detection and climate impact assessment.',
    tags: ['AI/ML', 'Environment'],
    match: 95,
    members: '+3 members',
    icon: Leaf,
    art: 'from-emerald-950 via-green-800 to-lime-500',
  },
  {
    title: 'Secure IoT for Healthcare',
    organization: 'HealthTech Labs',
    description: 'Research on securing medical IoT devices in hospital networks.',
    tags: ['Healthcare', 'IoT'],
    match: 92,
    members: '+2 members',
    icon: HeartPulse,
    art: 'from-indigo-950 via-violet-800 to-cyan-400',
  },
  {
    title: 'Decentralized Education Records',
    organization: 'EduChain Initiative',
    description: 'Build a blockchain-based credential verification system for students.',
    tags: ['Blockchain', 'Education'],
    match: 85,
    members: '+4 members',
    icon: BookOpen,
    art: 'from-blue-950 via-blue-700 to-fuchsia-500',
  },
];

const tasks = [
  { title: 'Data preprocessing pipeline', project: 'AI Climate Monitoring', priority: 'High', progress: 66, due: 'Oct 10, 2026', color: 'bg-rose-500' },
  { title: 'Literature review on IoT security', project: 'Secure IoT for Healthcare', priority: 'Medium', progress: 30, due: 'Oct 12, 2026', color: 'bg-amber-500' },
  { title: 'Implement authentication module', project: 'EduChain Platform', priority: 'High', progress: 0, due: 'Oct 15, 2026', color: 'bg-rose-500' },
  { title: 'Write experiment report', project: 'AI Climate Monitoring', priority: 'Low', progress: 0, due: 'Oct 18, 2026', color: 'bg-emerald-500' },
];

const deadlines = [
  { title: 'Data preprocessing pipeline', project: 'AI Climate Monitoring', date: '2 days left', icon: FolderKanban, color: 'bg-blue-600' },
  { title: 'Literature review on IoT security', project: 'Secure IoT for Healthcare', date: '6 days left', icon: BookOpen, color: 'bg-violet-600' },
  { title: 'Experiment report', project: 'AI Climate Monitoring', date: 'Oct 18, 2026', icon: FlaskConical, color: 'bg-emerald-600' },
  { title: 'Final presentation', project: 'Decentralized Education', date: 'Oct 20, 2026', icon: BriefcaseBusiness, color: 'bg-orange-500' },
];

const activity = [
  { title: 'Submitted data augmentation pipeline', project: 'AI Climate Monitoring', when: '2 hours ago', icon: ArrowUpRight, color: 'bg-emerald-600' },
  { title: 'Task approved', project: 'Secure IoT for Healthcare', when: '1 day ago', icon: FileCheck2, color: 'bg-violet-600' },
  { title: 'Earned 50 credits', project: 'Research contribution', when: '2 days ago', icon: Award, color: 'bg-amber-500' },
  { title: 'Mentor feedback received', project: 'Dr. Priya Nair commented', when: '3 days ago', icon: MessageSquare, color: 'bg-blue-600' },
];

const skills = [
  { name: 'Python', score: 95, icon: 'Py', color: 'text-sky-300' },
  { name: 'Machine Learning', score: 88, icon: 'ML', color: 'text-cyan-300' },
  { name: 'Data Analysis', score: 72, icon: 'DA', color: 'text-amber-300' },
  { name: 'Cybersecurity', score: 90, icon: 'CS', color: 'text-violet-300' },
];

function SectionHeading({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold text-slate-100">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300">
        View all <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

function ProgressRing() {
  return (
    <div
      className="flex size-24 shrink-0 items-center justify-center rounded-full"
      style={{ background: 'conic-gradient(#14b8a6 0 39%, #2563eb 39% 67%, #7c3aed 67% 86%, #172554 86% 100%)' }}
      role="img"
      aria-label="Overall progress 72 percent"
    >
      <div className="flex size-[4.25rem] flex-col items-center justify-center rounded-full bg-[#0c1422]">
        <span className="text-base font-bold text-white">72%</span>
        <span className="text-[9px] text-slate-400">Overall</span>
      </div>
    </div>
  );
}

export function StudentDashboardDemo() {
  const { currentUser } = useRole();
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const [appliedProjects, setAppliedProjects] = useState<string[]>([]);
  const [panel, setPanel] = useState<'task' | 'skill' | 'progress' | 'deadline' | 'activity' | 'assistant' | 'notifications' | 'contribution' | 'mentor' | null>(null);
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[number] | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<(typeof skills)[number] | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<(typeof deadlines)[number] | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<(typeof activity)[number] | null>(null);
  const [taskProgress, setTaskProgress] = useState<Record<string, number>>(() => Object.fromEntries(tasks.map((task) => [task.title, task.progress])));
  const [verificationStarted, setVerificationStarted] = useState<string[]>([]);
  const [contributionTitle, setContributionTitle] = useState('');
  const [contributionSummary, setContributionSummary] = useState('');
  const [contributionNotice, setContributionNotice] = useState('');
  const [localContributions, setLocalContributions] = useState<Array<{ title: string; summary: string }>>([]);
  const [assistantProjectId, setAssistantProjectId] = useState('');
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [assistantError, setAssistantError] = useState('');
  const [assistantResult, setAssistantResult] = useState('');
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; read_at: string | null; created_at: string }>>([]);
  const [notificationsBusy, setNotificationsBusy] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const [busyNotificationId, setBusyNotificationId] = useState<string | null>(null);
  const [mentorReply, setMentorReply] = useState('');
  const [mentorNotice, setMentorNotice] = useState('');
  const [savedMentorReplies, setSavedMentorReplies] = useState<string[]>([]);
  const studentName = currentUser.name || 'Rahul Sharma';

  const openPanel = (nextPanel: typeof panel) => {
    setPanel(nextPanel);
    if (nextPanel === 'notifications') void loadNotifications();
  };

  const loadNotifications = async () => {
    setNotificationsBusy(true);
    setNotificationsError('');
    try {
      const response = await fetch('/api/notifications');
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? 'Notifications could not be loaded.');
      setNotifications(body.notifications ?? []);
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : 'Notifications could not be loaded.');
    } finally {
      setNotificationsBusy(false);
    }
  };

  const markNotificationRead = async (id: string) => {
    setBusyNotificationId(id);
    setNotificationsError('');
    try {
      const response = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? 'Notification could not be marked as read.');
      setNotifications((current) => current.map((item) => item.id === id ? { ...item, read_at: new Date().toISOString() } : item));
      window.dispatchEvent(new Event('gardenia:notifications-updated'));
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : 'Notification could not be marked as read.');
    } finally {
      setBusyNotificationId(null);
    }
  };

  const invokeAssistant = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAssistantBusy(true);
    setAssistantError('');
    setAssistantResult('');
    try {
      const response = await fetch('/api/mesh/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: assistantProjectId, agentType: 'RESEARCH_AGENT', prompt: assistantPrompt }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? 'AI request failed.');
      setAssistantResult(JSON.stringify(body, null, 2));
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : 'AI request failed.');
    } finally {
      setAssistantBusy(false);
    }
  };

  const submitLocalContribution = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalContributions((current) => [...current, { title: contributionTitle, summary: contributionSummary }]);
    setContributionNotice(`“${contributionTitle}” saved in this local preview only. It was not sent to reviewers.`);
    setContributionTitle('');
    setContributionSummary('');
  };

  useEffect(() => {
    if (!selectedProject && !panel) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
        setPanel(null);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedProject, panel]);

  return (
    <div className="-mx-4 -mt-6 space-y-4 px-2 pb-8 pt-0 sm:-mx-6 sm:px-2 lg:-mx-8 lg:px-2">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          <section className="relative isolate min-h-[12.5rem] overflow-hidden rounded-2xl border border-indigo-400/15 bg-[radial-gradient(ellipse_at_72%_40%,rgba(139,92,246,.6),transparent_38%),radial-gradient(ellipse_at_42%_120%,rgba(37,99,235,.65),transparent_52%),linear-gradient(115deg,#11132d,#17275a_52%,#171537)] p-6 sm:p-8">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,10,24,.18),rgba(5,10,24,.04)_70%)]" />
            <div className="absolute -right-6 -top-16 -z-10 size-64 rounded-full border border-white/10 shadow-[0_0_80px_20px_rgba(124,58,237,.18)]" />
            <div className="absolute right-[16%] top-10 -z-10 size-36 rounded-full bg-gradient-to-br from-fuchsia-300/30 via-indigo-400/20 to-cyan-300/10 blur-2xl" />
            <svg className="pointer-events-none absolute -bottom-2 right-0 hidden h-full w-[48%] opacity-90 sm:block" viewBox="0 0 500 250" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="campus" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a5b4fc" stopOpacity=".25" /><stop offset="1" stopColor="#0b1431" /></linearGradient>
                <linearGradient id="hoodie" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c026d3" /><stop offset="1" stopColor="#312e81" /></linearGradient>
              </defs>
              <path d="M0 156 42 120l35 27 42-55 45 47 39-40 37 42 41-51 42 46 45-54 38 44 45-33 49 39v88H0z" fill="#101b48" opacity=".72" />
              <path d="M16 172V108h70v64m-59-64V87h48v21m-40-21 16-17 17 17m78 85V90h83v82m-68-82V70h54v20m-43-20 16-17 17 17m104 102v-62h75v62m-60-62V93h46v23m-38-23 15-16 15 16" fill="url(#campus)" stroke="#a5b4fc" strokeOpacity=".24" strokeWidth="2" />
              <path d="M0 203h500" stroke="#c4b5fd" strokeOpacity=".35" />
              <path d="M42 126h9m10 0h9m-28 14h9m10 0h9m48-47h9m12 0h9m-30 18h9m12 0h9m77 2h9m10 0h9m-28 17h9m10 0h9m53-5h9m12 0h9m-30 17h9m12 0h9" stroke="#fbbf24" strokeOpacity=".62" strokeWidth="3" />
              <path d="M266 250c3-48 18-70 47-79l11-26h49l14 27c24 10 39 35 42 78H266Z" fill="url(#hoodie)" stroke="#c4b5fd" strokeOpacity=".5" strokeWidth="2" />
              <path d="m301 176 24 28 20-27 17 15-24 34h-27l-27-33z" fill="#111a43" stroke="#a5b4fc" strokeOpacity=".5" />
              <path d="M316 144c-4-20-1-43 17-55 15-10 42-6 49 15 4 12 1 33-7 48l-13 17h-28z" fill="#f0b7a4" stroke="#231b39" strokeWidth="4" />
              <path d="M309 129c-10-28-3-61 24-74 18-9 45-3 53 16 19 14 15 43 5 61l-10-24-9-16-24 3-16-9-12 23-8 20z" fill="#101326" stroke="#252047" strokeWidth="5" />
              <path d="M324 117h20m10 0h19m-29 0h10" stroke="#111827" strokeWidth="4" />
              <rect x="322" y="108" width="23" height="17" rx="7" stroke="#111827" strokeWidth="3" />
              <rect x="353" y="108" width="23" height="17" rx="7" stroke="#111827" strokeWidth="3" />
              <path d="M344 116h9m-19 31c7 4 14 4 21 0" stroke="#7c2d45" strokeWidth="2" strokeLinecap="round" />
              <path d="M346 204v46m18-46v46" stroke="#c4b5fd" strokeOpacity=".55" strokeWidth="3" />
              <path d="m285 196 21 13m98-14-20 14" stroke="#f0b7a4" strokeWidth="9" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 max-w-xl flex-1">
                <p className="text-sm font-medium text-indigo-100">Welcome back,</p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{studentName} <span aria-hidden="true">👋</span></h1>
                <p className="mt-2 max-w-lg text-xs leading-5 text-indigo-100/80 sm:text-sm">
                  Explore projects, complete tasks, build skills and earn credits for real impact.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/student/recommended" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-950/30 hover:bg-indigo-500">
                    Explore Projects <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link href="/student/tasks" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-slate-950/30 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10">
                    <CheckSquare className="size-4" aria-hidden="true" /> View My Tasks
                  </Link>
                </div>
              </div>
              <blockquote className="w-full max-w-sm border-l-2 border-violet-400 pl-3 text-left sm:w-36 sm:shrink-0 sm:border-l-0 sm:border-r-2 sm:pb-1 sm:pl-0 sm:pr-3 sm:text-right">
                <p className="text-[11px] italic leading-5 text-indigo-100/90">“Small contributions create big research breakthroughs.”</p>
                <span className="mt-2 block h-0.5 w-10 bg-violet-400 sm:ml-auto" />
              </blockquote>
            </div>
            <Sparkles className="absolute right-[10%] top-7 hidden size-5 text-cyan-200/90 sm:block" aria-hidden="true" />
          </section>

          <section aria-label="Your progress at a glance" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              { label: 'Active Projects', value: '3', change: '1 this month', icon: FolderKanban, color: 'bg-violet-600', href: '/student/projects' },
              { label: 'Assigned Tasks', value: '5', change: '2 this week', icon: CheckSquare, color: 'bg-blue-600', href: '/student/tasks' },
              { label: 'Credits Earned', value: '870', change: '120 this month', icon: CircleDollarSign, color: 'bg-amber-500', href: '/student/credits' },
              { label: 'Skills Verified', value: '4', change: '1 new', icon: ShieldCheck, color: 'bg-emerald-600', href: '/student/skills' },
              { label: 'Contribution Score', value: '92', change: 'Top 10%', icon: Award, color: 'bg-cyan-600', href: '/student/contributions' },
            ].map(({ label, value, change, icon: Icon, color, href }) => (
              <Link key={label} href={href} className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3 transition hover:border-blue-500/60 hover:bg-[#111d2d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
                <div className="flex items-center gap-2.5">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${color} text-white`}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-lg font-extrabold leading-5 text-white">{value}</p>
                    <p className="truncate text-[9px] text-slate-400">{label}</p>
                  </div>
                </div>
                <p className="mt-2 text-[9px] font-medium text-emerald-400">↗ {change}</p>
              </Link>
            ))}
          </section>

          <section>
            <SectionHeading title="Recommended Projects" href="/student/recommended" />
            <p className="-mt-2 mb-3 text-[10px] text-slate-400">AI-matched projects based on your skills and interests</p>
            <div className="grid gap-3 md:grid-cols-3">
              {projects.map((project) => {
                const { title, organization, description, tags, match, members, icon: Icon, art } = project;
                return (
                <article key={title} className="overflow-hidden rounded-xl border border-[#1c2a3d] bg-[#0d1624]">
                  <div className={`relative flex h-24 items-center justify-center overflow-hidden bg-gradient-to-br ${art}`}>
                    <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.75)_1px,transparent_1px)] [background-size:14px_14px]" />
                    <div className="absolute size-28 rounded-full border border-white/20" />
                    <div className="absolute size-20 rounded-full border border-white/20" />
                    <span className="relative flex size-12 items-center justify-center rounded-2xl border border-white/30 bg-slate-950/25 text-white shadow-xl backdrop-blur-sm">
                      <Icon className="size-7" aria-hidden="true" />
                    </span>
                    <span className="absolute right-2 top-2 rounded-full bg-emerald-500/90 px-2 py-1 text-[9px] font-bold text-white">Open</span>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {tags.map((tag) => <span key={tag} className="rounded-full border border-white/15 bg-slate-950/50 px-2 py-0.5 text-[9px] text-white">{tag}</span>)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="truncate text-xs font-bold text-slate-100">{title}</h3>
                    <p className="mt-1 line-clamp-2 min-h-8 text-[10px] leading-4 text-slate-400">{description}</p>
                    <p className="mt-2 truncate text-[9px] text-slate-300"><span className="mr-1 text-emerald-400">●</span>{organization}</p>
                    <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400">
                      <span>{match}% Match</span><span>{members}</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${match}%` }} />
                    </div>
                    <button type="button" onClick={() => setSelectedProject(project)} className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-blue-600 px-2 py-1.5 text-[10px] font-semibold text-white hover:bg-blue-500">
                      View Project <ChevronRight className="size-3" aria-hidden="true" />
                    </button>
                  </div>
                </article>
                );
              })}
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(16rem,.85fr)]">
            <section className="min-w-0">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-100">My Tasks</h2>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => { setSelectedTask(null); setContributionNotice(''); openPanel('contribution'); }} className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200">Submit contribution</button>
                  <Link href="/student/tasks" className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300">View all <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-[#1c2a3d] bg-[#0d1624]">
                <ul className="divide-y divide-[#1c2a3d]">
                  {tasks.map((task) => (
                    <li key={task.title} className="grid grid-cols-[minmax(0,1fr)_4rem] items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_4.5rem_5rem]">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-600/20 text-blue-300"><CheckSquare className="size-3.5" aria-hidden="true" /></span>
                        <div className="min-w-0">
                          <button type="button" onClick={() => { setSelectedTask(task); openPanel('task'); }} className="block max-w-full truncate text-left text-[10px] font-semibold text-slate-200 hover:text-blue-300">{task.title}</button>
                          <p className="truncate text-[9px] text-slate-500">{task.project}</p>
                        </div>
                      </div>
                      <span className={`hidden rounded-full px-2 py-1 text-center text-[9px] font-semibold sm:inline-block ${task.priority === 'High' ? 'bg-rose-500/15 text-rose-300' : task.priority === 'Medium' ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}>{task.priority}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                          <div className={`h-full rounded-full ${task.color}`} style={{ width: `${taskProgress[task.title] ?? task.progress}%` }} />
                        </div>
                        <span className="w-7 text-right text-[9px] text-slate-400">{taskProgress[task.title] ?? task.progress}%</span>
                      </div>
                      <p className="col-span-2 pl-9 text-[9px] text-slate-500 sm:col-span-1 sm:pl-0">{task.due}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <SectionHeading title="Skills & Verification" href="/student/skills" />
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill) => (
                  <button type="button" key={skill.name} onClick={() => { setSelectedSkill(skill); openPanel('skill'); }} className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3 text-center hover:border-blue-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
                    <span className={`mx-auto flex size-8 items-center justify-center rounded-lg bg-[#17243a] text-[10px] font-extrabold ${skill.color}`}>{skill.icon}</span>
                    <h3 className="mt-2 min-h-7 text-[9px] font-semibold text-slate-200">{skill.name}</h3>
                    <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-semibold ${skill.name === 'Data Analysis' ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                      {skill.name === 'Data Analysis' ? <Clock3 className="size-2.5" aria-hidden="true" /> : <Check className="size-2.5" aria-hidden="true" />}
                      {verificationStarted.includes(skill.name) ? 'Verification Started (preview)' : skill.name === 'Data Analysis' ? 'In Progress' : 'Verified'}
                    </span>
                    <p className="mt-1.5 text-[9px] text-slate-400">{skill.score}/100</p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100">My Progress</h2>
              <Link href="/student/credits" className="text-[10px] font-semibold text-blue-400 hover:text-blue-300">View Details →</Link>
            </div>
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={() => openPanel('progress')} aria-label="Open overall progress details" className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"><ProgressRing /></button>
              <ul className="min-w-0 flex-1 space-y-2">
                {[
                  ['Tasks', '66%', 'bg-blue-600'],
                  ['Skills', '88%', 'bg-indigo-500'],
                  ['Contributions', '74%', 'bg-orange-500'],
                  ['Credits', '62%', 'bg-amber-400'],
                ].map(([label, value, color]) => (
                  <li key={label}>
                    <button type="button" onClick={() => openPanel('progress')} className="flex w-full items-center justify-between gap-2 text-[10px] hover:text-white">
                    <span className="flex items-center gap-2 text-slate-300"><span className={`size-2.5 rounded-full ${color}`} />{label}</span>
                    <span className="font-semibold text-slate-300">{value}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-4">
            <SectionHeading title="Upcoming Deadlines" href="/student/tasks" />
            <ul className="divide-y divide-[#1c2a3d]">
              {deadlines.map((deadline) => {
                const { title, project, date, icon: Icon, color } = deadline;
                return <li key={title} className="py-2.5 first:pt-0 last:pb-0">
                  <button type="button" onClick={() => { setSelectedDeadline(deadline); openPanel('deadline'); }} className="flex w-full items-center gap-2.5 text-left">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${color} text-white`}><Icon className="size-4" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold text-slate-200">{title}</p>
                    <p className="truncate text-[9px] text-slate-500">{project}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-semibold ${date.includes('days left') ? 'bg-rose-500/15 text-rose-300' : 'bg-slate-800 text-slate-300'}`}>{date}</span>
                  </button>
                </li>;
              })}
            </ul>
          </section>

          <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-100">Recent Activity</h2>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => openPanel('notifications')} className="text-[11px] font-semibold text-sky-300 hover:text-sky-200">Inbox</button>
                <Link href="/notifications" className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300">View all <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
              </div>
            </div>
            <ul className="divide-y divide-[#1c2a3d]">
              {activity.map((item) => {
                const { title, project, when, icon: Icon, color } = item;
                return <li key={title} className="py-2.5 first:pt-0 last:pb-0">
                  <button type="button" onClick={() => { setSelectedActivity(item); openPanel('activity'); }} className="flex w-full items-center gap-2.5 text-left">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${color} text-white`}><Icon className="size-4" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold text-slate-200">{title}</p>
                    <p className="truncate text-[9px] text-slate-500">{project}</p>
                  </div>
                  <span className="shrink-0 text-[8px] text-slate-500">{when}</span>
                  </button>
                </li>;
              })}
            </ul>
          </section>

          <section className="rounded-xl border border-violet-900/60 bg-gradient-to-br from-violet-950/60 to-slate-950 p-4">
            <div className="flex items-center gap-2 text-violet-300"><Bot className="size-4" aria-hidden="true" /><h2 className="text-xs font-bold text-slate-100">AI Research Assistant</h2></div>
            <p className="mt-2 text-[10px] leading-4 text-slate-400">Ask a project-scoped research question. Requests go through the project charter gateway.</p>
            <button type="button" onClick={() => openPanel('assistant')} className="mt-3 inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-violet-500">Open assistant <ArrowRight className="size-3" aria-hidden="true" /></button>
          </section>

          <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-4">
            <div className="flex items-center gap-2"><MessageSquare className="size-4 text-blue-300" aria-hidden="true" /><h2 className="text-xs font-bold text-slate-100">Mentor Feedback</h2></div>
            <p className="mt-2 text-[10px] leading-4 text-slate-300">“Your preprocessing notes are clear. Add a short explanation of missing-value handling.”</p>
            <p className="mt-1 text-[9px] text-slate-500">Dr. Priya Nair · AI for Climate Monitoring</p>
            <button type="button" onClick={() => { setMentorNotice(''); openPanel('mentor'); }} className="mt-3 text-[10px] font-semibold text-blue-300 hover:text-blue-200">Reply to mentor →</button>
          </section>

          <section className="rounded-xl border border-sky-900/60 bg-gradient-to-br from-sky-950/70 to-indigo-950/50 p-4">
            <div className="flex items-center gap-2 text-sky-300"><Wallet className="size-4" aria-hidden="true" /><h2 className="text-xs font-bold text-slate-100">Keep growing</h2></div>
            <p className="mt-2 text-[10px] leading-4 text-slate-400">Your next contribution could unlock new skills and credits.</p>
            <Link href="/student/recommended" className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-sky-300 hover:text-sky-200">
              Find your next project <ArrowDownRight className="size-3.5" aria-hidden="true" />
            </Link>
          </section>
        </aside>
      </div>
      {panel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="student-panel-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 id="student-panel-title" className="text-lg font-bold text-white">
                {panel === 'task' ? selectedTask?.title : panel === 'skill' ? selectedSkill?.name : panel === 'progress' ? 'Progress details' : panel === 'deadline' ? selectedDeadline?.title : panel === 'activity' ? selectedActivity?.title : panel === 'assistant' ? 'AI Research Assistant' : panel === 'notifications' ? 'Notifications' : panel === 'contribution' ? 'Submit a contribution' : 'Reply to mentor'}
              </h2>
              <button type="button" onClick={() => setPanel(null)} className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close panel"><X className="size-4" /></button>
            </div>

            {panel === 'task' && selectedTask && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">{selectedTask.project} · {selectedTask.priority} priority · due {selectedTask.due}</p>
                <label className="block text-sm text-slate-200">Progress: {taskProgress[selectedTask.title] ?? selectedTask.progress}%
                  <input type="range" min="0" max="100" step="5" value={taskProgress[selectedTask.title] ?? selectedTask.progress} onChange={(event) => setTaskProgress((current) => ({ ...current, [selectedTask.title]: Number(event.target.value) }))} className="mt-3 block w-full accent-blue-500" />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setTaskProgress((current) => ({ ...current, [selectedTask.title]: 100 }))} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600">Mark complete</button>
                  <button type="button" onClick={() => { setContributionTitle(selectedTask.title); setPanel('contribution'); setContributionNotice(''); }} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600">Submit contribution</button>
                </div>
                <p className="text-xs text-amber-300">Progress changes are local-preview-only and are not saved to a project.</p>
              </div>
            )}

            {panel === 'skill' && selectedSkill && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">Current assessment: {selectedSkill.score}/100 · {selectedSkill.name === 'Data Analysis' ? 'Verification in progress' : 'Verified in sample data'}.</p>
                <button type="button" onClick={() => setVerificationStarted((current) => current.includes(selectedSkill.name) ? current : [...current, selectedSkill.name])} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600">Start verification</button>
                <p className="text-xs text-amber-300">Verification start is a local preview only; no assessment request is created.</p>
              </div>
            )}

            {panel === 'progress' && (
              <div className="space-y-3 text-sm text-slate-300">
                <p>Overall completion is 72% in this sample dashboard.</p>
                <ul className="space-y-2">{[['Tasks', '66%', '/student/tasks'], ['Skills', '88%', '/student/skills'], ['Contributions', '74%', '/student/contributions'], ['Credits', '62%', '/student/credits']].map(([name, value, href]) => <li key={name} className="flex items-center justify-between rounded-lg bg-slate-900/70 px-3 py-2"><span>{name}</span><span className="font-semibold">{value}</span><Link href={href} onClick={() => setPanel(null)} className="text-xs text-blue-300 hover:underline">Details</Link></li>)}</ul>
                <p className="text-xs text-amber-300">Progress percentages are illustrative preview data.</p>
              </div>
            )}

            {panel === 'deadline' && selectedDeadline && (
              <div className="space-y-3 text-sm text-slate-300">
                <p>{selectedDeadline.project}</p><p>Due: {selectedDeadline.date}</p>
                <Link href="/student/tasks" onClick={() => setPanel(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-300 hover:underline">Open My Tasks <ArrowRight className="size-3" /></Link>
                <p className="text-xs text-amber-300">Deadline details shown from local preview data.</p>
              </div>
            )}

            {panel === 'activity' && selectedActivity && (
              <div className="space-y-3 text-sm text-slate-300">
                <p>{selectedActivity.project}</p><p>{selectedActivity.when}</p>
                <p className="text-xs text-amber-300">Activity details are local preview data.</p>
                {selectedActivity.title.includes('Mentor') && <button type="button" onClick={() => setPanel('mentor')} className="text-xs font-semibold text-blue-300 hover:underline">Reply to feedback</button>}
              </div>
            )}

            {panel === 'contribution' && (
              <form onSubmit={submitLocalContribution} className="space-y-3">
                <p className="text-xs leading-5 text-amber-300">Local-preview-only: the sample projects and tasks have no server project/task UUIDs. This draft is not sent to the contribution API or saved remotely.</p>
                <label className="block text-xs font-medium text-slate-300">Contribution title<input required maxLength={200} value={contributionTitle} onChange={(event) => setContributionTitle(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" /></label>
                <label className="block text-xs font-medium text-slate-300">Summary<textarea required maxLength={8000} value={contributionSummary} onChange={(event) => setContributionSummary(event.target.value)} className="mt-1 block min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" /></label>
                {contributionNotice && <p role="status" className="text-xs text-emerald-300">{contributionNotice}</p>}
                <button type="submit" className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600">Save preview draft</button>
                {localContributions.length > 0 && <ul className="space-y-2 border-t border-slate-800 pt-3">{localContributions.map((draft, index) => <li key={`${draft.title}-${index}`} className="rounded-lg bg-slate-900/70 p-3"><p className="text-xs font-semibold text-slate-200">{draft.title}</p><p className="mt-1 text-xs text-slate-400">{draft.summary}</p></li>)}</ul>}
              </form>
            )}

            {panel === 'assistant' && (
              <form onSubmit={invokeAssistant} className="space-y-3">
                <p className="text-xs leading-5 text-slate-400">The API requires an authenticated account, an accessible project UUID, and charter approval. Errors from the gateway are shown here.</p>
                <label className="block text-xs font-medium text-slate-300">Project UUID<input required value={assistantProjectId} onChange={(event) => setAssistantProjectId(event.target.value)} placeholder="Project UUID" className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" /></label>
                <label className="block text-xs font-medium text-slate-300">Research request<textarea required maxLength={24000} value={assistantPrompt} onChange={(event) => setAssistantPrompt(event.target.value)} className="mt-1 block min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" /></label>
                {assistantError && <p role="alert" className="text-xs text-rose-300">{assistantError}</p>}
                {assistantResult && <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-xs text-emerald-200">{assistantResult}</pre>}
                <button type="submit" disabled={assistantBusy} className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-600 disabled:opacity-60"><Send className="size-3.5" />{assistantBusy ? 'Checking charter…' : 'Send to AI gateway'}</button>
              </form>
            )}

            {panel === 'notifications' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Live notifications load from your authenticated account. Read status updates use the existing notification API.</p>
                {notificationsError && <p role="alert" className="text-xs text-rose-300">{notificationsError}</p>}
                {notificationsBusy ? <p className="text-sm text-slate-400">Loading notifications…</p> : notifications.length ? <ul className="divide-y divide-slate-800">{notifications.map((item) => <li key={item.id} className="flex items-start gap-3 py-3"><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-200">{item.title}</p><p className="mt-1 text-xs text-slate-400">{item.message}</p><p className="mt-1 text-[10px] text-slate-500">{new Date(item.created_at).toLocaleString()}</p></div>{item.read_at ? <span className="text-[10px] text-slate-500">Read</span> : <button type="button" disabled={busyNotificationId === item.id} onClick={() => void markNotificationRead(item.id)} className="shrink-0 rounded-md border border-slate-700 px-2 py-1 text-[10px] font-semibold text-blue-300 hover:bg-slate-800 disabled:opacity-60">{busyNotificationId === item.id ? 'Saving…' : 'Mark read'}</button>}</li>)}</ul> : !notificationsError && <p className="text-sm text-slate-400">No notifications found.</p>}
                <Link href="/notifications" onClick={() => setPanel(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-300 hover:underline">Open notifications page <ArrowRight className="size-3" /></Link>
              </div>
            )}

            {panel === 'mentor' && (
              <form onSubmit={(event) => { event.preventDefault(); setSavedMentorReplies((current) => [...current, mentorReply]); setMentorNotice('Reply saved in this local preview only.'); setMentorReply(''); }} className="space-y-3">
                <p className="text-sm text-slate-300">Dr. Priya Nair: “Your preprocessing notes are clear. Add a short explanation of missing-value handling.”</p>
                <label className="block text-xs font-medium text-slate-300">Your reply<textarea required value={mentorReply} onChange={(event) => setMentorReply(event.target.value)} className="mt-1 block min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" /></label>
                {mentorNotice && <p role="status" className="text-xs text-emerald-300">{mentorNotice}</p>}
                {savedMentorReplies.length > 0 && <ul className="space-y-2">{savedMentorReplies.map((reply, index) => <li key={`${index}-${reply}`} className="rounded-lg bg-slate-900/70 p-3 text-xs text-slate-300">{reply}</li>)}</ul>}
                <button type="submit" className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600">Save reply</button>
                <p className="text-xs text-amber-300">Replies are not sent or persisted outside this local preview.</p>
              </form>
            )}
          </section>
        </div>
      )}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedProject(null);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" aria-describedby="project-dialog-description" className="w-full max-w-md rounded-2xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-300">{selectedProject.organization}</p>
                <h2 id="project-dialog-title" className="mt-1 text-lg font-bold text-white">{selectedProject.title}</h2>
              </div>
              <button type="button" autoFocus onClick={() => setSelectedProject(null)} className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Close project details">Close</button>
            </div>
            <p id="project-dialog-description" className="mt-4 text-sm leading-6 text-slate-300">{selectedProject.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">{selectedProject.tags.map((tag) => <span key={tag} className="rounded-full bg-blue-500/15 px-2.5 py-1 text-[10px] text-blue-200">{tag}</span>)}</div>
            <p className="mt-3 text-xs text-amber-300">Project details and interest status are local-preview-only.</p>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#24334a] pt-4">
              <span className="text-xs text-slate-400">{selectedProject.match}% skill match · {selectedProject.members}</span>
              <button
                type="button"
                onClick={() => setAppliedProjects((applied) => applied.includes(selectedProject.title) ? applied : [...applied, selectedProject.title])}
                disabled={appliedProjects.includes(selectedProject.title)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:cursor-default disabled:bg-emerald-700"
              >
                {appliedProjects.includes(selectedProject.title) ? 'Interest sent' : 'I’m interested'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
