import { NextRequest, NextResponse } from 'next/server';
import { ApiError, apiErrorResponse, requireAuthenticatedActor } from '@/lib/auth';
import { optionalText, readJsonBody, requireUuid } from '@/lib/http';

const conversationKinds = new Set(['DIRECT', 'PROJECT']);

export async function GET() {
  try {
    const { supabase, actor } = await requireAuthenticatedActor();
    const { data, error } = await supabase
      .from('conversation_members')
      .select('conversation_id, last_read_at, conversation:conversations(id, kind, project_id, title, created_by, created_at)')
      .eq('user_id', actor.id)
      .order('joined_at', { ascending: false });
    if (error) throw new Error(`Conversations could not be loaded: ${error.message}`);
    const conversations = data ?? [];
    const ids = conversations.map((membership) => membership.conversation_id);
    const latestMessages = ids.length
      ? await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, body, created_at')
        .in('conversation_id', ids)
        .order('created_at', { ascending: false })
        .limit(Math.min(ids.length * 2, 100))
      : { data: [], error: null };
    if (latestMessages.error) throw new Error(`Latest messages could not be loaded: ${latestMessages.error.message}`);

    const lastMessageByConversation = new Map<string, {
      id: string;
      conversation_id: string;
      sender_id: string;
      body: string;
      created_at: string;
    }>();
    for (const message of latestMessages.data ?? []) {
      if (!lastMessageByConversation.has(message.conversation_id)) {
        lastMessageByConversation.set(message.conversation_id, message);
      }
    }

    return NextResponse.json({
      conversations: conversations.map((membership) => ({
        ...membership.conversation,
        lastReadAt: membership.last_read_at,
        latestMessage: lastMessageByConversation.get(membership.conversation_id) ?? null,
      })),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase } = await requireAuthenticatedActor();
    const body = await readJsonBody(request);
    if (typeof body.kind !== 'string' || !conversationKinds.has(body.kind)) {
      throw new ApiError('kind must be DIRECT or PROJECT.', 400);
    }
    const memberIds = body.memberIds ?? [];
    if (!Array.isArray(memberIds) || memberIds.length > 49) {
      throw new ApiError('memberIds must be an array containing at most 49 users.', 400);
    }
    const validMemberIds = memberIds.map((id, index) => requireUuid(id, `memberIds[${index}]`));
    const projectId = body.projectId == null || body.projectId === ''
      ? null
      : requireUuid(body.projectId, 'projectId');
    const title = optionalText(body.title, 'title', 200);
    const { data: conversationId, error } = await supabase.rpc('create_conversation', {
      p_kind: body.kind,
      p_project_id: projectId,
      p_title: title,
      p_member_ids: validMemberIds,
    });
    if (error) {
      console.error('Conversation creation failed:', error.message);
      throw new ApiError('Conversation could not be created. Confirm participant and project access.', 400);
    }
    return NextResponse.json({ conversationId }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
