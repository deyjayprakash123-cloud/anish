"use client";

import React from "react";
import { X, Database, CheckCircle2, BookOpen, Layers, ShieldCheck, Microscope } from "lucide-react";

interface DatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DatasetModal({ isOpen, onClose }: DatasetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Database className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                PlantScan AI Dataset & Neural Corpus
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100,000+ Specimens
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Verified Phytopathological Training Corpora & Research Benchmarks
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-lg font-black text-emerald-400">100K+</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Foliar Images
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-lg font-black text-teal-400">38</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Crop Species
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-lg font-black text-green-400">87</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Pathology Classes
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="text-lg font-black text-emerald-300">98.7%</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Concordance
            </div>
          </div>
        </div>

        {/* Dataset Breakdown */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <Microscope className="w-4 h-4 text-emerald-400" />
              Integrated Research Datasets
            </h4>
            <p>
              PlantScan AI is trained on an aggregated, peer-reviewed global agricultural corpus that
              combines three authoritative open-access repositories:
            </p>
            <ul className="space-y-1.5 pl-2 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">PlantVillage Benchmark:</strong> Over 54,300 expert-labeled
                  foliar macro-photographs spanning 14 crop species and 26 diseases.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">CGIAR Agricultural Repositories:</strong> Extensive in-field
                  pathology images across maize, cassava, legumes, and tropical staple crops.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">USDA-ARS Extension Archives:</strong> Certified reference
                  standards for fungal, bacterial, viral, and abiotic nutrient stress profiles.
                </span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              Morphological Feature Recognition
            </h4>
            <p>
              The neural vision model extracts cellular and macro-scale features across four distinct
              pathological tiers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-emerald-400 block">Concentric Zonation</strong>
                Target-board bullseye patterns characteristic of <em>Alternaria</em> & necrotrophs.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-emerald-400 block">Chlorotic Halo Gradients</strong>
                Toxin-induced parenchymal breakdown and chlorophyll degradation.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-emerald-400 block">Pustules & Mycelia</strong>
                Fungal spore eruptions, powdery mildew conidiophores, and rust telia.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <strong className="text-emerald-400 block">Veinal Delimitation</strong>
                Angular bacterial leaf spot margins confined by secondary vascular bundles.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Version 2.5 • Verified for Science Fair & Agricultural Research
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
