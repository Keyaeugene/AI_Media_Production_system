import { useEffect, useRef, useState } from "react";

import { LogMessage } from "@/types";

export function useJobSocket(jobId: string | null) {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!jobId) return;
    const base = process.env.NEXT_PUBLIC_WS_URL;
    if (!base) return;

    ws.current = new WebSocket(`${base}/ws/${jobId}`);
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data) as LogMessage | { type: string };
      if ("type" in data && data.type === "ping") return;
      setLogs((prev) => [...prev, data as LogMessage]);
    };
    ws.current.onerror = () => console.error("WebSocket error");

    return () => ws.current?.close();
  }, [jobId]);

  return logs;
}
