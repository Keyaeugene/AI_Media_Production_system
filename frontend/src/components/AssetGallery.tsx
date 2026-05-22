"use client";

import { useState } from "react";
import { ImageIcon, Film, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Asset } from "@/types";

interface Props {
  assets: Asset[];
}

export default function AssetGallery({ assets }: Props) {
  const images = assets.filter((asset) => asset.asset_type === "image");
  const clips = assets.filter((asset) => asset.asset_type === "video_clip");
  const [lightbox, setLightbox] = useState<{ src: string; index: number } | null>(null);

  function openLightbox(src: string, index: number) {
    setLightbox({ src, index });
  }

  function closeLightbox() {
    setLightbox(null);
  }

  function navigateLightbox(direction: number) {
    if (!lightbox) return;
    const newIndex = lightbox.index + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setLightbox({ src: images[newIndex].storage_url, index: newIndex });
    }
  }

  return (
    <>
      <div className="space-y-8">
        {/* Images section */}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-accent-cyan" />
              Images
              <span className="text-xs font-normal text-slate-600">({images.length})</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((asset, index) => (
                <button
                  key={asset.id}
                  onClick={() => openLightbox(asset.storage_url, index)}
                  className="group relative aspect-[9/16] rounded-xl overflow-hidden glass border border-white/[0.06] hover:border-accent-cyan/40 transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={asset.storage_url}
                    alt={`Beat ${asset.beat_index ?? "unknown"} image`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Beat badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-mono text-slate-300 border border-white/[0.08]">
                    Beat {asset.beat_index ?? "—"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video clips section */}
        {clips.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
              <Film className="w-4 h-4 text-accent-violet" />
              Video Clips
              <span className="text-xs font-normal text-slate-600">({clips.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clips.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative rounded-xl overflow-hidden glass border border-white/[0.06] hover:border-accent-violet/40 transition-all duration-300"
                >
                  <video
                    src={asset.storage_url}
                    controls
                    className="w-full rounded-xl"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-mono text-slate-300 border border-white/[0.08]">
                    Beat {asset.beat_index ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && clips.length === 0 && (
          <div className="glass-card text-center py-12">
            <p className="text-slate-500">No assets generated yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {lightbox.index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(-1);
              }}
              className="absolute left-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {lightbox.index < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(1);
              }}
              className="absolute right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <img
            src={lightbox.src}
            alt="Full-size preview"
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-glass-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
