import { notFound, redirect } from 'next/navigation';

type RouteContext = { params: Promise<{ id: string }> };

export default async function SponsorProjectDetailPage({ params }: RouteContext) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  redirect(`/projects/${id}`);
}
