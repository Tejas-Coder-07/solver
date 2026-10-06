import { NextResponse } from 'next/server';
import { apiErrorResponse, requireAuthenticatedActor } from '@/lib/auth';

export async function GET() {
  try {
    const { supabase, actor } = await requireAuthenticatedActor();
    const { data, error } = await supabase
      .from('role_access_requests')
      .select('id, requested_role, status, decision_notes, requested_at, decided_at')
      .eq('user_id', actor.id)
      .order('requested_at', { ascending: false });
    if (error) throw new Error(`Role access requests could not be loaded: ${error.message}`);
    return NextResponse.json({ requests: data ?? [] });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
