'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowRight, Award, BookOpen, Check, ClipboardCheck, FileCheck2, FolderKanban,
  Lightbulb, Microscope, ShieldCheck, Star, Users, X,
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

const projects = [
  { title: 'AI for Deforestation Monitoring', domain: 'Climate', impact: 'High Impact', progress: 72, people: 5, description: 'Satellite imagery analysis using computer vision and machine learning.', art: 'from-emerald-950 via-green-800 to-lime-500', icon: Microscope },
  { title: 'Secure IoT for Rural Healthcare', domain: 'Healthcare', impact: 'Medium', progress: 48, people: 4, description: 'Secure medical-device networks for remote clinics.', art: 'from-blue-950 via-indigo-700 to-cyan-400', icon: ShieldCheck },
  { title: 'Smart Grid Optimization', domain: 'Energy', impact: 'High Impact', progress: 65, people: 6, description: 'AI-driven load forecasting and energy distribution.', art: 'from-sky-950 via-teal-700 to-amber-300', icon: Activity },
  { title: 'Decentralized Education Records', domain: 'Education', impact: 'Medium', progress: 38, people: 3, description: 'Blockchain-based credential verification for students.', art: 'from-indigo-950 via-violet-800 to-fuchsia-500', icon: BookOpen },
];

const initialReviews = [
  { id: '00000000-0000-4000-8000-000000000001', title: 'Forest Classification Model', author: 'Rahul Sharma', project: 'AI for Deforestation Monitoring', impact: 'High Impact', when: '2 hours ago', initials: 'RS', color: 'bg-emerald-500', icon: Microscope },
  { id: '00000000-0000-4000-8000-000000000002', title: 'IoT Device Security Analysis', author: 'Sneha Iyer', project: 'Secure IoT for Rural Healthcare', impact: 'Medium', when: '5 hours ago', initials: 'SI', color: 'bg-blue-500', icon: ShieldCheck },
  { id: '00000000-0000-4000-8000-000000000003', title: 'Smart Contract Implementation', author: 'Kavya Nair', project: 'Decentralized Education Records', impact: 'Medium', when: '1 day ago', initials: 'KN', color: 'bg-violet-500', icon: FileCheck2 },
  { id: '00000000-0000-4000-8000-000000000004', title: 'Data Preprocessing Pipeline', author: 'Aditya Reddy', project: 'Smart Grid Optimization', impact: 'Low', when: '1 day ago', initials: 'AR', color: 'bg-amber-500', icon: Activity },
  { id: '00000000-0000-4000-8000-000000000005', title: 'Research Literature Review', author: 'Meera Joshi', project: 'AI for Deforestation Monitoring', impact: 'Medium', when: '2 days ago', initials: 'MJ', color: 'bg-rose-500', icon: BookOpen },
];

const candidates = [
  { name: 'Rahul Sharma', skills: 'Python · Machine Learning · Computer Vision', match: 95, initials: 'RS', color: 'from-orange-300 to-rose-500' },
  { name: 'Sneha Iyer', skills: 'Data Analysis · GIS · Remote Sensing', match: 92, initials: 'SI', color: 'from-amber-200 to-orange-500' },
  { name: 'Aditya Reddy', skills: 'IoT · Embedded Systems · Sensor Networks', match: 88, initials: 'AR', color: 'from-violet-300 to-indigo-600' },
  { name: 'Kavya Nair', skills: 'Blockchain · Web3 · Smart Contracts', match: 86, initials: 'KN', color: 'from-sky-300 to-blue-600' },
];

const schedule = [
  { time: '09:00 AM', title: 'Mentor Meeting', detail: 'AI for Deforestation Monitoring', color: 'bg-blue-500', icon: Users },
  { time: '11:00 AM', title: 'Contribution Review Session', detail: '5 submissions', color: 'bg-orange-500', icon: ClipboardCheck },
  { time: '02:00 PM', title: 'Student Guidance', detail: 'Rahul & Team (Smart Grid)', color: 'bg-violet-500', icon: Lightbulb },
  { time: '04:00 PM', title: 'Project Sync', detail: 'Healthcare IoT Team', color: 'bg-emerald-500', icon: FolderKanban },
  { time: '06:00 PM', title: 'Research Planning', detail: 'Next Semester Projects', color: 'bg-amber-500', icon: BookOpen },
];

const activity = [
  { title: 'Rahul submitted a contribution', detail: 'AI for Deforestation Monitoring', when: '2 hours ago', icon: FileCheck2, color: 'bg-violet-600' },
  { title: 'Sneha completed skill verification', detail: 'Machine Learning', when: '5 hours ago', icon: Award, color: 'bg-orange-500' },
  { title: 'Aditya requested project access', detail: 'Smart Grid Optimization', when: '1 day ago', icon: Users, color: 'bg-violet-600' },
  { title: 'Kavya received credit approval', detail: 'Blockchain for Education', when: '1 day ago', icon: Check, color: 'bg-emerald-600' },
];

const insightItems = [
  { title: 'Top Performing Student', detail: "Rahul Sharma's contributions show 40% improved quality this month.", icon: Activity, color: 'text-emerald-300', bg: 'bg-emerald-500/15' },
  { title: 'Skill Gap Alert', detail: '2 mentees need additional guidance in system design.', icon: ShieldCheck, color: 'text-rose-300', bg: 'bg-rose-500/15' },
  { title: 'Collaboration Opportunity', detail: 'Sneha and Aditya have complementary skills for a new project.', icon: Users, color: 'text-teal-300', bg: 'bg-teal-500/15' },
  { title: 'Recommendation', detail: 'Consider assigning Kavya to the blockchain research team.', icon: Lightbulb, color: 'text-amber-300', bg: 'bg-amber-500/15' },
];

const mentees = [
  { name: 'Rahul Sharma', status: 'Excellent' },
  { name: 'Priya Menon', status: 'Excellent' },
  { name: 'Arjun Rao', status: 'Excellent' },
  { name: 'Isha Kapoor', status: 'Excellent' },
  { name: 'Vikram Das', status: 'Excellent' },
  { name: 'Ananya Bose', status: 'Excellent' },
  { name: 'Sneha Iyer', status: 'Good' },
  { name: 'Aditya Reddy', status: 'Good' },
  { name: 'Kavya Nair', status: 'Good' },
  { name: 'Meera Joshi', status: 'Good' },
  { name: 'Rohan Shah', status: 'Good' },
  { name: 'Diya Patel', status: 'Good' },
  { name: 'Neel Gupta', status: 'Good' },
  { name: 'Sara Thomas', status: 'Good' },
  { name: 'Kabir Khanna', status: 'Needs Support' },
  { name: 'Tara Singh', status: 'Needs Support' },
  { name: 'Aarav Verma', status: 'Needs Support' },
  { name: 'Nisha Rao', status: 'At Risk' },
];

type MenteeStatus = (typeof mentees)[number]['status'];
type ReviewDecision = 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT';
const menteeStatuses: { status: MenteeStatus; count: number; color: string }[] = [
  { status: 'Excellent', count: 6, color: 'bg-emerald-500' },
  { status: 'Good', count: 8, color: 'bg-sky-500' },
  { status: 'Needs Support', count: 3, color: 'bg-amber-500' },
  { status: 'At Risk', count: 1, color: 'bg-rose-500' },
];

function SectionTitle({ title, href }: { title: string; href: string }) {
  return <div className="mb-2 flex items-center justify-between gap-2"><h2 className="text-xs font-bold text-slate-100">{title}</h2><Link href={href} className="inline-flex items-center gap-1 text-[8px] font-semibold text-sky-400 hover:text-sky-300">View All <ArrowRight className="size-3" aria-hidden="true" /></Link></div>;
}

export function MentorDashboardDemo() {
  const { currentUser } = useRole();
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedReview, setSelectedReview] = useState<(typeof initialReviews)[number] | null>(null);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<(typeof candidates)[number] | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<(typeof schedule)[number] | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<(typeof activity)[number] | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<(typeof insightItems)[number] | null>(null);
  const [reviewMode, setReviewMode] = useState<'review' | 'view'>('review');
  const [menteeFilter, setMenteeFilter] = useState<MenteeStatus | null>(null);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const mentorName = currentUser.name || 'Prof. Ananya Mehta';

  const finishReview = async (decision: ReviewDecision) => {
    if (!selectedReview) return;
    if (decision === 'APPROVE') {
      setReviewBusy(true);
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contributionId: selectedReview.id,
            decision,
            methodologyScore: 5,
            reproducibilityScore: 5,
            charterCompliance: true,
            comments: 'Approved in the mentor dashboard preview.',
            creditsAwarded: 0,
          }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(result?.error ?? 'The review could not be recorded by the reviews API.');
        }
        setReviews((items) => items.filter((item) => item.title !== selectedReview.title));
        setNotice(`${selectedReview.title} was approved through the reviews API.`);
        setSelectedReview(null);
      } catch (error) {
        setReviewError(error instanceof Error ? error.message : 'The review could not be recorded by the reviews API.');
      } finally {
        setReviewBusy(false);
      }
      return;
    }
    setReviews((items) => items.filter((item) => item.title !== selectedReview.title));
    const decisionLabel = decision === 'REQUEST_CHANGES' ? 'sent back for changes' : 'rejected';
    setNotice(`${selectedReview.title} was ${decisionLabel} in this local preview.`);
    setSelectedReview(null);
  };

  return (
    <div className="-mx-4 -mt-6 space-y-3 px-2 pb-8 pt-0 sm:-mx-6 sm:px-2 lg:-mx-8 lg:px-2">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <main className="min-w-0 space-y-3">
          <section id="profile" className="relative isolate flex min-h-[9.25rem] items-center overflow-hidden rounded-xl border border-blue-900/50 bg-[radial-gradient(ellipse_at_76%_50%,rgba(37,99,235,.36),transparent_35%),linear-gradient(110deg,#07182c,#102b4a_52%,#09182a)] p-5 sm:min-h-[9.5rem] sm:p-6">
            <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[52%] opacity-75" aria-hidden="true"><svg viewBox="0 0 600 200" className="size-full" fill="none"><defs><linearGradient id="mentor-art" x1="300" y1="0" x2="300" y2="200"><stop stopColor="#60a5fa" stopOpacity=".8" /><stop offset="1" stopColor="#0f172a" stopOpacity="0" /></linearGradient></defs><circle cx="400" cy="30" r="115" fill="#fbbf24" fillOpacity=".15" /><path d="M0 170 55 115l45 42 54-86 47 75 55-66 44 52 65-77 54 70 48-46 49 58 52-39 32 26v76H0z" fill="url(#mentor-art)" /><path d="M0 180h600M276 182V84h103v98m-88-98V55h72v29m-63-29 28-24 31 24m83 127v-74h91v74m-70-74V81h49v27m-40-27 21-20 20 20" stroke="#bfdbfe" strokeOpacity=".65" strokeWidth="2" /></svg></div>
            <div className="relative max-w-xl lg:max-w-[62%]">
              <p className="text-[10px] font-medium text-blue-100">Welcome back,</p>
              <h1 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">{mentorName} <span aria-label="waving hand">👋</span></h1>
              <p className="mt-1 max-w-md text-[9px] leading-4 text-blue-100/80 sm:text-[10px]">Guide talented students, review contributions, and create real research impact.</p>
              <div className="mt-3 flex flex-wrap gap-2"><Link href="#projects" className="rounded-md bg-blue-600 px-3 py-2 text-[9px] font-bold text-white hover:bg-blue-500">View My Projects</Link><Link href="#contributions" className="rounded-md border border-white/20 bg-slate-950/30 px-3 py-2 text-[9px] font-semibold text-white hover:bg-white/10">Review Contributions</Link></div>
            </div>
            <blockquote className="absolute right-5 top-1/2 hidden w-40 -translate-y-1/2 border-l border-blue-200/40 pl-3 text-right lg:block"><p className="text-[10px] italic leading-4 text-blue-100">“Great research begins with curiosity and grows through collaboration.”</p><cite className="mt-1 block text-[8px] not-italic text-blue-200/70">A mentor’s reminder</cite></blockquote>
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600/80 px-2 py-1 text-[8px] font-bold text-white"><span className="size-1.5 rounded-full bg-emerald-200" />Demo Mode</span>
          </section>

          <section aria-label="Mentor summary" className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {[
              { title: 'Assigned Projects', value: '4', detail: 'Across 3 domains', change: '1', icon: FolderKanban, color: 'bg-violet-600' },
              { title: 'Total Mentees', value: '18', detail: 'Active this semester', change: '4', icon: Users, color: 'bg-blue-600' },
              { title: 'Pending Reviews', value: '26', detail: 'Contributions to review', change: '8', icon: ClipboardCheck, color: 'bg-amber-500' },
              { title: 'Skill Match Rate', value: '92%', detail: 'For recommended candidates', change: '5%', icon: ShieldCheck, color: 'bg-emerald-600' },
              { title: 'Credits Recommended', value: '420', detail: 'This semester', change: '120', icon: Star, color: 'bg-pink-600' },
            ].map(({ title, value, detail, change, icon: Icon, color }) => <div key={title} className="rounded-lg border border-[#1c2a3d] bg-[#0d1624] p-2"><div className="flex items-center gap-2"><span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${color} text-white`}><Icon className="size-4" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="truncate text-[7px] text-slate-400">{title}</p><p className="text-base font-extrabold leading-5 text-white">{value}</p></div><span className="text-[7px] font-bold text-emerald-400">↑ {change}</span></div><p className="mt-1 truncate text-[7px] text-slate-500">{detail}</p></div>)}
          </section>

          <section id="projects" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3">
            <SectionTitle title="My Assigned Projects" href="#projects" /><p className="-mt-1 mb-2 text-[8px] text-slate-400">Projects where you are a mentor</p>
            <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-4">
              {projects.map((project) => { const Icon = project.icon; return <article key={project.title} className="overflow-hidden rounded-lg border border-[#213148] bg-[#0a111d]">
                <div className={`relative flex h-16 items-center justify-center overflow-hidden bg-gradient-to-br ${project.art}`}><div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:14px_14px]" /><Icon className="relative size-7 text-white" aria-hidden="true" /><span className="absolute bottom-1 left-1 rounded-full bg-blue-950/80 px-1.5 py-0.5 text-[6px] text-white">{project.domain}</span><span className="absolute bottom-1 right-1 rounded-full bg-emerald-700/90 px-1.5 py-0.5 text-[6px] text-white">Active</span></div>
                <div className="p-2"><div className="flex gap-1"><span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[6px] text-blue-300">{project.domain}</span><span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[6px] text-emerald-300">{project.impact}</span></div><h3 className="mt-1 truncate text-[8px] font-bold text-slate-100">{project.title}</h3><p className="mt-0.5 line-clamp-2 min-h-6 text-[7px] leading-3 text-slate-400">{project.description}</p><div className="mt-1 flex items-center gap-2"><div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-sky-500" style={{ width: `${project.progress}%` }} /></div><span className="text-[6px] text-slate-400">{project.progress}%</span></div><div className="mt-1.5 flex items-center justify-between"><span className="text-[7px] text-slate-400"><Users className="mr-1 inline size-2.5" aria-hidden="true" />{project.people} mentees</span><button type="button" onClick={() => setSelectedProject(project)} className="rounded-md bg-blue-600 px-2 py-1 text-[7px] font-semibold text-white hover:bg-blue-500">View Project</button></div></div>
              </article>; })}
            </div>
          </section>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(11rem,.8fr)]">
            <section id="contributions" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3"><SectionTitle title="Contribution Review Queue" href="#contributions" /><p className="-mt-1 mb-2 text-[7px] text-slate-400">{reviews.length} new submissions</p>{notice && <p role="status" className="mb-2 rounded-md bg-emerald-500/10 px-2 py-1.5 text-[7px] text-emerald-300">{notice}</p>}<ul className="divide-y divide-[#1c2a3d]">{reviews.slice(0, 5).map((item) => <li key={item.title} className="flex items-center gap-1.5 py-1.5 first:pt-0 last:pb-0"><span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${item.color} text-[6px] font-bold text-white`}>{item.initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-[7px] font-semibold text-slate-200">{item.title}</span><span className="block truncate text-[6px] text-slate-500">{item.author}</span></span><span className={`hidden rounded-full px-1 py-0.5 text-[6px] sm:inline ${item.impact === 'High Impact' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{item.impact}</span><button type="button" onClick={() => { setReviewMode('review'); setReviewError(null); setSelectedReview(item); }} className="rounded bg-blue-600 px-1.5 py-1 text-[6px] font-bold text-white hover:bg-blue-500">Review</button><button type="button" onClick={() => { setReviewMode('view'); setReviewError(null); setSelectedReview(item); }} aria-label={`View ${item.title}`} className="rounded bg-slate-800 px-1.5 py-1 text-[6px] font-semibold text-slate-300 hover:bg-slate-700">View</button></li>)}</ul></section>

            <section id="mentees" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3"><SectionTitle title="Mentees Overview" href="#mentees" /><p className="-mt-1 mb-2 text-[7px] text-slate-400">18 active mentees</p><div className="flex items-center gap-2"><div className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#10b981 0 33%,#0ea5e9 33% 61%,#f59e0b 61% 89%,#f43f5e 89% 100%)' }} role="img" aria-label="Mentee progress distribution"><div className="flex size-12 flex-col items-center justify-center rounded-full bg-[#0d1624]"><span className="text-sm font-bold text-white">18</span><span className="text-[6px] text-slate-400">Mentees</span></div></div><ul className="space-y-1 text-[7px] text-slate-300">{menteeStatuses.map(({ status, count, color }) => <li key={status}><button type="button" aria-pressed={menteeFilter === status} onClick={() => setMenteeFilter((current) => current === status ? null : status)} className={`rounded px-1 py-0.5 text-left hover:bg-white/5 ${menteeFilter === status ? 'bg-white/10 text-white' : ''}`}><i className={`mr-1 inline-block size-1.5 rounded-full ${color}`} />{status}<span className="ml-2 text-slate-500">{count}</span></button></li>)}</ul></div><div className="mt-2 rounded-md bg-[#101b2b] p-2"><div className="mb-1 flex items-center justify-between"><h3 className="text-[7px] font-bold text-slate-200">{menteeFilter ? `${menteeFilter} mentees` : 'All mentees'}</h3>{menteeFilter && <button type="button" onClick={() => setMenteeFilter(null)} className="text-[6px] text-sky-300">Clear filter</button>}</div><ul className="max-h-28 space-y-1 overflow-y-auto">{mentees.filter((mentee) => !menteeFilter || mentee.status === menteeFilter).map((mentee) => <li key={mentee.name} className="flex justify-between gap-2 text-[6px]"><span className="text-slate-300">{mentee.name}</span><span className="text-slate-500">{mentee.status}</span></li>)}</ul></div><div id="skills" className="mt-3 scroll-mt-16"><div className="flex items-center justify-between"><h3 className="text-[8px] font-bold text-slate-200">Skills Distribution</h3><Link href="#skills" className="text-[7px] font-semibold text-sky-400">View Details →</Link></div><div className="mt-1 flex h-14 items-end justify-around gap-1">{[['Python', 15], ['ML', 12], ['Data', 10], ['IoT', 8], ['Blockchain', 6], ['Web Dev', 4]].map(([label, value]) => <div key={label} className="flex h-full flex-1 flex-col items-center justify-end"><span className="mb-0.5 text-[6px] text-slate-400">{value}</span><div className="w-3/4 rounded-t-sm bg-gradient-to-t from-blue-700 to-cyan-400" style={{ height: `${Number(value) * 4}px` }} /><span className="mt-0.5 text-[5px] text-slate-500">{label}</span></div>)}</div></div></section>

            <section id="insights" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3"><SectionTitle title="AI Insights" href="#insights" /><span className="mb-2 inline-block rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[6px] font-bold text-violet-300">BETA</span><div className="space-y-1.5">{insightItems.map(({ title, detail, icon: Icon, color, bg }, index) => <button key={title} type="button" onClick={() => setSelectedInsight(insightItems[index])} className="flex w-full gap-1.5 rounded-md bg-[#101b2b] p-1.5 text-left hover:bg-[#172438]"><span className={`flex size-6 shrink-0 items-center justify-center rounded ${bg} ${color}`}><Icon className="size-3.5" aria-hidden="true" /></span><span><span className="block text-[7px] font-semibold text-slate-200">{title}</span><span className="mt-0.5 block text-[6px] leading-3 text-slate-400">{detail}</span></span></button>)}</div></section>
          </div>
        </main>

        <aside className="space-y-3">
          <section id="calendar" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3"><SectionTitle title="Today's Schedule" href="/mentor/calendar" /><p className="-mt-1 mb-2 text-[7px] text-slate-400">Monday, Oct 6, 2026</p><ol className="space-y-1.5">{schedule.map((item) => { const Icon = item.icon; return <li key={item.time} className="flex items-start gap-1.5"><span className="w-12 shrink-0 pt-1 text-[6px] text-slate-400">{item.time}</span><button type="button" onClick={() => setSelectedSchedule(item)} className="relative flex min-w-0 flex-1 gap-1.5 rounded-md bg-[#101b2b] p-1.5 text-left hover:bg-[#172438]"><span className={`flex size-6 shrink-0 items-center justify-center rounded ${item.color} text-white`}><Icon className="size-3" aria-hidden="true" /></span><span className="min-w-0"><span className="block truncate text-[7px] font-semibold text-slate-200">{item.title}</span><span className="block truncate text-[6px] text-slate-500">{item.detail}</span></span></button></li>; })}</ol></section>

          <section id="matching" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3"><SectionTitle title="Top Candidate Matches" href="#matching" /><ul className="divide-y divide-[#1c2a3d]">{candidates.map((candidate) => <li key={candidate.name} className="flex items-center gap-1.5 py-2 first:pt-0 last:pb-0"><span className={`flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${candidate.color} text-[7px] font-bold text-white`}>{candidate.initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-[7px] font-semibold text-slate-200">{candidate.name}</span><span className="block line-clamp-2 text-[6px] leading-3 text-slate-500">{candidate.skills}</span></span><span className="flex shrink-0 flex-col items-end gap-1"><span className="rounded-full bg-emerald-500/15 px-1 py-0.5 text-[6px] font-bold text-emerald-300">{candidate.match}% Match</span><button type="button" onClick={() => setSelectedCandidate(candidate)} className="rounded bg-blue-600 px-1.5 py-1 text-[6px] font-semibold text-white hover:bg-blue-500">View Profile</button></span></li>)}</ul></section>

          <section id="tasks" className="scroll-mt-16 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-3"><SectionTitle title="Recent Activity" href="#tasks" /><ul className="divide-y divide-[#1c2a3d]">{activity.map((item) => { const Icon = item.icon; return <li key={item.title} className="py-2 first:pt-0 last:pb-0"><button type="button" onClick={() => setSelectedActivity(item)} className="flex w-full items-center gap-1.5 text-left hover:bg-white/5"><span className={`flex size-6 shrink-0 items-center justify-center rounded ${item.color} text-white`}><Icon className="size-3" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[7px] font-semibold text-slate-200">{item.title}</span><span className="block truncate text-[6px] text-slate-500">{item.detail}</span></span><span className="shrink-0 text-[6px] text-slate-500">{item.when}</span></button></li>; })}</ul></section>

          <span id="reports" className="sr-only" /><span id="resources" className="sr-only" /><span id="messages" className="sr-only" />
        </aside>
      </div>

      {selectedSchedule && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedSchedule(null); }}><section role="dialog" aria-modal="true" aria-labelledby="mentor-schedule-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Today · {selectedSchedule.time}</p><h2 id="mentor-schedule-title" className="mt-1 text-base font-bold text-white">{selectedSchedule.title}</h2></div><button type="button" aria-label="Close schedule details" onClick={() => setSelectedSchedule(null)} className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" /></button></div><p className="mt-3 text-xs leading-5 text-slate-300">{selectedSchedule.detail}</p><p className="mt-4 text-[9px] text-slate-500">Schedule details are sample data in this local preview.</p></section></div>}

      {selectedProject && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedProject(null); }}><section role="dialog" aria-modal="true" aria-labelledby="mentor-project-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">{selectedProject.domain} project</p><h2 id="mentor-project-title" className="mt-1 text-base font-bold text-white">{selectedProject.title}</h2></div><button type="button" aria-label="Close project details" onClick={() => setSelectedProject(null)} className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" /></button></div><p className="mt-3 text-xs leading-5 text-slate-300">{selectedProject.description}</p><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><p className="text-slate-400">Progress <strong className="ml-1 text-white">{selectedProject.progress}%</strong></p><p className="text-slate-400">Mentees <strong className="ml-1 text-white">{selectedProject.people}</strong></p></div><p className="mt-4 text-[9px] text-slate-500">Project information is sample data in this local preview.</p></section></div>}

      {selectedReview && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget && !reviewBusy) setSelectedReview(null); }}><section role="dialog" aria-modal="true" aria-labelledby="mentor-review-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">{reviewMode === 'view' ? 'Contribution details · Read only' : `Contribution review · ${selectedReview.impact}`}</p><h2 id="mentor-review-title" className="mt-1 text-base font-bold text-white">{selectedReview.title}</h2></div><button type="button" aria-label="Close contribution review" onClick={() => setSelectedReview(null)} disabled={reviewBusy} className="rounded-md p-1 text-slate-400 hover:bg-white/5 disabled:opacity-50"><X className="size-4" /></button></div><p className="mt-3 text-xs text-slate-300">Submitted by {selectedReview.author} for {selectedReview.project}.</p><p className="mt-2 text-[9px] leading-4 text-slate-400">Sample submission · Request Changes and Reject are local-preview actions; Approve is recorded through the reviews API only on success.</p>{reviewError && reviewMode === 'review' && <p role="alert" className="mt-3 rounded-md bg-rose-500/10 px-2 py-1.5 text-[9px] text-rose-300">{reviewError}</p>}{reviewMode === 'review' && <div className="mt-5 flex flex-wrap justify-end gap-2"><button type="button" disabled={reviewBusy} onClick={() => void finishReview('REQUEST_CHANGES')} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">Request Changes</button><button type="button" disabled={reviewBusy} onClick={() => void finishReview('REJECT')} className="rounded-lg border border-rose-900 px-3 py-2 text-xs text-rose-300 hover:bg-rose-950/50 disabled:opacity-50">Reject</button><button type="button" disabled={reviewBusy} onClick={() => void finishReview('APPROVE')} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">{reviewBusy ? 'Submitting…' : <><Check className="mr-1 inline size-3" />Approve</>}</button></div>}</section></div>}

      {selectedInsight && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedInsight(null); }}><section role="dialog" aria-modal="true" aria-labelledby="mentor-insight-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-violet-300">AI insight · Preview</p><h2 id="mentor-insight-title" className="mt-1 text-base font-bold text-white">{selectedInsight.title}</h2></div><button type="button" aria-label="Close insight details" onClick={() => setSelectedInsight(null)} className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" /></button></div><p className="mt-3 text-xs leading-5 text-slate-300">{selectedInsight.detail}</p><p className="mt-4 text-[9px] text-slate-500">Insight details are sample data in this local preview.</p></section></div>}

      {selectedActivity && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedActivity(null); }}><section role="dialog" aria-modal="true" aria-labelledby="mentor-activity-title" className="w-full max-w-md rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-wide text-sky-300">Recent activity · {selectedActivity.when}</p><h2 id="mentor-activity-title" className="mt-1 text-base font-bold text-white">{selectedActivity.title}</h2></div><button type="button" aria-label="Close activity details" onClick={() => setSelectedActivity(null)} className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" /></button></div><p className="mt-3 text-xs leading-5 text-slate-300">{selectedActivity.detail}</p><p className="mt-4 text-[9px] text-slate-500">Activity details are sample data in this local preview.</p></section></div>}

      {selectedCandidate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelectedCandidate(null); }}><section role="dialog" aria-modal="true" aria-labelledby="candidate-profile-title" className="w-full max-w-sm rounded-xl border border-[#24334a] bg-[#0d1624] p-5 shadow-2xl"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${selectedCandidate.color} text-sm font-bold text-white`}>{selectedCandidate.initials}</span><div><h2 id="candidate-profile-title" className="text-sm font-bold text-white">{selectedCandidate.name}</h2><p className="text-[9px] text-emerald-300">{selectedCandidate.match}% project match</p></div></div><button type="button" aria-label="Close candidate profile" onClick={() => setSelectedCandidate(null)} className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="size-4" /></button></div><p className="mt-4 text-[9px] leading-4 text-slate-400">Skills: {selectedCandidate.skills}</p><p className="mt-3 text-[9px] text-slate-500">Candidate profile is sample data in this local preview.</p></section></div>}
    </div>
  );
}
