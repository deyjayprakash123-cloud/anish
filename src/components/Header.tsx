"use client";

import React from "react";
import { Leaf, ShieldCheck, KeyRound, Sparkles, Printer } from "lucide-react";

interface HeaderProps {
  onOpenKeysModal: () => void;
  hasCustomKeys: boolean;
  hasDiagnosis: boolean;
}

export function Header({ onOpenKeysModal, hasCustomKeys, hasDiagnosis }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/60 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <Leaf className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                PhytoScan <span className="text-emerald-400">AI</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gemini Vision
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Expert Botanical Pathology & Agricultural Diagnostic System
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 no-print">
          {/* Dual API Key Status Pill */}
          <button
            onClick={onOpenKeysModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              hasCustomKeys
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40"
                : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-slate-500"
            }`}
            title="Configure dual Gemini API keys for rate-limit protection"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Rate Limit Controller:</span>
            <span className="font-semibold text-emerald-400">
              {hasCustomKeys ? "2 Keys Active" : "Dual Keys Ready"}
            </span>
          </button>

          {/* Print Button (active when report is rendered) */}
          {hasDiagnosis && (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/50 transition-colors"
              title="Print laboratory diagnostic dossier"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
          )}

          {/* Vercel Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-400">
            <svg className="w-3 h-3 fill-current text-white" viewBox="0 0 1155 1000">
              <path d="m577.3 0 577.4 1000H0z" />
            </svg>
            <span>Vercel Edge Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
