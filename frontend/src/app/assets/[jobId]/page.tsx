import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import AssetGallery from "@/components/AssetGallery";
import { getAssets } from "@/lib/api";

interface Props {
  params: Promise<{ jobId: string }>;
}

export default async function AssetPage({ params }: Props) {
  const { jobId } = await params;
  const assets = await getAssets(jobId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3 text-sm">
        <Link
          href={`/jobs/${jobId}`}
          className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to job
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">
          Assets for{" "}
          <span className="gradient-text font-mono">{jobId.slice(0, 8)}</span>
        </h1>
        <p className="text-xs text-slate-500 font-mono">{jobId}</p>
      </div>

      <AssetGallery assets={assets} />
    </div>
  );
}
