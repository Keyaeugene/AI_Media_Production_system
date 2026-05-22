import { Sparkles } from "lucide-react";
import JobForm from "@/components/JobForm";

export default function NewJobPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6 animate-fade-in-up">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create New Job</h1>
        </div>
        <p className="text-slate-400 text-sm ml-[52px]">
          Configure your pipeline input and let the agents handle the rest.
        </p>
      </div>
      <div className="glass-card">
        <JobForm />
      </div>
    </div>
  );
}
