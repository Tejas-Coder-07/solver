import { ResearcherWorkspaceDemo } from '@/components/dashboard/ResearcherWorkspaceDemo';

export default async function ResearcherSectionPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <ResearcherWorkspaceDemo section={slug.join('/')} />;
}
