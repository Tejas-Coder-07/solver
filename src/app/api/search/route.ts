import { NextRequest, NextResponse } from 'next/server';
import { ApiError, apiErrorResponse, requireAuthenticatedActor } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAuthenticatedActor();
    const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
    const workspace = request.nextUrl.searchParams.get('workspace')?.toUpperCase() ?? 'STUDENT';
    if (query.length < 2 || query.length > 100) {
      throw new ApiError('Search terms must be between 2 and 100 characters.', 400);
    }
    if (!['STUDENT', 'RESEARCHER', 'MENTOR', 'SPONSOR', 'ADMIN'].includes(workspace)) {
      throw new ApiError('workspace is not a supported platform role.', 400);
    }
    const pattern = `%${query.replace(/[\\%_]/g, '\\$&')}%`;
    const [projects, people, tasks] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title')
        .ilike('title', pattern)
        .limit(5),
      supabase
        .from('profiles')
        .select('id, full_name, role')
        .ilike('full_name', pattern)
        .limit(5),
      supabase
        .from('project_tasks')
        .select('id, project_id, title')
        .ilike('title', pattern)
        .limit(5),
    ]);
    if (projects.error) throw new Error(`Project search failed: ${projects.error.message}`);
    if (people.error) throw new Error(`People search failed: ${people.error.message}`);
    if (tasks.error) throw new Error(`Task search failed: ${tasks.error.message}`);

    return NextResponse.json({
      results: [
        ...(projects.data ?? []).map((project) => ({
          kind: 'project',
          label: project.title,
          href: `/projects/${project.id}`,
        })),
        ...(people.data ?? []).map((person) => ({
          kind: person.role.toLowerCase(),
          label: person.full_name,
          href: workspace === 'ADMIN'
            ? '/admin/users'
            : workspace === 'SPONSOR'
              ? '/sponsor/find-researchers'
              : workspace === 'MENTOR'
                ? '/mentor/students'
                : workspace === 'RESEARCHER'
                  ? '/researcher/team'
                  : '/student/team',
        })),
        ...(tasks.data ?? []).map((task) => ({
          kind: 'task',
          label: task.title,
          href: `/projects/${task.project_id}`,
        })),
      ],
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
