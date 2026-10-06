import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const roleBySegment: Record<string, string> = {
  student: 'STUDENT',
  researcher: 'RESEARCHER',
  mentor: 'MENTOR',
  sponsor: 'SPONSOR',
  admin: 'ADMIN',
};
const demoRoleSegments: Record<string, string> = {
  STUDENT: 'student',
  RESEARCHER: 'researcher',
  MENTOR: 'mentor',
  SPONSOR: 'sponsor',
  ADMIN: 'admin',
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const roleSegment = pathname.split('/')[1];
  if (roleSegment && roleBySegment[roleSegment]) {
    const demoValue = request.cookies.get('gardenia_demo_session')?.value;
    const separator = demoValue?.indexOf('|') ?? -1;
    if (demoValue && separator >= 0) {
      const demoRole = demoValue.slice(0, separator);
      const demoEmail = demoValue.slice(separator + 1);
      const demoRoleSegment = demoRoleSegments[demoRole];
      if (demoRoleSegment && demoEmail) {
        if (roleSegment !== demoRoleSegment) {
          return NextResponse.redirect(new URL(`/${demoRoleSegment}/dashboard`, request.url));
        }
        const demoPath = new URL(`/ui${pathname}${request.nextUrl.search}`, request.url);
        return NextResponse.rewrite(demoPath);
      }
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    const missingVariables = [
      !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
      !anonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
    ].filter((variable): variable is string => variable !== null);
    return NextResponse.json(
      { error: `Supabase configuration is incomplete. Set ${missingVariables.join(' and ')} in .env.local, then restart the Next.js server.` },
      { status: 503 },
    );
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  const { data, error: authError } = await supabase.auth.getUser();
  if (authError && authError.name !== 'AuthSessionMissingError') {
    return NextResponse.json({ error: `Unable to validate your session: ${authError.message}` }, { status: 503 });
  }
  if (!data.user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();
  if (profileError) {
    const missingSchema = profileError.code === 'PGRST205'
      || profileError.message.includes("Could not find the table 'public.profiles' in the schema cache");
    return NextResponse.json({
      error: missingSchema
        ? 'The Gardenia database schema is not installed in this Supabase project. From the repository root, run: npx supabase login, npx supabase link --project-ref furlxgfcvpczjeakscgr, then npx supabase db push.'
        : `Unable to verify your platform role: ${profileError.message}`,
    }, { status: 503 });
  }
  if (!profile) {
    return NextResponse.redirect(new URL('/auth/onboarding', request.url));
  }

  const expectedRole = roleBySegment[request.nextUrl.pathname.split('/')[1]];
  if (expectedRole && profile.role !== expectedRole) {
    const actualRole = profile.role.toLowerCase();
    if (!roleBySegment[actualRole]) {
      return NextResponse.json({ error: 'Your account has an invalid platform role.' }, { status: 403 });
    }
    const redirect = NextResponse.redirect(new URL(`/${actualRole}/dashboard`, request.url));
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ['/student/:path*', '/researcher/:path*', '/mentor/:path*', '/sponsor/:path*', '/admin/:path*'],
};
