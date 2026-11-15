"use client";

import React from "react";
import { Leaf, Database, Printer, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onOpenDatasetModal: () => void;
  hasDiagnosis: boolean;
}

export function Header({ onOpenDatasetModal, hasDiagnosis }: HeaderProps) {
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
                PlantScan <span className="text-emerald-400">AI</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Vision Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Expert Botanical Pathology & Agricultural Diagnostic System
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 no-print">
          {/* Dataset Corpus Pill Button */}
          <button
            onClick={onOpenDatasetModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-400/60 transition-all shadow-sm"
            title="View training dataset metrics and pathology benchmarks"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Dataset:</span>
            <span className="font-semibold text-emerald-300">100K+ Specimens</span>
          </button>

          {/* Print Button */}
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

          {/* Verified Corpus Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PlantVillage Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}
