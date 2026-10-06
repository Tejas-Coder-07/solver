import { NextRequest, NextResponse } from 'next/server';
import { ApiError, apiErrorResponse, requireAuthenticatedActor, requireRole } from '@/lib/auth';
import { optionalText, readJsonBody, requireUuid } from '@/lib/http';

type RouteContext = { params: Promise<{ requestId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { supabase, actor } = await requireAuthenticatedActor();
    requireRole(actor, ['ADMIN']);
    const { requestId: rawRequestId } = await context.params;
    const requestId = requireUuid(rawRequestId, 'requestId');
    const body = await readJsonBody(request);
    if (body.decision !== 'APPROVED' && body.decision !== 'REJECTED') {
      throw new ApiError('decision must be APPROVED or REJECTED.', 400);
    }
    const notes = optionalText(body.notes, 'notes', 4000) ?? '';
    const { error } = await supabase.rpc('decide_role_access_request', {
      p_request_id: requestId,
      p_decision: body.decision,
      p_decision_notes: notes,
    });
    if (error) {
      console.error('Role access decision failed:', error.message);
      throw new ApiError('The role access decision could not be recorded.', 400);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
