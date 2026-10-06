'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRole } from '@/context/RoleContext';

interface Conversation {
  id: string;
  kind: 'DIRECT' | 'PROJECT';
  project_id: string | null;
  title: string | null;
  created_at: string;
  lastReadAt: string | null;
  latestMessage: Message | null;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

async function readResponse<T>(response: Response): Promise<T> {
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? 'The messaging request failed.');
  return result as T;
}

export function MessagesWorkspace() {
  const { currentUser } = useRole();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [targetId, setTargetId] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    const response = await fetch('/api/conversations');
    const result = await readResponse<{ conversations: Conversation[] }>(response);
    setConversations(result.conversations);
    return result.conversations;
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    const response = await fetch(`/api/conversations/${conversationId}/messages`);
    const result = await readResponse<{ messages: Message[] }>(response);
    setMessages(result.messages);
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch('/api/conversations');
        const result = await readResponse<{ conversations: Conversation[] }>(response);
        if (active) {
          setConversations(result.conversations);
          setSelectedId(result.conversations[0]?.id ?? null);
          if (result.conversations[0]) {
            const messageResponse = await fetch(`/api/conversations/${result.conversations[0].id}/messages`);
            const messageResult = await readResponse<{ messages: Message[] }>(messageResponse);
            if (active) setMessages(messageResult.messages);
          }
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Conversations could not be loaded.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const selectConversation = async (conversationId: string) => {
    setSelectedId(conversationId);
    setMessages([]);
    setError(null);
    try {
      await loadMessages(conversationId);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Messages could not be loaded.');
    }
  };

  const createConversation = async (kind: 'DIRECT' | 'PROJECT') => {
    const selectedTarget = targetId.trim();
    setError(null);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          projectId: kind === 'PROJECT' ? selectedTarget : null,
          memberIds: kind === 'DIRECT' ? [selectedTarget] : [],
        }),
      });
      const result = await readResponse<{ conversationId: string }>(response);
      const updated = await loadConversations();
      setSelectedId(result.conversationId);
      setMessages([]);
      setTargetId('');
      if (!updated.some((conversation) => conversation.id === result.conversationId)) {
        setConversations((current) => [{ id: result.conversationId, kind, project_id: kind === 'PROJECT' ? selectedTarget : null, title: null, created_at: new Date().toISOString(), lastReadAt: null, latestMessage: null }, ...current]);
      }
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'The conversation could not be created.');
    }
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedId || !draft.trim()) return;
    setSending(true);
    setError(null);
    try {
      const response = await fetch(`/api/conversations/${selectedId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: draft }),
      });
      const result = await readResponse<{ message: Message }>(response);
      setMessages((current) => [...current, result.message]);
      setDraft('');
      await loadConversations();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'The message could not be sent.');
    } finally {
      setSending(false);
    }
  };

  const selected = conversations.find((conversation) => conversation.id === selectedId);

  return (
    <section className="mx-auto max-w-6xl space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="mt-1 text-sm text-slate-400">Conversations and project messages are stored securely in Gardenia.</p>
      </header>
      {error && <p role="alert" className="rounded-lg border border-rose-900 bg-rose-950/50 px-4 py-3 text-sm text-rose-200">{error}</p>}
      <div className="grid min-h-[32rem] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 md:grid-cols-[18rem_1fr]">
        <aside className="border-b border-slate-800 md:border-b-0 md:border-r">
          <div className="border-b border-slate-800 p-4">
            <p className="text-sm font-semibold text-white">Start a conversation</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Enter a user ID for a direct chat, or a project ID for a project chat.</p>
            <form className="mt-3 space-y-2" onSubmit={(event) => {
              event.preventDefault();
              void createConversation('DIRECT');
            }}>
              <label className="sr-only" htmlFor="conversation-target">User or project ID</label>
              <input id="conversation-target" value={targetId} onChange={(event) => setTargetId(event.target.value)} placeholder="UUID" className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500" />
              <div className="flex gap-2">
                <button disabled={!targetId.trim()} className="rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50" type="submit">Direct chat</button>
                <button disabled={!targetId.trim()} className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-200 disabled:opacity-50" type="button" onClick={() => void createConversation('PROJECT')}>Project chat</button>
              </div>
            </form>
          </div>
          <div className="max-h-80 overflow-y-auto md:max-h-[26rem]">
            {loading ? <p className="p-4 text-sm text-slate-400">Loading conversations…</p> : conversations.length ? conversations.map((conversation) => (
              <button key={conversation.id} type="button" onClick={() => void selectConversation(conversation.id)} className={`block w-full border-b border-slate-800 px-4 py-3 text-left ${selectedId === conversation.id ? 'bg-blue-950/50' : 'hover:bg-slate-900'}`}>
                <span className="block truncate text-sm font-medium text-slate-100">{conversation.title || (conversation.kind === 'PROJECT' ? 'Project conversation' : 'Direct conversation')}</span>
                <span className="mt-1 block truncate text-xs text-slate-400">{conversation.latestMessage?.body ?? (conversation.project_id ? `Project ${conversation.project_id}` : conversation.id)}</span>
              </button>
            )) : <p className="p-4 text-sm text-slate-400">No conversations yet.</p>}
          </div>
        </aside>
        <div className="flex min-h-96 flex-col">
          {selected ? (
            <>
              <header className="border-b border-slate-800 px-5 py-4">
                <h2 className="font-semibold text-white">{selected.title || (selected.kind === 'PROJECT' ? 'Project conversation' : 'Direct conversation')}</h2>
                {selected.project_id && <p className="mt-1 text-xs text-slate-400">Project {selected.project_id}</p>}
              </header>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.length ? messages.map((message) => {
                  const own = message.sender_id === currentUser.id;
                  return (
                    <div key={message.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                      <article className={`max-w-[85%] rounded-xl px-3 py-2 ${own ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-100'}`}>
                        {!own && <p className="mb-1 text-[10px] text-slate-400">User {message.sender_id.slice(0, 8)}</p>}
                        <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
                        <time className="mt-1 block text-right text-[10px] opacity-70">{new Date(message.created_at).toLocaleString()}</time>
                      </article>
                    </div>
                  );
                }) : <p className="text-sm text-slate-400">No messages yet. Start the conversation.</p>}
              </div>
              <form onSubmit={(event) => void sendMessage(event)} className="flex gap-2 border-t border-slate-800 p-4">
                <label className="sr-only" htmlFor="message-draft">Message</label>
                <textarea id="message-draft" rows={2} maxLength={10000} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message…" className="min-w-0 flex-1 resize-y rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500" />
                <button type="submit" disabled={sending || !draft.trim()} className="self-end rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{sending ? 'Sending…' : 'Send'}</button>
              </form>
            </>
          ) : <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-slate-400">{loading ? 'Loading messages…' : 'Select a conversation to read and reply.'}</div>}
        </div>
      </div>
    </section>
  );
}
