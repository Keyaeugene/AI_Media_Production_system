import JobDetailShell from "@/components/JobDetailShell";
import { getAssets, getJob } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(id);
  const assets = await getAssets(id);

  return <JobDetailShell initialJob={job} initialAssets={assets} />;
}
