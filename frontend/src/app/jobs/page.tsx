"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Briefcase, Plus, Clock, ChevronRight } from "lucide-react";

import StatusBadge from "@/components/StatusBadge";
import { listJobs } from "@/lib/api";
import type { Job } from "@/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Jobs</h1>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center shadow-glow">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Jobs</h1>
            <p className="text-sm text-slate-500">{jobs.length} total</p>
          </div>
        </div>
        <Link href="/jobs/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.05] mx-auto flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">No jobs yet.</p>
          <Link
            href="/jobs/new"
            className="inline-flex items-center gap-2 text-accent-violet font-medium hover:underline text-sm"
          >
            <Plus className="w-4 h-4" />
            Create your first job
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, index) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="glass-card flex items-center justify-between group opacity-0 animate-fade-in-up !p-4"
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-slate-500 font-mono text-xs">
                  #{(index + 1).toString().padStart(2, "0")}
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-white text-sm group-hover:text-accent-violet transition-colors">
                    {job.id.slice(0, 8)}…
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {new Date(job.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={job.status} />
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
