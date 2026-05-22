"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";

import { getJobLogs } from "@/lib/api";
import { useJobSocket } from "@/lib/socket";
import type { LogMessage } from "@/types";

function logKey(log: LogMessage): string {
  return `${log.timestamp}\t${log.agent}\t${log.message}`;
}

interface Props {
  jobId: string;
  /** Poll the REST logs API while the job is still running (required for worker logs). */
  pollLogs?: boolean;
}

const levelStyles: Record<string, { text: string; dot: string }> = {
  info: { text: "text-emerald-400", dot: "bg-emerald-400" },
  warn: { text: "text-amber-400", dot: "bg-amber-400" },
  error: { text: "text-rose-400", dot: "bg-rose-400" },
};

export default function LogViewer({ jobId, pollLogs = false }: Props) {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const socketLogs = useJobSocket(jobId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getJobLogs(jobId)
      .then((rows) => {
        if (!cancelled) setLogs(rows);
      })
      .catch(() => {
        if (!cancelled) setLogs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  useEffect(() => {
    if (!pollLogs) return;
    const id = setInterval(() => {
      getJobLogs(jobId)
        .then(setLogs)
        .catch(() => {});
    }, 2500);
    return () => clearInterval(id);
  }, [jobId, pollLogs]);

  useEffect(() => {
    if (socketLogs.length === 0) return;
    setLogs((prev) => {
      const seen = new Set(prev.map(logKey));
      let next = prev;
      for (const raw of socketLogs) {
        const entry = raw as LogMessage;
        const k = logKey(entry);
        if (seen.has(k)) continue;
        if (next === prev) next = [...prev];
        next.push(entry);
        seen.add(k);
      }
      return next;
    });
  }, [socketLogs]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Terminal header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-1.5 ml-2 text-xs text-slate-500 font-mono">
          <Terminal className="w-3 h-3" />
          pipeline.log
        </div>
        {pollLogs && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Log entries */}
      <div className="h-96 overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-0.5">
        {logs.length === 0 && (
          <p className="text-slate-600 text-center py-8">
            {pollLogs ? "Waiting for pipeline logs…" : "No log entries for this job."}
          </p>
        )}
        {logs.map((log, index) => {
          const style = levelStyles[log.level] ?? levelStyles.info;
          return (
            <div
              key={`${logKey(log)}-${index}`}
              className="flex items-start gap-2 py-0.5 animate-slide-in"
              style={{ animationDelay: `${Math.min(index * 0.02, 0.5)}s` }}
            >
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
              <span className="text-slate-600 flex-shrink-0 w-[70px]">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-violet-400 font-semibold flex-shrink-0">
                [{log.agent}]
              </span>
              <span className={style.text}>{log.message}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
