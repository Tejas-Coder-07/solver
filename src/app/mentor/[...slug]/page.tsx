import { PortalPlaceholder } from '@/components/portal/PortalPlaceholder';

export default async function PortalSectionPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <PortalPlaceholder path={`/mentor/${slug.join('/')}`} />;
}
