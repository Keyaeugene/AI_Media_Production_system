import Link from "next/link";
import { Sparkles, Layers, Clapperboard, Zap, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Script Generation",
    description: "From a brief or theme to beat-based cinematic scripts in seconds",
    gradient: "from-accent-violet to-purple-400",
  },
  {
    icon: Layers,
    title: "Multi-Agent Pipeline",
    description: "Six specialized AI agents collaborate: script, prompt, review, image, video, assembly",
    gradient: "from-accent-cyan to-blue-400",
  },
  {
    icon: Clapperboard,
    title: "Cinematic Output",
    description: "Midjourney stills, Kling motion clips, ElevenLabs voiceover — assembled with ffmpeg",
    gradient: "from-accent-emerald to-teal-400",
  },
  {
    icon: Zap,
    title: "Real-time Tracking",
    description: "WebSocket log streaming and live pipeline progress from submission to final video",
    gradient: "from-accent-amber to-yellow-400",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
      {/* ── Hero ───────────────────────────────────── */}
      <section className="text-center space-y-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-sm text-xs font-medium text-slate-300 mb-2">
          <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
          Multi-Agent Production Pipeline
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="gradient-text">AI-Powered</span>{" "}
          <span className="text-white">Cinematic</span>
          <br />
          <span className="text-white">Video Production</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Submit a theme, brief, or script — and let autonomous agents generate
          professional vertical videos with cinematic stills, motion clips,
          voiceover, and color grading.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/jobs/new" className="btn-primary flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5" />
            Create New Job
          </Link>
          <Link href="/jobs" className="btn-secondary flex items-center gap-2 text-base">
            View Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="glass-card group cursor-default opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${0.1 + index * 0.08}s`, animationFillMode: "forwards" }}
          >
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}
            >
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1.5">{feature.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* ── Pipeline preview strip ──────────────────── */}
      <section className="glass rounded-2xl p-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Pipeline Flow
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {["Script", "Prompts", "Review", "Images", "Clips", "Voiceover", "Assembly", "Color Grade"].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] text-slate-300 font-medium border border-white/[0.06]">
                  {step}
                </span>
                {i < 7 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
