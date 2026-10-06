import { NextRequest, NextResponse } from 'next/server';
import { ApiError, apiErrorResponse, requireAuthenticatedActor } from '@/lib/auth';
import { readJsonBody, requireText, requireUuid } from '@/lib/http';

type RouteContext = { params: Promise<{ conversationId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { supabase, actor } = await requireAuthenticatedActor();
    const { conversationId: rawConversationId } = await context.params;
    const conversationId = requireUuid(rawConversationId, 'conversationId');
    const { data, error } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_id, body, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw new Error(`Conversation messages could not be loaded: ${error.message}`);

    const { error: readError } = await supabase
      .from('conversation_members')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', actor.id);
    if (readError) throw new Error(`Conversation read status could not be updated: ${readError.message}`);
    return NextResponse.json({ messages: (data ?? []).reverse() });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { supabase, actor } = await requireAuthenticatedActor();
    const { conversationId: rawConversationId } = await context.params;
    const conversationId = requireUuid(rawConversationId, 'conversationId');
    const body = await readJsonBody(request);
    const messageBody = requireText(body.body, 'body', 10000);
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: actor.id, body: messageBody })
      .select('id, conversation_id, sender_id, body, created_at')
      .single();
    if (error) {
      console.error('Message send failed:', error.message);
      throw new ApiError('Message could not be sent. Confirm that you belong to this conversation.', 403);
    }
    return NextResponse.json({ message: data }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
