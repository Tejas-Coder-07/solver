import { NextRequest, NextResponse } from 'next/server';
import { ApiError, apiErrorResponse, requireAuthenticatedActor, requireRole } from '@/lib/auth';
import { optionalText, readJsonBody, requireUuid } from '@/lib/http';

type RouteContext = { params: Promise<{ projectId: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { supabase, actor } = await requireAuthenticatedActor();
    requireRole(actor, ['ADMIN']);
    const { projectId: rawProjectId } = await context.params;
    const projectId = requireUuid(rawProjectId, 'projectId');
    const body = await readJsonBody(request);
    if (body.decision !== 'APPROVE' && body.decision !== 'REJECT') {
      throw new ApiError('decision must be APPROVE or REJECT.', 400);
    }
    const { error } = await supabase.rpc('decide_project_review', {
      p_project_id: projectId,
      p_decision: body.decision,
      p_review_notes: optionalText(body.notes, 'notes', 4000) ?? '',
    });
    if (error) {
      console.error('Project review decision failed:', error.message);
      throw new ApiError('The project review decision could not be recorded.', 400);
    }
    return NextResponse.json({
      success: true,
      status: body.decision === 'APPROVE' ? 'ADMIN_VERIFIED' : 'REJECTED',
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
