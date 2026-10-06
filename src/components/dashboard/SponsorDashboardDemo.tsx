'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight, ArrowUpRight, BarChart3, BookOpen, BriefcaseBusiness, CalendarDays, Check, ChevronRight,
  CircleDollarSign, FileCheck2, FlaskConical, FolderKanban, HeartHandshake, Leaf, Lightbulb, Plus,
  ShieldCheck, Sparkles, Users, Wallet, X,
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

const projects = [
  { name: 'AI for Deforestation Monitoring', domain: 'Climate', status: 'On Track', progress: 72, researchers: 8, lead: 'Dr. Priya Nair', role: 'Lead Researcher', icon: Leaf, color: 'from-emerald-950 via-green-800 to-lime-500' },
  { name: 'Secure IoT for Rural Healthcare', domain: 'Healthcare', status: 'In Progress', progress: 42, researchers: 12, lead: 'Dr. Arjun Mehta', role: 'Lead Researcher', icon: ShieldCheck, color: 'from-blue-950 via-indigo-700 to-cyan-400' },
  { name: 'Renewable Energy Optimization', domain: 'Energy', status: 'On Track', progress: 63, researchers: 6, lead: 'Prof. Sneha Iyer', role: 'Lead Researcher', icon: FlaskConical, color: 'from-sky-950 via-teal-700 to-amber-300' },
];

const proposals = [
  { name: 'Federated Learning for Agriculture', institution: 'IIT Bangalore', match: 'High Match', when: '2 days ago', art: 'from-emerald-900 to-lime-600', icon: Leaf },
  { name: 'Blockchain for Carbon Credits', institution: 'NIT Trichy', match: 'Medium Match', when: '3 days ago', art: 'from-blue-950 to-cyan-600', icon: CircleDollarSign },
  { name: 'AI for Water Quality Analysis', institution: 'IIIT Hyderabad', match: 'High Match', when: '4 days ago', art: 'from-cyan-950 to-teal-500', icon: FlaskConical },
  { name: 'Smart Waste Management', institution: 'RV University', match: 'Medium Match', when: '5 days ago', art: 'from-amber-950 to-orange-500', icon: Sparkles },
];

const reviews = [
  { day: '10', month: 'OCT', title: 'Project Progress Review', project: 'AI for Deforestation Monitoring', time: '10:00 AM', color: 'bg-rose-700' },
  { day: '12', month: 'OCT', title: 'New Proposal Review', project: 'Blockchain for Carbon Credits', time: '11:30 AM', color: 'bg-orange-700' },
  { day: '15', month: 'OCT', title: 'Milestone Review', project: 'Secure IoT for Rural Healthcare', time: '2:00 PM', color: 'bg-cyan-700' },
  { day: '20', month: 'OCT', title: 'Funding Decision', project: 'Smart Waste Management', time: '4:00 PM', color: 'bg-blue-700' },
];

const initialRequests = [
  { id: '10000000-0000-4000-8000-000000000001', projectId: '20000000-0000-4000-8000-000000000001', name: 'Rahul Sharma', role: 'Student', project: 'For: Renewable Energy Opt.', initials: 'RS', color: 'bg-amber-600', when: '2 hours ago', isSample: true },
  { id: '10000000-0000-4000-8000-000000000002', projectId: '20000000-0000-4000-8000-000000000002', name: 'Ananya Reddy', role: 'Researcher', project: 'For: AI for Deforestation.', initials: 'AR', color: 'bg-rose-600', when: '1 day ago', isSample: true },
  { id: '10000000-0000-4000-8000-000000000003', projectId: '20000000-0000-4000-8000-000000000003', name: 'Vikram Patel', role: 'Mentor', project: 'For: Secure IoT Healthcare', initials: 'VP', color: 'bg-indigo-600', when: '2 days ago', isSample: true },
];

const researchers = [
  { name: 'Dr. Priya Nair', area: 'Climate Research', projects: '8 projects', impact: 'High Impact', initials: 'PN' },
  { name: 'Dr. Arjun Mehta', area: 'Healthcare IoT', projects: '5 projects', impact: 'High Impact', initials: 'AM' },
  { name: 'Prof. Sneha Iyer', area: 'Renewable Energy', projects: '4 projects', impact: 'Medium Impact', initials: 'SI' },
  { name: 'Dr. Karthik Rao', area: 'AI & Sustainability', projects: '3 projects', impact: 'Medium Impact', initials: 'KR' },
];

const fundingDomains = [
  { label: 'Climate & Environment', value: '32%', color: '#14b8a6', swatch: 'bg-teal-500' },
  { label: 'Healthcare', value: '24%', color: '#2563eb', swatch: 'bg-blue-500' },
  { label: 'Renewable Energy', value: '20%', color: '#f59e0b', swatch: 'bg-amber-400' },
  { label: 'Education', value: '12%', color: '#f97316', swatch: 'bg-orange-500' },
  { label: 'Cybersecurity', value: '8%', color: '#8b5cf6', swatch: 'bg-violet-500' },
  { label: 'Other', value: '4%', color: '#64748b', swatch: 'bg-slate-500' },
];

const contributionSamples = [
  { person: 'Dr. Priya Nair', project: 'AI for Deforestation Monitoring', detail: 'Field data analysis', amount: '₹25,000', date: 'Oct 04' },
  { person: 'Ananya Reddy', project: 'Renewable Energy Optimization', detail: 'Prototype milestone', amount: '₹12,500', date: 'Oct 02' },
  { person: 'Dr. Arjun Mehta', project: 'Secure IoT for Rural Healthcare', detail: 'Clinical network report', amount: '₹18,000', date: 'Sep 28' },
];

type LoadedAccessRequest = {
  id: string;
  project_id: string;
  resource_key: string;
  status: string;
  requested_at: string;
  requester: { full_name?: string; role?: string } | null;
  projectTitle: string;
};

async function readApiResponse(response: Response, fallback: string): Promise<Record<string, unknown>> {
  const body = await response.text();
  let result: unknown;
  try {
    result = JSON.parse(body);
  } catch {
    const detail = body.trim().slice(0, 240);
    throw new Error(detail
      ? `${fallback} Server returned a non-JSON response (HTTP ${response.status}): ${detail}`
      : `${fallback} Server returned an empty or non-JSON response (HTTP ${response.status}).`);
  }
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new Error(`${fallback} Server returned an invalid response body (HTTP ${response.status}).`);
  }
  return result as Record<string, unknown>;
}

function donutSegmentPath(start: number, end: number) {
  const point = (radius: number, angle: number) => {
    const radians = (angle - 90) * Math.PI / 180;
    return [50 + radius * Math.cos(radians), 50 + radius * Math.sin(radians)];
  };
  const [outerStartX, outerStartY] = point(48, start);
  const [outerEndX, outerEndY] = point(48, end);
  const [innerEndX, innerEndY] = point(33, end);
  const [innerStartX, innerStartY] = point(33, start);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${outerStartX} ${outerStartY} A 48 48 0 ${largeArc} 1 ${outerEndX} ${outerEndY} L ${innerEndX} ${innerEndY} A 33 33 0 ${largeArc} 0 ${innerStartX} ${innerStartY} Z`;
}

function SectionTitle({ title, href, linkLabel = 'View All' }: { title: string; href: string; linkLabel?: string }) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-2">
      <h2 className="text-xs font-bold text-slate-100">{title}</h2>
      <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-[9px] font-semibold text-sky-400 hover:text-sky-300">
        {linkLabel} <ArrowRight className="size-3" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function SponsorDashboardDemo() {
  const { currentUser } = useRole();
  const [requests, setRequests] = useState(initialRequests);
  const [accessRequestLoadError, setAccessRequestLoadError] = useState<string | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [busyRequestId, setBusyRequestId] = useState<string | null>(null);
  const [showFundingForm, setShowFundingForm] = useState(false);
  const [fundingTitle, setFundingTitle] = useState('');
  const [fundingCalls, setFundingCalls] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<(typeof proposals)[number] | null>(null);
  const [selectedReview, setSelectedReview] = useState<(typeof reviews)[number] | null>(null);
  const [selectedResearcher, setSelectedResearcher] = useState<(typeof researchers)[number] | null>(null);
  const [proposalDecisions, setProposalDecisions] = useState<Record<string, 'Shortlisted' | 'Declined'>>({});
  const [selectedFundingDomain, setSelectedFundingDomain] = useState<string | null>(null);
  const [showFundingDetails, setShowFundingDetails] = useState(false);
  const [impactSeries, setImpactSeries] = useState({ Publications: true, Patents: true, 'Real-world Impact': true });
  const [organization, setOrganization] = useState(currentUser.name || 'GreenEarth Foundation');
  const [organizationMenuOpen, setOrganizationMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadAccessRequests = async () => {
      try {
        const projectResponse = await fetch('/api/projects');
        const projectResult = await readApiResponse(projectResponse, 'Unable to load projects.');
        if (!projectResponse.ok) throw new Error(typeof projectResult.error === 'string' ? projectResult.error : `Unable to load projects (HTTP ${projectResponse.status}).`);
        if (!Array.isArray(projectResult.projects)) throw new Error('Unable to load access requests: the projects response was invalid.');
        const projectRows: LoadedAccessRequest[][] = await Promise.all(projectResult.projects.map(async (project: { id: string; title: string }) => {
          const response = await fetch(`/api/projects/${project.id}/access-requests`);
          const result = await readApiResponse(response, 'Unable to load access requests.');
          if (!response.ok) throw new Error(typeof result.error === 'string' ? result.error : `Unable to load access requests (HTTP ${response.status}).`);
          if (!Array.isArray(result.requests)) throw new Error(`The access-request response for ${project.title} was invalid.`);
          return result.requests.map((request: Omit<LoadedAccessRequest, 'projectTitle'>) => ({ ...request, projectTitle: project.title }));
        }));
        if (cancelled) return;
        const roleColors: Record<string, string> = { STUDENT: 'bg-amber-600', RESEARCHER: 'bg-rose-600', MENTOR: 'bg-indigo-600' };
        const realRequests = projectRows.flat().filter((request) => request.status === 'PENDING').map((request) => {
          const name: string = request.requester?.full_name ?? 'Account';
          const role: string = request.requester?.role ?? 'Account';
          return {
            id: request.id,
            projectId: request.project_id,
            name,
            role: role.charAt(0) + role.slice(1).toLowerCase(),
            project: `For: ${request.projectTitle} · ${request.resource_key}`,
            initials: name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase(),
            color: roleColors[role] ?? 'bg-slate-600',
            when: new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(request.requested_at)),
            isSample: false,
          };
        });
        setRequests(realRequests);
        setAccessRequestLoadError(null);
      } catch (error) {
        if (cancelled) return;
        setAccessRequestLoadError(error instanceof Error ? error.message : 'Unable to load live access requests.');
      }
    };
    void loadAccessRequests();
    return () => { cancelled = true; };
  }, []);

  const createFundingCall = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = fundingTitle.trim();
    if (!title) return;
    setFundingCalls((items) => [title, ...items]);
    setFundingTitle('');
    setShowFundingForm(false);
    setMessage(`“${title}” was added to this local preview.`);
  };

  const decideRequest = async (request: (typeof initialRequests)[number], approved: boolean) => {
    setDecisionError(null);
    setMessage(null);
    setBusyRequestId(request.id);
    setRequests((items) => items.filter((item) => item.id !== request.id));
    try {
      const response = await fetch(`/api/project-access-requests/${request.id}/decision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: approved ? 'APPROVED' : 'REJECTED' }),
      });
      const result = await readApiResponse(response, 'Unable to decide access request.');
      if (!response.ok) throw new Error(typeof result.error === 'string' ? result.error : `Unable to decide access request (HTTP ${response.status}).`);
      setMessage(`${request.name}'s access request was ${approved ? 'approved' : 'rejected'}.`);
    } catch (error) {
      setRequests((items) => items.some((item) => item.id === request.id) ? items : [...items, request]);
      setDecisionError(error instanceof Error ? error.message : 'Unable to decide access request.');
    } finally {
      setBusyRequestId(null);
    }
  };

  const visibleProjects = projects.filter((project) => {
    if (!selectedFundingDomain) return true;
    return selectedFundingDomain === 'Other'
      || (selectedFundingDomain === 'Climate & Environment' && project.domain === 'Climate')
      || (selectedFundingDomain === 'Renewable Energy' && project.domain === 'Energy')
      || selectedFundingDomain === project.domain;
  });

  const switchOrganization = () => {
    const options = ['GreenEarth Foundation', 'Open Science Trust', 'Global Climate Fund'];
    const current = options.indexOf(organization);
    setOrganization(options[(current + 1) % options.length]);
    setOrganizationMenuOpen(false);
    setMessage('Organization changed in this local sample preview.');
  };

  return (
    <div className="-mx-4 -mt-6 space-y-3 px-2 pb-8 pt-0 sm:-mx-6 sm:px-2 lg:-mx-8 lg:px-2">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 space-y-3">
          <section id="organization" className="relative isolate min-h-[9.5rem] overflow-hidden rounded-xl border border-sky-900/50 bg-[radial-gradient(ellipse_at_75%_52%,rgba(14,165,233,.35),transparent_34%),linear-gradient(110deg,#07182c,#0a2a49_52%,#09182a)] p-5 sm:min-h-[9.75rem] sm:p-6">
            <div className="absolute inset-y-0 right-0 -z-10 w-[58%] opacity-80" aria-hidden="true">
              <svg className="size-full" viewBox="0 0 620 210" fill="none">
                <defs><linearGradient id="sponsor-building" x1="310" y1="40" x2="500" y2="190"><stop stopColor="#d1fae5" /><stop offset="1" stopColor="#0f766e" /></linearGradient><radialGradient id="sponsor-sun"><stop stopColor="#fde68a" stopOpacity=".8" /><stop offset="1" stopColor="#fb923c" stopOpacity="0" /></radialGradient></defs>
                <circle cx="440" cy="80" r="125" fill="url(#sponsor-sun)" />
                <path d="m0 152 54-32 48 28 56-64 53 56 47-42 53 44 48-56 50 54 47-38 55 45 42-24 31 25v54H0z" fill="#102d3c" />
                <path d="M292 170V104l49-37 50 37v66m-85-65h70v65m-47-61v61m25-61v61m52 0v-48l42-26 43 26v48m-68-48h52m-26 0v48m-115-66c12-15 25-26 43-35m65 67h104" stroke="url(#sponsor-building)" strokeWidth="3" />
                <path d="M0 181h620m-20 0c-25-11-32 4-53 0-18-4-22 11-43 4-22-7-31 8-49 3-22-7-34 7-54 2" stroke="#67e8f9" strokeOpacity=".55" strokeWidth="3" />
                <path d="m105 164 18-67 20 67m-32-26h25m93 26 21-83 23 83m-36-33h27m253 33 15-55 18 55" stroke="#e2e8f0" strokeOpacity=".55" strokeWidth="2" />
                <path d="M124 97h-5m26 0h-5m96-82h-4m32 0h-5" stroke="#f8fafc" strokeWidth="2" />
                <path d="M8 183h596" stroke="#a5f3fc" strokeOpacity=".4" />
                {Array.from({ length: 15 }, (_, index) => <circle key={index} cx={30 + index * 39} cy={186 + (index % 3) * 4} r="1.5" fill="#a5f3fc" opacity=".65" />)}
              </svg>
            </div>
            <div className="relative max-w-lg">
              <p className="text-xs font-medium text-sky-100">Welcome back,</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{organization} <span className="text-emerald-400" aria-label="verified">✓</span></h1>
              <p className="mt-1 max-w-md text-[10px] leading-4 text-sky-100/80 sm:text-xs">Fund innovative research, support talented researchers, and create real-world impact.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setShowFundingForm(true)} className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-blue-500"><Plus className="size-3.5" aria-hidden="true" />Create New Funding Call</button>
                <Link href="/sponsor/projects" className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-slate-950/30 px-3 py-2 text-[10px] font-semibold text-white hover:bg-white/10"><FolderKanban className="size-3.5" aria-hidden="true" />View All Projects</Link>
                <div className="relative">
                  <button type="button" onClick={() => setOrganizationMenuOpen((open) => !open)} className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-slate-950/30 px-3 py-2 text-[10px] font-semibold text-white hover:bg-white/10">Switch Organization <ChevronRight className="size-3 -rotate-90" aria-hidden="true" /></button>
                  {organizationMenuOpen && <div className="absolute left-0 top-full z-20 mt-1 w-52 rounded-md border border-[#293950] bg-[#0a111d] p-2 shadow-xl"><p className="px-2 pb-1 text-[8px] text-slate-500">Local demo control · sample organizations</p><button type="button" onClick={switchOrganization} className="w-full rounded px-2 py-1.5 text-left text-[9px] text-slate-200 hover:bg-white/5">Switch to next sample organization</button></div>}
                </div>
              </div>
            </div>
            <span className="absolute bottom-2 left-5 rounded bg-slate-950/60 px-1.5 py-0.5 text-[7px] font-semibold text-amber-200">LOCAL SAMPLE DATA · preview only</span>
            <p className="absolute bottom-4 right-3 hidden max-w-24 text-right text-[9px] italic leading-4 text-sky-100/90 lg:block">“Research today for a sustainable tomorrow.”</p>
          </section>

          <section aria-label="Sponsor summary" className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {[
              { title: 'Active Projects', value: '8', detail: 'Across 4 domains', change: '2', icon: FolderKanban, color: 'bg-violet-600', href: '/sponsor/projects' },
              { title: 'Research Proposals', value: '24', detail: '3 under review', change: '6', icon: Lightbulb, color: 'bg-blue-600', href: '#proposals' },
              { title: 'Total Contributors', value: '156', detail: 'Researchers & Students', change: '18', icon: Users, color: 'bg-orange-500', href: '#contributions' },
              { title: 'Total Funding', value: '₹48.5L', detail: 'This Year', change: '12%', icon: Wallet, color: 'bg-emerald-600', href: '#funding' },
              { title: 'Pending Access Requests', value: String(requests.length), detail: 'Needs your approval', change: '', icon: HeartHandshake, color: 'bg-rose-600', href: '#access-requests' },
            ].map(({ title, value, detail, change, icon: Icon, color, href }) => (
              <Link href={href} key={title} className="rounded-lg border border-[#1c2a3d] bg-[#0d1624] p-2.5 transition hover:border-sky-700 hover:bg-[#111d2d]">
                <div className="flex items-center gap-2">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${color} text-white`}><Icon className="size-4" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><p className="text-[8px] text-slate-400">{title}</p><p className="text-base font-extrabold leading-5 text-white">{value}</p></div>
                  {change && <span className="text-[8px] font-bold text-emerald-400">↑ {change}</span>}
                </div>
                <p className="mt-1.5 truncate text-[8px] text-slate-500">{detail}</p>
              </Link>
            ))}
          </section>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(15rem,.9fr)]">
            <section id="projects" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <SectionTitle title="Funded Projects" href="/sponsor/projects" linkLabel="View All Funded Projects" />
              <p className="-mt-1.5 mb-2.5 text-[8px] text-slate-400">Your currently funded research projects</p>
              {message && <p role="status" className="mb-2 rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-[8px] text-emerald-300">{message}</p>}
              {selectedFundingDomain && <div className="mb-2 flex items-center justify-between rounded-md bg-sky-500/10 px-2 py-1.5 text-[8px] text-sky-200">Filtered by {selectedFundingDomain}<button type="button" onClick={() => setSelectedFundingDomain(null)} className="font-semibold underline">Clear filter</button></div>}
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {fundingCalls.map((name) => ({ ...projects[0], name, status: 'Planning', progress: 0 })).concat(visibleProjects).map((project, index) => {
                  const Icon = project.icon;
                  return (
                    <article key={`${project.name}-${index}`} className="overflow-hidden rounded-lg border border-[#213148] bg-[#0a111d]">
                      <div className={`relative flex h-[4.3rem] items-center justify-center overflow-hidden bg-gradient-to-br ${project.color}`}>
                        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:14px_14px]" />
                        <span className="relative flex size-9 items-center justify-center rounded-xl border border-white/20 bg-slate-950/25 text-white"><Icon className="size-5" aria-hidden="true" /></span>
                        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-slate-950/60 px-1.5 py-0.5 text-[7px] text-white">{project.domain}</span>
                        <span className={`absolute bottom-1.5 right-1.5 rounded-full px-1.5 py-0.5 text-[7px] text-white ${project.status === 'On Track' ? 'bg-emerald-600' : 'bg-amber-600'}`}>{project.status}</span>
                      </div>
                      <div className="p-2">
                        <h3 className="truncate text-[8px] font-bold text-slate-100">{project.name}</h3>
                        <span className="mt-0.5 inline-block rounded bg-amber-500/10 px-1 py-0.5 text-[6px] font-semibold text-amber-200">SAMPLE PROJECT</span>
                        <p className="mt-1 line-clamp-2 min-h-6 text-[7px] leading-3 text-slate-400">{project.name === 'AI for Deforestation Monitoring' ? 'Satellite imagery analysis for real-time forest conservation.' : project.name === 'Secure IoT for Rural Healthcare' ? 'Secure medical networks for remote areas.' : 'AI-driven smart grid and energy distribution.'}</p>
                        <div className="mt-1 flex justify-between text-[7px] text-slate-400"><span>{project.progress}% complete</span><span>{project.progress}% funded</span></div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-blue-500" style={{ width: `${project.progress}%` }} /></div>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[7px] font-bold text-white">{project.lead.split(' ').slice(-2).map((word) => word[0]).join('')}</span>
                          <span className="min-w-0 flex-1"><span className="block truncate text-[7px] font-semibold text-slate-200">{project.lead}</span><span className="block text-[6px] text-slate-500">{project.role}</span></span>
                          <span className="text-right text-[7px] text-slate-400"><Users className="mr-1 inline size-2.5" aria-hidden="true" />{project.researchers}<span className="block text-[6px]">Contributors</span></span>
                        </div>
                        <button type="button" onClick={() => setSelectedProject(project)} className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-blue-600 px-2 py-1.5 text-[7px] font-semibold text-white hover:bg-blue-500">Project Details <ChevronRight className="size-2.5" aria-hidden="true" /></button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section id="proposals" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <SectionTitle title="Recent Proposals" href="/sponsor/dashboard#proposals" />
              <p className="-mt-1.5 mb-2 text-[8px] text-slate-400">Latest research proposals submitted · sample data</p>
              <ul className="divide-y divide-[#1c2a3d]">
                {proposals.map((proposal) => {
                  const { name, institution, match, when, art, icon: Icon } = proposal;
                  return <li key={name} className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${art} text-white`}><Icon className="size-4" aria-hidden="true" /></span>
                    <button type="button" onClick={() => setSelectedProposal(proposal)} className="min-w-0 flex-1 text-left"><p className="truncate text-[8px] font-semibold text-slate-200">{name}</p><p className="truncate text-[7px] text-slate-500">{institution} · sample proposal</p></button>
                    <button type="button" onClick={() => setSelectedProposal(proposal)} className="shrink-0 text-right"><span className={`rounded-full px-1.5 py-1 text-[6px] font-semibold ${proposalDecisions[name] ? 'bg-violet-500/15 text-violet-300' : match === 'High Match' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{proposalDecisions[name] ?? match}</span><p className="mt-1 text-[7px] text-slate-500">{when}</p></button>
                  </li>;
                })}
              </ul>
            </section>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(15rem,.8fr)]">
            <section id="funding" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <SectionTitle title="Funding Allocation" href="/sponsor/funding" />
              <p className="-mt-1.5 mb-3 text-[8px] text-slate-400">Budget distribution across research domains · sample data</p>
              <div className="flex items-center justify-center gap-3">
                <svg className="size-24 shrink-0 overflow-visible" viewBox="0 0 100 100" role="group" aria-label="Funding allocation sample segments">
                  {fundingDomains.map((domain, index) => {
                    const start = fundingDomains.slice(0, index).reduce((total, item) => total + Number.parseInt(item.value, 10) * 3.6, 0);
                    const end = start + Number.parseInt(domain.value, 10) * 3.6;
                    return <path key={domain.label} d={donutSegmentPath(start, end)} fill={domain.color} stroke={selectedFundingDomain === domain.label ? '#fff' : '#0d1624'} strokeWidth={selectedFundingDomain === domain.label ? 2 : 1} opacity={selectedFundingDomain && selectedFundingDomain !== domain.label ? .35 : 1} tabIndex={0} role="button" aria-label={`Filter projects by ${domain.label}, ${domain.value}`} onClick={() => setSelectedFundingDomain(selectedFundingDomain === domain.label ? null : domain.label)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedFundingDomain(selectedFundingDomain === domain.label ? null : domain.label); } }} className="cursor-pointer outline-none focus:stroke-white" />;
                  })}
                  <circle cx="50" cy="50" r="30" fill="#0d1624" />
                  <text x="50" y="48" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">₹48.5L</text>
                  <text x="50" y="59" textAnchor="middle" fill="#94a3b8" fontSize="5">Total Funding</text>
                </svg>
                <ul className="min-w-0 space-y-1.5">{fundingDomains.map(({ label, value, swatch }) => <li key={label}><button type="button" aria-pressed={selectedFundingDomain === label} onClick={() => setSelectedFundingDomain(selectedFundingDomain === label ? null : label)} className="flex w-full items-center gap-1.5 text-left text-[7px] hover:text-white"><i className={`size-1.5 shrink-0 rounded-full ${swatch}`} /><span className="min-w-0 flex-1 truncate text-slate-300">{label}</span><span className="text-slate-400">{value}</span></button></li>)}</ul>
              </div>
              <button type="button" onClick={() => setShowFundingDetails(true)} className="mt-2 rounded bg-white/5 px-2 py-1 text-[7px] text-sky-300 hover:bg-white/10">View details</button>
            </section>

            <section id="impact" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <SectionTitle title="Research Impact" href="/sponsor/analytics" />
              <p className="-mt-1.5 mb-2 text-[8px] text-slate-400">Real-world impact from your funded projects · sample data</p>
              <div className="flex flex-wrap justify-center gap-3 text-[7px] text-slate-400">{(['Publications', 'Patents', 'Real-world Impact'] as const).map((series) => <button type="button" key={series} aria-pressed={impactSeries[series]} onClick={() => setImpactSeries((current) => ({ ...current, [series]: !current[series] }))} className={`inline-flex items-center gap-1 ${impactSeries[series] ? '' : 'opacity-40 line-through'}`}><i className={`inline-block size-1.5 rounded-full ${series === 'Publications' ? 'bg-blue-500' : series === 'Patents' ? 'bg-violet-500' : 'bg-emerald-500'}`} />{series}</button>)}</div>
              <svg id="insights" className="mt-2 h-28 w-full scroll-mt-16" viewBox="0 0 340 130" role="img" aria-label="Monthly publications, patents and real-world impact sample">
                {[20, 45, 70, 95].map((y) => <g key={y}><path d={`M26 ${y}H330`} stroke="#26364b" strokeDasharray="3 4" /><text x="1" y={y + 3} fill="#64748b" fontSize="7">{100 - y}</text></g>)}
                {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, index) => { const x = 38 + index * 42; const values = [24, 37, 32, 48, 59, 65, 80]; return <g key={month}>{impactSeries.Publications && <rect x={x} y={105 - values[index]} width="6" height={values[index]} rx="1" fill="#3b82f6" />}{impactSeries.Patents && <rect x={x + 8} y={105 - values[index] * .6} width="6" height={values[index] * .6} rx="1" fill="#8b5cf6" />}{impactSeries['Real-world Impact'] && <rect x={x + 16} y={105 - values[index] * .72} width="6" height={values[index] * .72} rx="1" fill="#10b981" />}<text x={x - 1} y="120" fill="#64748b" fontSize="7">{month}</text></g>; })}
              </svg>
              <Link href="/sponsor/analytics" className="mt-1 inline-flex items-center gap-1 text-[8px] font-semibold text-sky-300 hover:text-sky-200">View report <ArrowUpRight className="size-3" aria-hidden="true" /></Link>
            </section>

            <section id="researchers" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
              <SectionTitle title="Top Researchers" href="/sponsor/find-researchers" />
              <p className="-mt-1.5 mb-1 text-[7px] text-amber-200">Sample researcher records</p>
              <ul className="divide-y divide-[#1c2a3d]">{researchers.map((person) => <li key={person.name}><button type="button" onClick={() => setSelectedResearcher(person)} className="flex w-full items-center gap-2 py-2 text-left first:pt-0 last:pb-0"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-700 text-[7px] font-bold text-white">{person.initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-[8px] font-semibold text-slate-200">{person.name}</span><span className="block truncate text-[7px] text-slate-500">{person.area}</span></span><span className="text-right"><span className="block text-[7px] text-slate-400">{person.projects}</span><span className={`mt-0.5 block rounded-full px-1 py-0.5 text-[6px] ${person.impact === 'High Impact' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{person.impact}</span></span></button></li>)}</ul>
            </section>
          </div>
        </div>

        <aside className="space-y-3">
          <section id="reviews" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
            <SectionTitle title="Upcoming Reviews" href="/sponsor/reviews" />
            <p className="-mt-1.5 mb-1 text-[7px] text-amber-200">Sample schedule</p>
            <ul className="divide-y divide-[#1c2a3d]">{reviews.map((review) => <li key={review.title}><button type="button" onClick={() => setSelectedReview(review)} className="flex w-full items-center gap-2 py-2 text-left first:pt-0 last:pb-0"><span className={`flex size-8 shrink-0 flex-col items-center justify-center rounded-md ${review.color} text-white`}><span className="text-[6px]">{review.month}</span><span className="text-[11px] font-bold leading-3">{review.day}</span></span><span className="min-w-0 flex-1"><span className="block truncate text-[8px] font-semibold text-slate-200">{review.title}</span><span className="block truncate text-[7px] text-slate-500">{review.project}</span></span><span className="shrink-0 text-[7px] text-slate-400">{review.time}</span></button></li>)}</ul>
            <Link href="/sponsor/reviews" className="mt-2 inline-flex items-center gap-1 text-[8px] font-semibold text-sky-300 hover:text-sky-200">View Calendar <CalendarDays className="size-3" aria-hidden="true" /></Link>
          </section>

          <section id="access-requests" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
            <SectionTitle title="Pending Access Requests" href="#access-requests" />
            <p className="-mt-1.5 mb-2 text-[7px] text-slate-500">Live requests when signed in; otherwise clearly marked sample rows.</p>
            {accessRequestLoadError && <p role="status" className="mb-2 rounded-md border border-amber-800/60 bg-amber-500/10 px-2.5 py-1.5 text-[8px] leading-4 text-amber-200">Live access requests couldn’t load: {accessRequestLoadError} Showing clearly labeled sample fallback rows.</p>}
            {decisionError && <p role="alert" className="mb-2 rounded-md bg-rose-500/10 px-2.5 py-1.5 text-[8px] text-rose-300">{decisionError}</p>}
            {requests.length ? <ul className="divide-y divide-[#1c2a3d]">{requests.map((request) => <li key={request.id} className="py-2.5 first:pt-0 last:pb-0"><div className="flex items-center gap-2"><span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${request.color} text-[7px] font-bold text-white`}>{request.initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-[8px] font-semibold text-slate-200">{request.name}</span><span className="block truncate text-[7px] text-slate-500">{request.role}</span></span><span className={`rounded-full px-1.5 py-0.5 text-[6px] font-semibold ${request.role === 'Student' ? 'bg-blue-500/15 text-blue-300' : request.role === 'Mentor' ? 'bg-violet-500/15 text-violet-300' : 'bg-rose-500/15 text-rose-300'}`}>{request.role}</span></div><p className="mt-1 pl-9 text-[7px] text-slate-500">{request.project} · {request.when} {request.isSample && <span className="text-amber-200">· SAMPLE</span>}</p><div className="mt-1.5 flex gap-1.5 pl-9"><button type="button" disabled={busyRequestId !== null} onClick={() => void decideRequest(request, true)} className="flex-1 rounded-md bg-emerald-700 px-2 py-1.5 text-[7px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">Approve</button><button type="button" disabled={busyRequestId !== null} onClick={() => void decideRequest(request, false)} className="flex-1 rounded-md bg-slate-800 px-2 py-1.5 text-[7px] font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-50">Reject</button></div></li>)}</ul> : <p className="py-4 text-center text-[8px] text-slate-400">All requests have been reviewed.</p>}
          </section>

          <section id="payments" className="scroll-mt-16 rounded-xl border border-emerald-900/60 bg-[#0b1722] p-3">
            <div className="flex items-center gap-2 text-emerald-300"><Wallet className="size-4" aria-hidden="true" /><h2 className="text-[9px] font-bold text-slate-100">Funding this year</h2></div>
            <p className="mt-1 text-xl font-extrabold text-white">₹48.5L <span className="text-[7px] font-medium text-emerald-300">↑ 12%</span></p>
            <Link href="#funding" className="mt-1 inline-flex items-center gap-1 text-[8px] font-semibold text-emerald-300">View allocation <ArrowUpRight className="size-3" aria-hidden="true" /></Link>
            <p className="mt-1 text-[7px] text-slate-500">Sample funding summary</p>
          </section>

          <section id="credits" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
            <SectionTitle title="Credits Awarded" href="#credits" />
            <p className="text-lg font-extrabold text-white">₹2.4L</p>
            <p className="text-[7px] text-slate-400">Across 18 sample milestone awards</p>
            <Link href="/sponsor/funding" className="mt-2 inline-flex items-center gap-1 text-[8px] font-semibold text-sky-300">View credit details <ArrowUpRight className="size-3" aria-hidden="true" /></Link>
          </section>

          <section id="contributions" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
            <SectionTitle title="Recent Contributions" href="#contributions" />
            <ul className="divide-y divide-[#1c2a3d]">{contributionSamples.map((item) => <li key={`${item.person}-${item.date}`} className="py-2 first:pt-0 last:pb-0"><div className="flex items-start justify-between gap-2"><span className="min-w-0"><span className="block truncate text-[8px] font-semibold text-slate-200">{item.person}</span><span className="block truncate text-[7px] text-slate-500">{item.project}</span></span><span className="shrink-0 text-right text-[8px] font-semibold text-emerald-300">{item.amount}<span className="block text-[6px] font-normal text-slate-500">{item.date}</span></span></div><p className="mt-1 text-[7px] text-slate-400">{item.detail} · sample entry</p></li>)}</ul>
          </section>

          <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
            <h2 className="text-[9px] font-bold text-slate-100">Quick Actions</h2>
            <p className="mt-1 text-[7px] text-slate-500">Local preview actions</p>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <button type="button" onClick={() => setShowFundingForm(true)} className="rounded-md bg-blue-600 px-2 py-2 text-[7px] font-semibold text-white hover:bg-blue-500">Create Funding Call</button>
              <Link href="/sponsor/projects" className="rounded-md bg-slate-800 px-2 py-2 text-center text-[7px] font-semibold text-slate-200 hover:bg-slate-700">All Projects</Link>
              <Link href="/sponsor/reviews" className="rounded-md bg-slate-800 px-2 py-2 text-center text-[7px] font-semibold text-slate-200 hover:bg-slate-700">Calendar</Link>
              <Link href="/sponsor/analytics" className="rounded-md bg-slate-800 px-2 py-2 text-center text-[7px] font-semibold text-slate-200 hover:bg-slate-700">Impact Report</Link>
            </div>
          </section>
        </aside>
      </div>

      {selectedProject && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedProject(null); }}><section role="dialog" aria-modal="true" aria-labelledby="project-details-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Funded project</p><h2 id="project-details-title" className="mt-1 text-base font-bold text-white">{selectedProject.name}</h2></div><button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project details" className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" aria-hidden="true" /></button></div><p className="mt-3 text-xs leading-5 text-slate-300">{selectedProject.name === 'AI for Deforestation Monitoring' ? 'Satellite imagery analysis for real-time forest conservation.' : selectedProject.name === 'Secure IoT for Rural Healthcare' ? 'Secure medical networks for remote areas.' : 'AI-driven smart grid and energy distribution.'}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-slate-500">Lead researcher</dt><dd className="mt-1 font-semibold text-slate-200">{selectedProject.lead}</dd></div><div><dt className="text-slate-500">Contributors</dt><dd className="mt-1 font-semibold text-slate-200">{selectedProject.researchers}</dd></div><div><dt className="text-slate-500">Progress</dt><dd className="mt-1 font-semibold text-slate-200">{selectedProject.progress}%</dd></div><div><dt className="text-slate-500">Status</dt><dd className="mt-1 font-semibold text-slate-200">{selectedProject.status}</dd></div></dl><p className="mt-4 text-[9px] leading-4 text-slate-500">Project details are sample data in this local preview.</p></section></div>}
      {selectedProposal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedProposal(null); }}><section role="dialog" aria-modal="true" aria-labelledby="proposal-details-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Sample proposal · local review</p><h2 id="proposal-details-title" className="mt-1 text-base font-bold text-white">{selectedProposal.name}</h2></div><button type="button" onClick={() => setSelectedProposal(null)} aria-label="Close proposal details" className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" aria-hidden="true" /></button></div><p className="mt-3 text-xs text-slate-300">Submitted by {selectedProposal.institution}. Match score: {selectedProposal.match}. Submitted {selectedProposal.when}.</p><p className="mt-3 rounded-md bg-amber-500/10 p-2 text-[9px] leading-4 text-amber-100">Shortlisting or declining here only updates this local preview; it does not change a real application.</p><div className="mt-4 flex gap-2"><button type="button" onClick={() => setProposalDecisions((items) => ({ ...items, [selectedProposal.name]: 'Shortlisted' }))} className="flex-1 rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600">Shortlist</button><button type="button" onClick={() => setProposalDecisions((items) => ({ ...items, [selectedProposal.name]: 'Declined' }))} className="flex-1 rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700">Decline</button></div></section></div>}
      {selectedReview && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedReview(null); }}><section role="dialog" aria-modal="true" aria-labelledby="review-details-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Sample schedule item</p><h2 id="review-details-title" className="mt-1 text-base font-bold text-white">{selectedReview.title}</h2></div><button type="button" onClick={() => setSelectedReview(null)} aria-label="Close schedule details" className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" aria-hidden="true" /></button></div><p className="mt-3 text-xs text-slate-300">{selectedReview.project}</p><p className="mt-1 text-xs text-slate-400">{selectedReview.month} {selectedReview.day} · {selectedReview.time}</p><Link href="/sponsor/reviews" onClick={() => setSelectedReview(null)} className="mt-4 inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">View Calendar <CalendarDays className="size-3" aria-hidden="true" /></Link></section></div>}
      {selectedResearcher && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedResearcher(null); }}><section role="dialog" aria-modal="true" aria-labelledby="researcher-details-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Sample researcher profile</p><h2 id="researcher-details-title" className="mt-1 text-base font-bold text-white">{selectedResearcher.name}</h2></div><button type="button" onClick={() => setSelectedResearcher(null)} aria-label="Close researcher details" className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" aria-hidden="true" /></button></div><p className="mt-3 text-xs text-slate-300">{selectedResearcher.area} · {selectedResearcher.projects} · {selectedResearcher.impact}.</p><Link href="/sponsor/find-researchers" onClick={() => setSelectedResearcher(null)} className="mt-4 inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">View All Researchers <ArrowRight className="size-3" aria-hidden="true" /></Link></section></div>}
      {showFundingDetails && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setShowFundingDetails(false); }}><section role="dialog" aria-modal="true" aria-labelledby="funding-details-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Sample allocation</p><h2 id="funding-details-title" className="mt-1 text-base font-bold text-white">Funding by research domain</h2></div><button type="button" onClick={() => setShowFundingDetails(false)} aria-label="Close funding details" className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" aria-hidden="true" /></button></div><p className="mt-3 text-xs text-slate-300">Sample annual allocation totals ₹48.5L. Select a domain to filter funded projects on the dashboard.</p><ul className="mt-3 divide-y divide-[#1c2a3d]">{fundingDomains.map((domain) => <li key={domain.label}><button type="button" onClick={() => { setSelectedFundingDomain(domain.label); setShowFundingDetails(false); }} className="flex w-full justify-between py-2 text-xs text-slate-200 hover:text-sky-300"><span>{domain.label}</span><span>{domain.value}</span></button></li>)}</ul></section></div>}
      {showFundingForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setShowFundingForm(false); }}><form onSubmit={createFundingCall} role="dialog" aria-modal="true" aria-labelledby="funding-call-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Sponsor workspace</p><h2 id="funding-call-title" className="mt-1 text-base font-bold text-white">Create a funding call</h2></div><button type="button" onClick={() => setShowFundingForm(false)} aria-label="Close funding call" className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" aria-hidden="true" /></button></div><label className="mt-4 block text-xs font-semibold text-slate-200">Funding call title<input autoFocus value={fundingTitle} onChange={(event) => setFundingTitle(event.target.value)} placeholder="e.g. Community Water Research Grant" maxLength={120} required className="mt-2 w-full rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500" /></label><p className="mt-2 text-[9px] leading-4 text-slate-500">This adds a sample opportunity to the local preview; it is not published.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowFundingForm(false)} className="rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/5">Cancel</button><button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500">Create Funding Call</button></div></form></div>}
    </div>
  );
}
