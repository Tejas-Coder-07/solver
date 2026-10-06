export class SupabaseConfigurationError extends Error {
  constructor(missingVariables: string[]) {
    super(`Supabase configuration is incomplete. Set ${missingVariables.join(' and ')} in .env.local, then restart the Next.js server.`);
    this.name = 'SupabaseConfigurationError';
  }
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    const missingVariables = [
      !url ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
      !anonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
    ].filter((variable): variable is string => variable !== null);
    throw new SupabaseConfigurationError(missingVariables);
  }

  return { url, anonKey };
}
