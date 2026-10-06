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
    const { error } = await supabase.rpc('publish_project', { p_project_id: projectId });
    if (error) {
      console.error('Project publication failed:', error.message);
      throw new ApiError('The project could not be published. It must be administrator-verified and owned by your organization.', 400);
    }
    return NextResponse.json({ success: true, status: 'PUBLISHED' });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
