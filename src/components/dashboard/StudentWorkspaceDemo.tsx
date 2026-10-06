'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  ArrowRight, Bell, Check, CircleDollarSign, FileCheck2, MessageSquare, Send, Sparkles,
} from 'lucide-react';

const projectSamples = [
  { name: 'AI for Climate Monitoring', organization: 'GreenEarth Foundation', detail: 'Analyze satellite imagery to identify deforestation and measure climate impact.', tags: 'AI/ML · Environment', match: 95 },
  { name: 'Secure IoT for Healthcare', organization: 'HealthTech Labs', detail: 'Research practical ways to secure connected medical devices in hospital networks.', tags: 'Healthcare · IoT', match: 92 },
  { name: 'Decentralized Education Records', organization: 'EduChain Initiative', detail: 'Build a trusted, student-owned system for verifying education credentials.', tags: 'Blockchain · Education', match: 85 },
];

const taskSamples = [
  { name: 'Data preprocessing pipeline', project: 'AI Climate Monitoring', due: 'Oct 10', priority: 'High' },
  { name: 'Literature review on IoT security', project: 'Secure IoT for Healthcare', due: 'Oct 12', priority: 'Medium' },
  { name: 'Implement authentication module', project: 'EduChain Platform', due: 'Oct 15', priority: 'High' },
  { name: 'Write experiment report', project: 'AI Climate Monitoring', due: 'Oct 18', priority: 'Low' },
];

const notificationSamples = [
  'Your data augmentation pipeline was submitted.',
  'Your task was approved by Dr. Priya Nair.',
  'You earned 50 credits for a research contribution.',
  'Dr. Priya Nair left feedback on your latest work.',
];

const sectionBySlug: Record<string, { title: string; description: string }> = {
  projects: { title: 'My Projects', description: 'Your active research collaborations and project teams.' },
  recommended: { title: 'Recommended Projects', description: 'Opportunities matched to your skills and interests.' },
  tasks: { title: 'My Tasks', description: 'Keep track of your assignments, due dates, and progress.' },
  contributions: { title: 'Contributions', description: 'Share your research work and follow its review status.' },
  skills: { title: 'Skills & Verification', description: 'Showcase your abilities and request skill verification.' },
  credits: { title: 'Credits', description: 'Credits recognize the work you contribute to research.' },
  'mentor-feedback': { title: 'Mentor Feedback', description: 'Guidance and feedback from your project mentors.' },
  'ai-assistant': { title: 'AI Assistant', description: 'Get a hand planning your next research step.' },
  messages: { title: 'Messages', description: 'Your conversations with project teammates and mentors.' },
  profile: { title: 'Profile', description: 'Manage how your collaborators see your profile.' },
  settings: { title: 'Settings', description: 'Manage your workspace preferences.' },
  notifications: { title: 'Notifications', description: 'Recent updates from your projects and collaborators.' },
};

export function StudentWorkspaceDemo({ path }: { path: string }) {
  const slug = path === '/notifications' ? 'notifications' : path.split('/').at(-1) ?? '';
  const section = sectionBySlug[slug] ?? { title: 'Student workspace', description: 'Explore your research workspace.' };
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [interestedProjects, setInterestedProjects] = useState<string[]>([]);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [contribution, setContribution] = useState('');
  const [contributions, setContributions] = useState<string[]>(['Data augmentation pipeline', 'Climate model literature review']);
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState<string[]>([]);
  const [assistantQuestion, setAssistantQuestion] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('Rahul Sharma');
  const [skillRequested, setSkillRequested] = useState(false);
  const [creditsRedeemed, setCreditsRedeemed] = useState(false);

  const submitContribution = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = contribution.trim();
    if (!title) return;
    setContributions((items) => [title, ...items]);
    setContribution('');
    setSavedMessage('Your contribution draft was added to this preview.');
  };

  const submitReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = reply.trim();
    if (!message) return;
    setReplies((items) => [...items, message]);
    setReply('');
  };

  const content = (() => {
    if (slug === 'tasks') {
      return (
        <div className="space-y-3">
          {taskSamples.map((task) => {
            const done = completedTasks.includes(task.name);
            return (
              <article key={task.name} className="flex items-center gap-3 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-4">
                <button type="button" aria-label={`${done ? 'Reopen' : 'Complete'} ${task.name}`} onClick={() => setCompletedTasks((items) => done ? items.filter((item) => item !== task.name) : [...items, task.name])} className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${done ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-600 text-transparent hover:border-blue-400'}`}><Check className="size-4" aria-hidden="true" /></button>
                <div className="min-w-0 flex-1"><h2 className={`text-sm font-semibold ${done ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{task.name}</h2><p className="mt-1 text-xs text-slate-400">{task.project} · Due {task.due}</p></div>
                <span className="hidden rounded-full bg-slate-800 px-2.5 py-1 text-[10px] text-slate-300 sm:block">{task.priority}</span>
              </article>
            );
          })}
        </div>
      );
    }

    if (slug === 'projects' || slug === 'recommended') {
      const list = slug === 'projects' ? projectSamples.slice(0, 2) : projectSamples;
      return <div className="grid gap-3 lg:grid-cols-2">{list.map((project) => {
        const interested = interestedProjects.includes(project.name);
        return <article key={project.name} className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5">
          <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-blue-300">{project.organization}</p><h2 className="mt-1 text-sm font-bold text-slate-100">{project.name}</h2></div><span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">{project.match}% match</span></div>
          <p className="mt-3 text-xs leading-5 text-slate-400">{project.detail}</p><p className="mt-3 text-[10px] text-slate-500">{project.tags}</p>
          <button type="button" onClick={() => setInterestedProjects((items) => interested ? items.filter((item) => item !== project.name) : [...items, project.name])} className={`mt-4 rounded-lg px-3 py-2 text-xs font-semibold ${interested ? 'bg-emerald-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>{interested ? 'Interest sent' : 'I’m interested'}</button>
        </article>;
      })}</div>;
    }

    if (slug === 'contributions') {
      return <div className="space-y-4">
        <form onSubmit={submitContribution} className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-4">
          <label htmlFor="contribution-title" className="text-xs font-semibold text-slate-200">Start a contribution</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row"><input id="contribution-title" value={contribution} onChange={(event) => setContribution(event.target.value)} placeholder="Contribution title" className="min-w-0 flex-1 rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2 text-xs text-white outline-none focus:border-blue-500" required /><button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500" type="submit">Save draft</button></div>
          {savedMessage && <p role="status" className="mt-2 text-xs text-emerald-300">{savedMessage}</p>}
        </form>
        {contributions.map((item, index) => <article key={`${item}-${index}`} className="flex items-center gap-3 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-4"><FileCheck2 className="size-4 text-violet-300" aria-hidden="true" /><span className="flex-1 text-xs font-semibold text-slate-200">{item}</span><span className="text-[10px] text-slate-400">{index === 0 ? 'Draft' : 'Under review'}</span></article>)}
      </div>;
    }

    if (slug === 'skills') {
      return <div className="grid gap-3 sm:grid-cols-2">{[['Python', 95], ['Machine Learning', 88], ['Data Analysis', 72], ['Cybersecurity', 90]].map(([skill, score]) => <article key={skill} className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-4"><div className="flex items-center justify-between"><h2 className="text-xs font-semibold text-slate-100">{skill}</h2><span className="text-xs text-slate-400">{score}/100</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-blue-500" style={{ width: `${score}%` }} /></div><p className="mt-3 text-[10px] text-emerald-300">{skill === 'Data Analysis' ? 'Verification in progress' : 'Verified skill'}</p></article>)}
        <button type="button" onClick={() => setSkillRequested(true)} disabled={skillRequested} className="rounded-xl border border-dashed border-blue-500/50 bg-blue-500/5 p-4 text-left text-xs font-semibold text-blue-300 hover:bg-blue-500/10 disabled:text-emerald-300">{skillRequested ? 'Verification requested' : 'Request a skill verification'}</button>
      </div>;
    }

    if (slug === 'credits') {
      return <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-6"><div className="flex items-center gap-3"><CircleDollarSign className="size-8 text-amber-300" aria-hidden="true" /><div><p className="text-xs text-slate-400">Available balance</p><p className="text-3xl font-bold text-white">870 credits</p></div></div><p className="mt-4 max-w-xl text-xs leading-5 text-slate-400">Earn credits when your research contributions are reviewed and approved. Redeem them for learning resources and project opportunities.</p><button type="button" onClick={() => setCreditsRedeemed(true)} disabled={creditsRedeemed} className="mt-5 rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-500 disabled:bg-emerald-700">{creditsRedeemed ? 'Learning pack reserved' : 'Redeem 100 credits for a learning pack'}</button></section>;
    }

    if (slug === 'mentor-feedback') {
      return <article className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">PN</span><div><h2 className="text-xs font-bold text-slate-100">Dr. Priya Nair</h2><p className="text-[10px] text-slate-500">AI Climate Monitoring · Yesterday</p></div></div><p className="mt-4 text-xs leading-5 text-slate-300">Your data-cleaning approach is heading in the right direction. Consider documenting how you handled missing satellite observations so the team can reproduce your results.</p><button type="button" onClick={() => setSavedMessage('Feedback marked as reviewed.')} className="mt-4 rounded-lg border border-[#293950] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5">Mark as reviewed</button>{savedMessage && <p role="status" className="mt-2 text-xs text-emerald-300">{savedMessage}</p>}</article>;
    }

    if (slug === 'ai-assistant') {
      return <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5"><div className="flex items-center gap-2"><Sparkles className="size-4 text-violet-300" aria-hidden="true" /><h2 className="text-xs font-bold text-white">Research helper</h2></div><p className="mt-3 text-xs leading-5 text-slate-400">Ask for ideas on planning experiments, organizing a literature review, or explaining a research concept.</p><form onSubmit={(event) => { event.preventDefault(); if (assistantQuestion.trim()) setAssistantAnswer(`A good next step for “${assistantQuestion.trim()}” is to define a focused question, list the evidence you need, and break the work into small tasks. Ask your project mentor to review the plan before you begin.`); }} className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={assistantQuestion} onChange={(event) => setAssistantQuestion(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2 text-xs text-white outline-none focus:border-blue-500" placeholder="What are you working on?" required /><button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500">Ask assistant</button></form>{assistantAnswer && <p role="status" className="mt-4 rounded-lg bg-[#111f35] p-3 text-xs leading-5 text-slate-200">{assistantAnswer}</p>}</section>;
    }

    if (slug === 'messages') {
      return <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5"><div className="flex items-center gap-3 border-b border-[#1c2a3d] pb-4"><span className="flex size-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">PN</span><div><h2 className="text-xs font-bold text-slate-100">Dr. Priya Nair</h2><p className="text-[10px] text-slate-500">Project mentor</p></div></div><div className="space-y-3 py-4"><p className="max-w-sm rounded-xl bg-[#17243a] p-3 text-xs leading-5 text-slate-200">How is the climate data preprocessing coming along?</p>{replies.map((message, index) => <p key={index} className="ml-auto max-w-sm rounded-xl bg-blue-700 p-3 text-xs leading-5 text-white">{message}</p>)}</div><form onSubmit={submitReply} className="flex gap-2 border-t border-[#1c2a3d] pt-4"><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a message…" className="min-w-0 flex-1 rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2 text-xs text-white outline-none focus:border-blue-500" required /><button type="submit" aria-label="Send message" className="rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-500"><Send className="size-4" aria-hidden="true" /></button></form></section>;
    }

    if (slug === 'notifications') {
      return <div className="space-y-2">{notificationSamples.map((message, index) => {
        const read = readNotifications.includes(index);
        return <article key={message} className={`flex items-center gap-3 rounded-xl border border-[#1c2a3d] p-4 ${read ? 'bg-[#0a111d]' : 'bg-[#0d1624]'}`}><Bell className={`size-4 shrink-0 ${read ? 'text-slate-500' : 'text-blue-300'}`} aria-hidden="true" /><p className={`flex-1 text-xs ${read ? 'text-slate-500' : 'text-slate-200'}`}>{message}</p><button type="button" onClick={() => setReadNotifications((items) => read ? items.filter((item) => item !== index) : [...items, index])} className="text-[10px] font-semibold text-blue-300">{read ? 'Mark unread' : 'Mark read'}</button></article>;
      })}</div>;
    }

    if (slug === 'profile') {
      return <form onSubmit={(event) => { event.preventDefault(); setSavedMessage('Your profile changes were saved for this preview.'); }} className="max-w-xl space-y-4 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5"><label className="block text-xs font-semibold text-slate-200">Full name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-2 w-full rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500" /></label><label className="block text-xs font-semibold text-slate-200">About you<textarea defaultValue="Student researcher interested in climate science, machine learning, and collaborative research." rows={4} className="mt-2 w-full rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2.5 text-xs leading-5 text-white outline-none focus:border-blue-500" /></label><button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500">Save profile</button>{savedMessage && <p role="status" className="text-xs text-emerald-300">{savedMessage}</p>}</form>;
    }

    if (slug === 'settings') {
      return <section className="max-w-xl space-y-3 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5"><h2 className="text-xs font-bold text-white">Workspace preferences</h2>{[['Project updates', 'Receive notifications about tasks and project activity.'], ['Mentor messages', 'Get notified when your mentor sends feedback.'], ['Weekly digest', 'Receive a weekly summary of your research activity.']].map(([title, description], index) => <label key={title} className="flex cursor-pointer items-center gap-3 border-t border-[#1c2a3d] py-3"><input type="checkbox" defaultChecked={index !== 2} className="size-4 accent-blue-600" /><span><span className="block text-xs font-semibold text-slate-200">{title}</span><span className="mt-1 block text-[10px] text-slate-500">{description}</span></span></label>)}</section>;
    }

    return <div className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5 text-sm text-slate-300">This student workspace section is ready for your next step.</div>;
  })();

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300">Student workspace</p>
        <h1 className="mt-2 text-2xl font-bold text-white">{section.title}</h1>
        <p className="mt-2 text-xs leading-5 text-slate-400">{section.description}</p>
      </header>
      {content}
      <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 hover:text-blue-200"><ArrowRight className="size-3.5 rotate-180" aria-hidden="true" /> Back to dashboard</Link>
    </div>
  );
}
