import { Asset, Job, JobCreate, LogMessage } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL;

if (!BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export async function createJob(payload: JobCreate): Promise<Job> {
  const res = await fetch(`${BASE}/api/jobs/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJob(id: string): Promise<Job> {
  const res = await fetch(`${BASE}/api/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listJobs(): Promise<Job[]> {
  const res = await fetch(`${BASE}/api/jobs/`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getAssets(jobId: string): Promise<Asset[]> {
  const res = await fetch(`${BASE}/api/assets/${jobId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJobLogs(jobId: string): Promise<LogMessage[]> {
  const res = await fetch(`${BASE}/api/jobs/${jobId}/logs`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
