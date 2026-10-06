'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Send } from 'lucide-react';

const sectionDetails: Record<string, { title: string; description: string }> = {
  messages: { title: 'Messages', description: 'Coordinate with your research collaborators.' },
  profile: { title: 'Researcher Profile', description: 'Your expertise, research interests, and public profile.' },
  settings: { title: 'Workspace Settings', description: 'Manage your research workspace preferences.' },
};

export function ResearcherWorkspaceDemo({ section }: { section: string }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const details = sectionDetails[section] ?? {
    title: section.split('/').at(-1)?.replaceAll('-', ' ') ?? 'Research Workspace',
    description: 'Research planning and collaboration tools for your projects.',
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">Researcher Portal</p>
        <h1 className="mt-2 text-2xl font-bold capitalize text-white">{details.title}</h1>
        <p className="mt-2 text-xs text-slate-400">{details.description}</p>
      </header>
      {section === 'messages' ? (
        <section className="rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5">
          <div className="flex items-center gap-3 border-b border-[#1c2a3d] pb-4"><span className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">PN</span><div><h2 className="text-xs font-bold text-slate-100">Dr. Priya Nair</h2><p className="text-[10px] text-slate-500">AI for Deforestation Monitoring</p></div></div>
          <div className="space-y-3 py-4"><p className="max-w-sm rounded-xl bg-[#17243a] p-3 text-xs leading-5 text-slate-200">I reviewed the latest forest classification results. The regional breakdown looks promising—could you share the methodology notes?</p>{messages.map((text, index) => <p key={index} className="ml-auto max-w-sm rounded-xl bg-blue-700 p-3 text-xs text-white">{text}</p>)}</div>
          <form onSubmit={(event) => { event.preventDefault(); const text = message.trim(); if (text) { setMessages((items) => [...items, text]); setMessage(''); } }} className="flex gap-2 border-t border-[#1c2a3d] pt-4"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message…" required className="min-w-0 flex-1 rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2 text-xs text-white outline-none focus:border-blue-500" /><button type="submit" aria-label="Send message" className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500"><Send className="size-4" aria-hidden="true" /></button></form>
        </section>
      ) : section === 'settings' ? (
        <section className="max-w-xl space-y-3 rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5">
          {['Project updates', 'Collaboration requests', 'Weekly research digest'].map((item, index) => <label key={item} className="flex items-center gap-3 border-b border-[#1c2a3d] py-3 last:border-0"><input type="checkbox" defaultChecked={index < 2} className="size-4 accent-blue-600" /><span className="text-xs text-slate-200">{item}</span></label>)}
          <p className="text-[9px] text-slate-500">Preferences are stored in this preview only.</p>
        </section>
      ) : (
        <section className="max-w-xl rounded-xl border border-[#1c2a3d] bg-[#0d1624] p-5">
          <label className="block text-xs font-semibold text-slate-200">Research focus<textarea defaultValue="Climate science, machine learning, and reproducible research." rows={4} className="mt-2 w-full rounded-lg border border-[#293950] bg-[#0a0f1a] px-3 py-2 text-xs leading-5 text-white outline-none focus:border-blue-500" /></label>
          <button type="button" onClick={() => setSaved(true)} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"><Check className="size-3.5" aria-hidden="true" />Save profile</button>
          {saved && <p role="status" className="mt-2 text-xs text-emerald-300">Profile saved in this preview.</p>}
        </section>
      )}
      <Link href="/researcher/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-sky-200"><ArrowRight className="size-3.5 rotate-180" aria-hidden="true" /> Back to researcher dashboard</Link>
    </div>
  );
}
