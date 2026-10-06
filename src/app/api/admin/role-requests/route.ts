import { NextResponse } from 'next/server';
import { apiErrorResponse, requireAuthenticatedActor, requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const { supabase, actor } = await requireAuthenticatedActor();
    requireRole(actor, ['ADMIN']);
    const { data, error } = await supabase
      .from('role_access_requests')
      .select('id, user_id, requested_role, status, decision_notes, requested_at, profile:profiles!role_access_requests_user_id_fkey(full_name, institution)')
      .eq('status', 'PENDING')
      .order('requested_at', { ascending: true });
    if (error) throw new Error(`Role access requests could not be loaded: ${error.message}`);
    return NextResponse.json({ requests: data ?? [] });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
