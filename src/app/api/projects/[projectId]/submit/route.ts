import { NextResponse } from 'next/server';
import { ApiError, apiErrorResponse, requireAuthenticatedActor, requireRole } from '@/lib/auth';
import { requireUuid } from '@/lib/http';

type RouteContext = { params: Promise<{ projectId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { supabase, actor } = await requireAuthenticatedActor();
    requireRole(actor, ['SPONSOR']);
    const { projectId: rawProjectId } = await context.params;
    const projectId = requireUuid(rawProjectId, 'projectId');
    const { error } = await supabase.rpc('submit_project_for_review', { p_project_id: projectId });
    if (error) {
      console.error('Project submission failed:', error.message);
      throw new ApiError('The project could not be submitted. Confirm organization verification and complete project details.', 400);
    }
    return NextResponse.json({ success: true, status: 'SUBMITTED' });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
