import { NextRequest, NextResponse } from 'next/server';
import { ApiError, apiErrorResponse, requireAuthenticatedActor, requireRole } from '@/lib/auth';
import { optionalText, readJsonBody, requireText, requireUuid } from '@/lib/http';

type RouteContext = { params: Promise<{ projectId: string }> };

function jsonObject(value: unknown, field: string) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError(`${field} must be a JSON object.`, 400);
  }
  return value as Record<string, unknown>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { supabase, actor } = await requireAuthenticatedActor();
    requireRole(actor, ['SPONSOR', 'ADMIN']);
    const { projectId: rawProjectId } = await context.params;
    const projectId = requireUuid(rawProjectId, 'projectId');
    const body = await readJsonBody(request);
    const requiredSkills = body.requiredSkills ?? [];
    if (!Array.isArray(requiredSkills) || requiredSkills.length > 50
      || requiredSkills.some((skill) => typeof skill !== 'string' || !skill.trim() || skill.length > 80)) {
      throw new ApiError('requiredSkills must contain at most 50 skill names of 80 characters or fewer.', 400);
    }
    const { data: charterVersion, error } = await supabase.rpc('update_sponsored_project', {
      p_project_id: projectId,
      p_title: requireText(body.title, 'title', 200),
      p_objective: requireText(body.objective, 'objective', 8000),
      p_summary: optionalText(body.summary, 'summary', 4000) ?? '',
      p_required_skills: requiredSkills.map((skill: string) => skill.trim()),
      p_reward_rules: jsonObject(body.rewardRules ?? {}, 'rewardRules'),
      p_access_rules: jsonObject(body.accessRules ?? {}, 'accessRules'),
      p_charter: jsonObject(body.charter, 'charter'),
    });
    if (error) {
      console.error('Project update transaction failed:', error.message);
      throw new ApiError('Project details could not be saved. Confirm the project is a draft owned by your organization.', 400);
    }
    return NextResponse.json({ success: true, charterVersion });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
