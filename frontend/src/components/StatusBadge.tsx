import { JobStatus } from "@/types";

interface Props {
  status: JobStatus;
}

const config: Record<JobStatus, { bg: string; text: string; glow: string; dot: string }> = {
  pending: {
    bg: "bg-slate-500/15",
    text: "text-slate-300",
    glow: "",
    dot: "bg-slate-400",
  },
  running: {
    bg: "bg-accent-violet/15",
    text: "text-violet-300",
    glow: "shadow-[0_0_10px_rgba(139,92,246,0.25)]",
    dot: "bg-accent-violet animate-pulse",
  },
  reviewing: {
    bg: "bg-accent-amber/15",
    text: "text-amber-300",
    glow: "shadow-[0_0_10px_rgba(245,158,11,0.25)]",
    dot: "bg-accent-amber animate-pulse",
  },
  completed: {
    bg: "bg-accent-emerald/15",
    text: "text-emerald-300",
    glow: "",
    dot: "bg-accent-emerald",
  },
  failed: {
    bg: "bg-accent-rose/15",
    text: "text-rose-300",
    glow: "",
    dot: "bg-accent-rose",
  },
};

export default function StatusBadge({ status }: Props) {
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} ${c.glow} transition-all duration-300`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
