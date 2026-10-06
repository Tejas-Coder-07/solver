'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, BarChart3, BookOpen, BriefcaseBusiness, Building2, CalendarDays,
  Check, ChevronRight, CircleDollarSign, ClipboardCheck, FileCheck2, FlaskConical, FolderKanban,
  Leaf, Lightbulb, Microscope, Plus, ShieldCheck, Users, Wallet, X,
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

const projects = [
  { title: 'AI for Deforestation Monitoring', domain: 'Climate', tag: 'High Impact', status: 'In Progress', description: 'Satellite image analysis using ML to track forest loss and support conservation teams.', progress: 68, people: 6, deadline: 'Dec 2026', icon: Leaf, color: 'from-emerald-950 via-green-800 to-lime-500' },
  { title: 'Secure IoT for Rural Healthcare', domain: 'Healthcare', tag: 'Innovation', status: 'In Progress', description: 'Build secure medical-device workflows for clinics with limited connectivity.', progress: 42, people: 4, deadline: 'Mar 2027', icon: ShieldCheck, color: 'from-blue-950 via-indigo-700 to-cyan-400' },
  { title: 'Renewable Energy Optimization', domain: 'Energy', tag: 'Sustainability', status: 'Planning', description: 'Create an AI-driven smart grid optimization model using open energy data.', progress: 12, people: 3, deadline: 'Jun 2027', icon: FlaskConical, color: 'from-sky-950 via-teal-700 to-amber-300' },
];

const contributions = [
  { title: 'ML model for forest classification', project: 'AI for Deforestation Monitoring', credits: '+200 credits', when: '2 hours ago', icon: Microscope, color: 'bg-blue-600' },
  { title: 'IoT security analysis report', project: 'Secure IoT for Rural Healthcare', credits: '+150 credits', when: '1 day ago', icon: ShieldCheck, color: 'bg-emerald-600' },
  { title: 'Literature review on smart grids', project: 'Renewable Energy Optimization', credits: '+100 credits', when: '2 days ago', icon: BookOpen, color: 'bg-orange-500' },
  { title: 'Data preprocessing pipeline', project: 'AI for Deforestation Monitoring', credits: '+180 credits', when: '3 days ago', icon: ClipboardCheck, color: 'bg-indigo-600' },
];

const milestones = [
  { title: 'Project Review Meeting', project: 'AI for Deforestation…', date: 'Oct 10', remaining: '2 days', icon: BriefcaseBusiness, color: 'bg-rose-600' },
  { title: 'Progress Report Due', project: 'Secure IoT for…', date: 'Oct 15', remaining: '7 days', icon: FileCheck2, color: 'bg-cyan-600' },
  { title: 'Funding Decision', project: 'Renewable Energy…', date: 'Oct 20', remaining: '12 days', icon: CircleDollarSign, color: 'bg-orange-500' },
  { title: 'Annual Impact Report', project: 'All research projects', date: 'Oct 30', remaining: '22 days', icon: BarChart3, color: 'bg-teal-600' },
];

const initialRequests = [
  { name: 'Dr. Priya Nair', role: 'Researcher', project: 'AI for Deforestation…', when: '2 hours ago', initials: 'PN', color: 'bg-rose-500' },
  { name: 'Rahul Mehta', role: 'Researcher', project: 'Secure IoT for Rural…', when: '1 day ago', initials: 'RM', color: 'bg-blue-600' },
  { name: 'Sneha Iyer', role: 'Student', project: 'Renewable Energy…', when: '2 days ago', initials: 'SI', color: 'bg-violet-600' },
];

function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold text-slate-100">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-400 hover:text-sky-300">
        View all <ArrowRight className="size-3" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function ResearcherDashboardDemo() {
  const { currentUser } = useRole();
  const [requests, setRequests] = useState(initialRequests);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [createdProjects, setCreatedProjects] = useState<string[]>([]);
  const [organization, setOrganization] = useState('GreenEarth Foundation');
  const [projectMessage, setProjectMessage] = useState<string | null>(null);
  const researcherName = currentUser.name || 'Dr. Ananya Rao';

  const createProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = projectTitle.trim();
    if (!title) return;
    setCreatedProjects((items) => [title, ...items]);
    setProjectTitle('');
    setShowCreateForm(false);
    setProjectMessage(`“${title}” was added to this local preview.`);
  };

  const decideRequest = (name: string, approved: boolean) => {
    setRequests((items) => items.filter((item) => item.name !== name));
    setProjectMessage(`${name}'s collaboration request was ${approved ? 'approved' : 'declined'} in this preview.`);
  };

  return (
    <div className="-mx-4 -mt-6 space-y-3 px-2 pb-8 pt-0 sm:-mx-6 sm:px-2 lg:-mx-8 lg:px-2">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-3">
          <section className="relative isolate min-h-[9.5rem] overflow-hidden rounded-xl border border-sky-900/50 bg-[radial-gradient(ellipse_at_75%_52%,rgba(14,165,233,.42),transparent_34%),linear-gradient(110deg,#071a2c,#0a3152_52%,#08182c)] p-5 sm:min-h-[9.75rem] sm:p-6">
            <div className="absolute inset-y-0 right-0 -z-10 w-[58%] opacity-70" aria-hidden="true">
              <svg className="size-full" viewBox="0 0 620 210" fill="none">
                <defs><radialGradient id="earth"><stop stopColor="#6ee7b7" /><stop offset=".55" stopColor="#0ea5e9" /><stop offset="1" stopColor="#1e3a8a" /></radialGradient></defs>
                <path d="M0 167 54 126l38 22 48-61 48 55 53-40 44 43 47-68 48 64 43-50 47 50 49-29 51 43v55H0z" fill="#0b2941" />
                <path d="M55 164V92h34v72m-25-72V66h17v26m140 72V77h26v87m-19-87V55h12v22m190 87v-65h31v65m-23-65V65h15v22m117 77v-82h39v82" stroke="#67e8f9" strokeOpacity=".48" strokeWidth="3" />
                <circle cx="395" cy="84" r="52" fill="url(#earth)" />
                <path d="M361 65c11-15 21 1 31-8 8-8 15-10 26-4l17 13-9 11-16-4-12 12-19-3-18 13-10-12zm13 37 15-10 17 3 10 12-5 15-13 9-4 18-15-8-8-22z" fill="#6ee7b7" opacity=".84" />
                <path d="M343 84h104M395 32c-23 22-23 83 0 104m0-104c23 22 23 83 0 104M352 56c27 17 59 17 86 0m-86 55c27-17 59-17 86 0" stroke="white" strokeOpacity=".35" />
                <path d="m238 151 25-91 26 91m-42-40h33m96 44 28-107 28 107m-46-41h36" stroke="#cbd5e1" strokeOpacity=".55" strokeWidth="2" />
                <path d="M251 59h24m108-14h31m-139 12 10-8 10 8m99-10 10-8 10 8" stroke="#e0f2fe" strokeWidth="2" />
                <path d="M30 181h580" stroke="#bae6fd" strokeOpacity=".45" />
              </svg>
            </div>
            <div className="relative max-w-lg">
              <p className="text-xs font-medium text-sky-100">Welcome back,</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{researcherName} <span aria-hidden="true">🌿</span></h1>
              <p className="mt-1 max-w-md text-[10px] leading-4 text-sky-100/80 sm:text-xs">Support impactful research, collaborate with teams, and turn strong evidence into real-world change.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setShowCreateForm(true)} className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-blue-500">
                  <Plus className="size-3.5" aria-hidden="true" /> Create New Project
                </button>
                <Link href="#impact" className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-slate-950/30 px-3 py-2 text-[10px] font-semibold text-white hover:bg-white/10">
                  <BarChart3 className="size-3.5" aria-hidden="true" /> View Reports
                </Link>
              </div>
            </div>
            <p className="absolute bottom-5 right-4 hidden max-w-28 text-right text-[10px] italic leading-4 text-sky-100/90 lg:block">“Research today for a sustainable tomorrow.”</p>
          </section>

          <section aria-label="Research summary" className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {[
              { label: 'Active Projects', value: '8', note: '4 in progress', change: '2', icon: FolderKanban, color: 'bg-blue-600' },
              { label: 'Research Problems', value: '12', note: 'Seeking solutions', change: '5', icon: Lightbulb, color: 'bg-violet-600' },
              { label: 'Total Contributions', value: '156', note: 'Across your projects', change: '24', icon: FileCheck2, color: 'bg-emerald-600' },
              { label: 'Credits Awarded', value: '2,450', note: 'Research recognition', change: '18%', icon: Wallet, color: 'bg-orange-500' },
              { label: 'Active Researchers', value: '32', note: 'Working with us', change: '6', icon: Users, color: 'bg-blue-600' },
            ].map(({ label, value, note, change, icon: Icon, color }) => (
              <div key={label} className="rounded-lg border border-[#1c2a3d] bg-[#0d1624] p-2.5">
                <div className="flex items-center gap-2">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${color} text-white`}><Icon className="size-4" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] text-slate-400">{label}</p>
                    <p className="text-base font-extrabold leading-5 text-white">{value}</p>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400">↑ {change}</span>
                </div>
                <p className="mt-1.5 truncate text-[8px] text-slate-500">{note}</p>
              </div>
            ))}
          </section>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(15rem,.9fr)]">
            <section id="projects" className="min-w-0 scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <SectionTitle title="My Projects" href="#projects" />
              <p className="-mt-2 mb-3 text-[9px] text-slate-400">Track progress and impact across your research collaborations</p>
              {projectMessage && <p role="status" className="mb-2 rounded-md bg-emerald-500/10 px-2.5 py-2 text-[9px] text-emerald-300">{projectMessage}</p>}
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {[...createdProjects.map((title) => ({ ...projects[0], title, status: 'Planning' })), ...projects].map((project, index) => {
                  const Icon = project.icon;
                  return (
                    <article key={`${project.title}-${index}`} className="overflow-hidden rounded-lg border border-[#213148] bg-[#0a111d]">
                      <div className={`relative flex h-20 items-center justify-center overflow-hidden bg-gradient-to-br ${project.color}`}>
                        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:15px_15px]" />
                        <span className="relative flex size-10 items-center justify-center rounded-xl border border-white/20 bg-slate-950/25 text-white"><Icon className="size-6" aria-hidden="true" /></span>
                        <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                          <span className="rounded-full bg-slate-950/60 px-1.5 py-0.5 text-[7px] text-white">{project.domain}</span>
                          <span className="rounded-full bg-emerald-600/90 px-1.5 py-0.5 text-[7px] text-white">{project.tag}</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[7px] font-semibold text-blue-300">{project.status}</span>
                        <h3 className="mt-1 truncate text-[9px] font-bold text-slate-100">{project.title}</h3>
                        <p className="mt-1 line-clamp-2 min-h-7 text-[8px] leading-3 text-slate-400">{project.description}</p>
                        <p className="mt-1.5 text-[8px] text-slate-400">{project.progress}% complete</p>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500" style={{ width: `${project.progress}%` }} /></div>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[7px] text-slate-500">
                          <span className="inline-flex items-center gap-1"><Users className="size-2.5" aria-hidden="true" />{project.people} researchers</span>
                          <span className="inline-flex items-center gap-1"><CalendarDays className="size-2.5" aria-hidden="true" />{project.deadline}</span>
                        </div>
                        <button type="button" onClick={() => setSelectedProject(project)} className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-blue-600 px-2 py-1.5 text-[8px] font-semibold text-white hover:bg-blue-500">Open Project <ChevronRight className="size-3" aria-hidden="true" /></button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section id="contributions" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <SectionTitle title="Recent Contributions" href="#contributions" />
              <ul className="divide-y divide-[#1c2a3d]">
                {contributions.map(({ title, project, credits, when, icon: Icon, color }) => (
                  <li key={title} className="flex items-center gap-2 py-2.5 first:pt-0 last:pb-0">
                    <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${color} text-white`}><Icon className="size-3.5" aria-hidden="true" /></span>
                    <div className="min-w-0 flex-1"><p className="truncate text-[8px] font-semibold text-slate-200">{title}</p><p className="truncate text-[7px] text-slate-500">{project}</p></div>
                    <div className="shrink-0 text-right"><span className="rounded-full bg-emerald-500/15 px-1.5 py-1 text-[7px] font-semibold text-emerald-300">{credits}</span><p className="mt-1 text-[7px] text-slate-500">{when}</p></div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(15rem,.9fr)_minmax(13rem,.8fr)]">
            <section id="impact" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <SectionTitle title="Project Impact" href="#impact" />
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[7px] text-slate-400">
                <span className="inline-flex items-center gap-1"><i className="size-1.5 rounded-full bg-blue-500" />Contributions</span>
                <span className="inline-flex items-center gap-1"><i className="size-1.5 rounded-full bg-emerald-500" />Credits Awarded</span>
                <span className="inline-flex items-center gap-1"><i className="size-1.5 rounded-full bg-amber-400" />Active Researchers</span>
              </div>
              <svg id="ai-insights" className="mt-2 h-32 w-full scroll-mt-16" viewBox="0 0 420 150" role="img" aria-label="Project impact trends from April to October">
                {[25, 55, 85, 115].map((y) => <g key={y}><path d={`M36 ${y}H410`} stroke="#26364b" strokeDasharray="3 4" /><text x="2" y={y + 3} fill="#64748b" fontSize="8">{Math.round((130 - y) * 3.6)}</text></g>)}
                {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, index) => <text key={month} x={45 + index * 58} y="143" fill="#64748b" fontSize="8">{month}</text>)}
                <path d="M42 104 99 87 157 78 215 59 273 65 331 39 389 48 409 27" stroke="#3b82f6" strokeWidth="2.5" fill="none" />
                <path d="M42 117 99 108 157 96 215 101 273 83 331 77 389 67 409 56" stroke="#10b981" strokeWidth="2.5" fill="none" />
                <path d="M42 125 99 120 157 113 215 116 273 108 331 107 389 98 409 94" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                {[['42,104', '#3b82f6'], ['99,87', '#3b82f6'], ['157,78', '#3b82f6'], ['215,59', '#3b82f6'], ['273,65', '#3b82f6'], ['331,39', '#3b82f6'], ['389,48', '#3b82f6'], ['409,27', '#3b82f6']].map(([position, color]) => <circle key={position} cx={position.split(',')[0]} cy={position.split(',')[1]} r="2.5" fill={color} />)}
              </svg>
            </section>

            <section id="research-focus" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <SectionTitle title="Research Focus Areas" href="#research-focus" />
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-24 shrink-0 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#14b8a6 0 38%,#2563eb 38% 63%,#f97316 63% 81%,#f59e0b 81% 91%,#8b5cf6 91% 97%,#334155 97% 100%)' }} role="img" aria-label="8 active projects across six research focus areas">
                  <div className="flex size-[4.2rem] flex-col items-center justify-center rounded-full bg-[#0d1624]"><span className="text-sm font-bold text-white">8</span><span className="text-[7px] text-slate-400">Active Projects</span></div>
                </div>
                <ul className="min-w-0 space-y-1.5">
                  {[
                    ['Climate & Environment', '38%', 'bg-blue-500'],
                    ['Healthcare', '25%', 'bg-teal-500'],
                    ['Renewable Energy', '18%', 'bg-orange-500'],
                    ['Education', '10%', 'bg-amber-400'],
                    ['Cybersecurity', '6%', 'bg-violet-500'],
                    ['Other', '3%', 'bg-slate-500'],
                  ].map(([label, value, color]) => <li key={label} className="flex items-center gap-1.5 text-[7px]"><i className={`size-1.5 shrink-0 rounded-full ${color}`} /><span className="min-w-0 flex-1 truncate text-slate-300">{label}</span><span className="text-slate-400">{value}</span></li>)}
                </ul>
              </div>
            </section>

            <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <h2 className="mb-2 text-sm font-bold text-slate-100">Quick Actions</h2>
              {[
                { title: 'Create New Project', note: 'Post a new research problem', href: '#create-project', icon: Plus, color: 'bg-blue-600' },
                { title: 'Review Access Requests', note: 'Review collaboration applications', href: '#collaboration-requests', icon: Users, color: 'bg-rose-600' },
                { title: 'View Reports', note: 'See project progress and impact', href: '#impact', icon: BarChart3, color: 'bg-amber-600' },
                { title: 'Manage Organization', note: 'Update organization details', href: '#organization', icon: Building2, color: 'bg-teal-600' },
              ].map(({ title, note, href, icon: Icon, color }) => (
                <Link key={title} href={href} onClick={href === '#create-project' ? (event) => { event.preventDefault(); setShowCreateForm(true); } : undefined} className="flex items-center gap-2 border-t border-[#1c2a3d] py-2 first:border-t-0 first:pt-0">
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-md ${color} text-white`}><Icon className="size-3" aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-[8px] font-semibold text-slate-200">{title}</span><span className="block truncate text-[7px] text-slate-500">{note}</span></span>
                  <ChevronRight className="size-3 text-slate-500" aria-hidden="true" />
                </Link>
              ))}
            </section>
          </div>
        </div>

        <aside className="space-y-3">
          <section id="organization" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-[#263850] bg-[#102136] text-emerald-300"><Leaf className="size-7" aria-hidden="true" /></span>
              <div className="min-w-0"><h2 className="truncate text-[10px] font-bold text-slate-100">{organization}</h2><p className="mt-1 inline-flex items-center gap-1 text-[8px] font-semibold text-sky-300"><Check className="size-3" aria-hidden="true" />Verified Organization</p></div>
            </div>
            <button type="button" onClick={() => setOrganization((name) => name === 'GreenEarth Foundation' ? 'Open Climate Research Lab' : 'GreenEarth Foundation')} className="mt-2 w-full rounded-md bg-blue-600/20 px-3 py-2 text-[8px] font-semibold text-sky-300 hover:bg-blue-600/30">View Profile <ArrowRight className="ml-1 inline size-3" aria-hidden="true" /></button>
          </section>

          <section id="milestones" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
            <SectionTitle title="Upcoming Milestones" href="#milestones" />
            <ul className="divide-y divide-[#1c2a3d]">
              {milestones.map(({ title, project, date, remaining, icon: Icon, color }) => (
                <li key={title} className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${color} text-white`}><Icon className="size-3.5" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-[8px] font-semibold text-slate-200">{title}</p><p className="truncate text-[7px] text-slate-500">{project}</p></div>
                  <div className="shrink-0 text-right"><span className="text-[7px] text-slate-400">{date}</span><p className="mt-0.5 rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[7px] font-semibold text-rose-300">{remaining}</p></div>
                </li>
              ))}
            </ul>
          </section>

          <section id="collaboration-requests" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
            <SectionTitle title="Collaboration Requests" href="#collaboration-requests" />
            {requests.length ? <ul id="researchers" className="divide-y divide-[#1c2a3d] scroll-mt-16">
              {requests.map((request) => (
                <li key={request.name} className="py-2 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${request.color} text-[8px] font-bold text-white`}>{request.initials}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-[8px] font-semibold text-slate-200">{request.name}</p><p className="text-[7px] text-slate-500">{request.role} · {request.project}</p></div>
                    <span className="rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[7px] text-rose-300">Pending</span>
                  </div>
                  <p className="mt-1 text-right text-[7px] text-slate-500">{request.when}</p>
                  <div className="mt-1 flex gap-1.5 pl-9">
                    <button type="button" onClick={() => decideRequest(request.name, true)} className="flex-1 rounded-md bg-emerald-700 px-2 py-1 text-[7px] font-semibold text-white hover:bg-emerald-600">Approve</button>
                    <button type="button" onClick={() => decideRequest(request.name, false)} className="flex-1 rounded-md bg-slate-800 px-2 py-1 text-[7px] font-semibold text-slate-300 hover:bg-slate-700">Decline</button>
                  </div>
                </li>
              ))}
            </ul> : <p className="py-3 text-center text-[9px] text-slate-400">All collaboration requests have been reviewed.</p>}
          </section>

          <section id="credits" className="scroll-mt-16 rounded-xl border border-emerald-900/60 bg-[#0b1722] p-3">
            <div className="flex items-center gap-2 text-emerald-300"><Wallet className="size-4" aria-hidden="true" /><h2 className="text-[10px] font-bold text-slate-100">Research credits</h2></div>
            <p className="mt-1 text-xl font-extrabold text-white">2,450 <span className="text-[8px] font-medium text-slate-400">credits earned</span></p>
            <Link href="#contributions" className="mt-2 inline-flex items-center gap-1 text-[8px] font-semibold text-emerald-300">View contributions <ArrowUpRight className="size-3" aria-hidden="true" /></Link>
          </section>
        </aside>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setShowCreateForm(false); }}>
          <form id="create-project" onSubmit={createProject} role="dialog" aria-modal="true" aria-labelledby="create-project-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Research workspace</p><h2 id="create-project-title" className="mt-1 text-base font-bold text-white">Create a research project</h2></div>
              <button type="button" onClick={() => setShowCreateForm(false)} aria-label="Close create project" className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" aria-hidden="true" /></button>
            </div>
            <label className="mt-4 block text-xs font-semibold text-slate-200">Project name<input autoFocus value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} placeholder="e.g. Community Air Quality Study" maxLength={120} required className="mt-2 w-full rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500" /></label>
            <p className="mt-2 text-[9px] leading-4 text-slate-500">This adds a sample project to the local preview. It does not publish to the platform.</p>
            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowCreateForm(false)} className="rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/5">Cancel</button><button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500">Create Project</button></div>
          </form>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedProject(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="research-project-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">{selectedProject.domain} research</p><h2 id="research-project-title" className="mt-1 text-base font-bold text-white">{selectedProject.title}</h2></div><button type="button" autoFocus onClick={() => setSelectedProject(null)} aria-label="Close project details" className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" aria-hidden="true" /></button></div>
            <p className="mt-4 text-xs leading-5 text-slate-300">{selectedProject.description}</p>
            <div className="mt-4 rounded-lg bg-[#101d2e] p-3"><div className="flex justify-between text-[9px] text-slate-400"><span>Project progress</span><span>{selectedProject.progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-blue-500" style={{ width: `${selectedProject.progress}%` }} /></div><p className="mt-2 text-[9px] text-slate-400">{selectedProject.people} researchers · Target {selectedProject.deadline}</p></div>
            <Link href="#collaboration-requests" onClick={() => setSelectedProject(null)} className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold text-sky-300">Review collaboration requests <ArrowRight className="size-3" aria-hidden="true" /></Link>
          </section>
        </div>
      )}
    </div>
  );
}
