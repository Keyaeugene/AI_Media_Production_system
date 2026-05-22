import {
  ScrollText,
  Wand2,
  Search,
  ImageIcon,
  Film,
  Sparkles,
  Check,
} from "lucide-react";
import type { JobStatus } from "@/types";

const STEPS = [
  { key: "script", label: "Script", icon: ScrollText },
  { key: "prompts", label: "Prompts", icon: Wand2 },
  { key: "review", label: "Review", icon: Search },
  { key: "images", label: "Images", icon: ImageIcon },
  { key: "clips", label: "Clips", icon: Film },
  { key: "finalize", label: "Finalize", icon: Sparkles },
] as const;

interface Props {
  currentStep?: string | null;
  status?: JobStatus;
}

export default function ProgressStepper({ currentStep, status }: Props) {
  const normalized = currentStep ?? "";

  let activeIndex: number;
  if (status === "completed" || normalized === "completed") {
    activeIndex = STEPS.length;
  } else if (status === "failed") {
    const i = STEPS.findIndex((s) => s.key === normalized);
    activeIndex = i >= 0 ? i : 0;
  } else {
    activeIndex = Math.max(
      STEPS.findIndex((s) => s.key === normalized),
      0
    );
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex && status !== "completed";
          const isFailed = isActive && status === "failed";
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    isDone
                      ? "bg-gradient-to-br from-accent-emerald to-teal-500 shadow-glow-emerald"
                      : isActive && !isFailed
                        ? "bg-gradient-to-br from-accent-violet to-accent-cyan shadow-glow animate-pulse-glow"
                        : isFailed
                          ? "bg-gradient-to-br from-accent-rose to-red-500 shadow-glow-rose"
                          : "bg-white/[0.06] border border-white/[0.08]"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Icon
                      className={`w-4 h-4 ${
                        isActive || isFailed ? "text-white" : "text-slate-500"
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    isDone
                      ? "text-emerald-400"
                      : isActive
                        ? "text-white"
                        : "text-slate-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 mt-[-20px] rounded-full overflow-hidden bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isDone
                        ? "w-full bg-gradient-to-r from-accent-emerald to-teal-400"
                        : isActive
                          ? "w-1/2 bg-gradient-to-r from-accent-violet to-accent-cyan"
                          : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
