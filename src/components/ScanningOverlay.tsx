"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Scan, Activity, Cpu, ShieldCheck } from "lucide-react";

interface ScanningOverlayProps {
  imageSrc: string;
}

const SCAN_STAGES = [
  { text: "Acquiring specimen histology & pixel spectral analysis...", delay: 0 },
  { text: "Detecting necrotic lesion boundaries & chlorotic halos...", delay: 2000 },
  { text: "Querying Gemini lightweight vision engine via active key...", delay: 4500 },
  { text: "Synthesizing FRAC chemical treatments & biological controls...", delay: 7500 },
  { text: "Finalizing exhaustive 8-tier plant pathology report...", delay: 10500 },
];

export function ScanningOverlay({ imageSrc }: ScanningOverlayProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    SCAN_STAGES.forEach((stage, idx) => {
      const timeout = setTimeout(() => {
        setCurrentStageIndex(idx);
      }, stage.delay);
      intervals.push(timeout);
    });

    return () => {
      intervals.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/40 text-center space-y-6 animate-pulse-slow">
      {/* Specimen Box with Laser Scan Effect */}
      <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-2xl shadow-emerald-500/20 bg-slate-950">
        <img
          src={imageSrc}
          alt="Scanning Specimen"
          className="w-full h-full object-contain p-2 filter brightness-90 contrast-110"
        />

        {/* Moving Laser Scanner Line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-line z-10" />

        {/* Grid HUD Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966915_1px,transparent_1px),linear-gradient(to_bottom,#05966915_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Corner HUD Markers */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
      </div>

      {/* Progress & Status Message */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Activity className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span>Multimodal Microscopic Examination Active</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white transition-all">
          {SCAN_STAGES[currentStageIndex]?.text}
        </h3>

        {/* Stepper Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {SCAN_STAGES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStageIndex
                  ? "w-8 bg-emerald-400"
                  : idx < currentStageIndex
                  ? "w-2 bg-emerald-700"
                  : "w-2 bg-slate-800"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-slate-400 pt-1">
          Dual-Key Rate Limit Controller standing by for sub-second failover...
        </p>
      </div>
    </div>
  );
}
