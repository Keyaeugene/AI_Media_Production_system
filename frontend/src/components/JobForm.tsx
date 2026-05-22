"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, AlertCircle, FileText, Tag, ScrollText } from "lucide-react";

import { createJob } from "@/lib/api";
import { ContentMode, InputType } from "@/types";

const modes: { value: ContentMode; label: string; desc: string }[] = [
  { value: "educational", label: "Educational", desc: "Calm, authoritative, story-driven" },
  { value: "commercial", label: "Commercial", desc: "Benefit-driven, product-focused" },
];

const inputTypes: { value: InputType; label: string; icon: typeof Tag }[] = [
  { value: "theme", label: "Theme", icon: Tag },
  { value: "brief", label: "Brief", icon: FileText },
  { value: "script", label: "Script", icon: ScrollText },
];

export default function JobForm() {
  const router = useRouter();
  const [mode, setMode] = useState<ContentMode>("educational");
  const [inputType, setInputType] = useState<InputType>("theme");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const job = await createJob({ mode, input_type: inputType, input_text: inputText });
      router.push(`/jobs/${job.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Content mode */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Content Mode
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {modes.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={`relative p-4 rounded-xl text-left transition-all duration-300 ${
                mode === m.value
                  ? "bg-gradient-to-br from-accent-violet/20 to-accent-cyan/10 border border-accent-violet/40 shadow-glow"
                  : "glass hover:border-white/[0.12]"
              }`}
            >
              <span
                className={`block text-sm font-semibold mb-0.5 ${
                  mode === m.value ? "text-white" : "text-slate-300"
                }`}
              >
                {m.label}
              </span>
              <span className="block text-xs text-slate-500">{m.desc}</span>
              {mode === m.value && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-accent-violet animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Input type */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Input Type
        </legend>
        <div className="flex gap-2">
          {inputTypes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setInputType(value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                inputType === value
                  ? "bg-gradient-to-r from-accent-violet to-accent-cyan text-white shadow-glow"
                  : "glass text-slate-400 hover:text-white hover:border-white/[0.12]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Input text */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          {inputType === "theme" ? "Theme" : inputType === "brief" ? "Brief" : "Script"}
        </label>
        <textarea
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          rows={8}
          required
          placeholder={
            inputType === "theme"
              ? "e.g. The silent discipline behind extreme wealth…"
              : inputType === "brief"
                ? "Describe the video concept, target audience, key messages…"
                : "Paste your beat-by-beat script here…"
          }
          className="input-glass resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-sm text-accent-rose animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !inputText.trim()}
        className="btn-primary flex items-center gap-2.5 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Launching pipeline…
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Run Pipeline
          </>
        )}
      </button>
    </form>
  );
}
