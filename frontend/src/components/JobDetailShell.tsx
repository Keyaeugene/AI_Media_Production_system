"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, AlertTriangle, Play } from "lucide-react";

import AssetGallery from "@/components/AssetGallery";
import LogViewer from "@/components/LogViewer";
import ProgressStepper from "@/components/ProgressStepper";
import StatusBadge from "@/components/StatusBadge";
import { getAssets, getJob } from "@/lib/api";
import type { Asset, Job } from "@/types";

function isTerminal(status: Job["status"]): boolean {
  return status === "completed" || status === "failed";
}

interface Props {
  initialJob: Job;
  initialAssets: Asset[];
}

export default function JobDetailShell({ initialJob, initialAssets }: Props) {
  const [job, setJob] = useState(initialJob);
  const [assets, setAssets] = useState(initialAssets);

  useEffect(() => {
    if (isTerminal(job.status)) return;

    async function tick() {
      try {
        const [j, a] = await Promise.all([getJob(initialJob.id), getAssets(initialJob.id)]);
        setJob(j);
        setAssets(a);
      } catch {
        /* transient network errors while polling */
      }
    }

    const id = setInterval(tick, 4000);
    void tick();
    return () => clearInterval(id);
  }, [initialJob.id, job.status]);

  const pollLogs = !isTerminal(job.status);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 animate-fade-in-up">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/jobs"
          className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Jobs
        </Link>
        <span className="text-slate-700">/</span>
        <Link
          href={`/assets/${job.id}`}
          className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Assets page
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">
            Job{" "}
            <span className="gradient-text font-mono">{job.id.slice(0, 8)}</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono">{job.id}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Progress */}
      <ProgressStepper currentStep={job.current_step} status={job.status} />

      {/* Error banner */}
      {job.error_message && (
        <div className="flex items-start gap-3 rounded-xl glass border-accent-rose/20 px-5 py-4 text-sm text-rose-300 animate-fade-in">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-rose" />
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
            {job.error_message}
          </pre>
        </div>
      )}

      {/* Pipeline logs */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Pipeline Logs
        </h2>
        <LogViewer jobId={job.id} pollLogs={pollLogs} />
      </section>

      {/* Generated assets */}
      {assets.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Generated Assets
          </h2>
          <AssetGallery assets={assets} />
        </section>
      )}

      {/* Final video */}
      {job.final_video_url && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Final Video
          </h2>
          <div className="glass rounded-2xl overflow-hidden p-1">
            <div className="relative rounded-xl overflow-hidden group">
              <video
                src={job.final_video_url}
                controls
                className="w-full max-h-[600px] rounded-xl"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
