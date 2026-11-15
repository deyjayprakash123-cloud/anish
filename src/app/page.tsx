"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { DatasetModal } from "@/components/DatasetModal";
import { UploadZone } from "@/components/UploadZone";
import { ScanningOverlay } from "@/components/ScanningOverlay";
import { DiagnosticReportView } from "@/components/DiagnosticReportView";
import { DiagnosisResult } from "@/types/diagnosis";
import { SampleSpecimen } from "@/data/sample-specimens";
import {
  Sparkles,
  Database,
  Layers,
  BookOpen,
  AlertCircle,
  FlaskConical,
  Sprout,
  Microscope,
} from "lucide-react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);

  const handleImageSelected = (
    base64: string,
    previewUrl: string,
    sampleInfo?: SampleSpecimen
  ) => {
    setSelectedImage(base64);
    setError(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setDiagnosis(null);
    setError(null);
  };

  const handleRunDiagnosis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setDiagnosis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
        }),
      });

      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        // Handle server non-JSON responses (e.g. Vercel HTML timeout or payload error)
        throw new Error(
          rawText.length > 250
            ? `Server returned HTTP ${res.status} (${res.statusText || "Error"}). Please ensure image file is under 4MB.`
            : rawText || `Server returned HTTP ${res.status}`
        );
      }

      if (!res.ok) {
        throw new Error(data?.error || `Analysis failed with status ${res.status}`);
      }

      setDiagnosis(data);
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      setError(
        err.message ||
          "Failed to analyze specimen. Please verify your network connection and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
        hasDiagnosis={Boolean(diagnosis)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Error Alert */}
        {error && (
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-rose-500/40 bg-rose-950/20 text-rose-200 flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm space-y-1">
              <strong className="font-semibold block text-white">Diagnostic Error:</strong>
              <p>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Diagnosis Results Screen */}
        {diagnosis && selectedImage ? (
          <DiagnosticReportView
            diagnosis={diagnosis}
            imageSrc={selectedImage}
            onReset={handleClearImage}
          />
        ) : isAnalyzing && selectedImage ? (
          /* Live Scanning Animation */
          <ScanningOverlay imageSrc={selectedImage} />
        ) : (
          /* Landing & Upload Screen */
          <div className="space-y-10">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trained on 100,000+ Verified Multimodal Foliar Specimens</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Foliar Disease Diagnostics Powered by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500">
                  PlantScan AI
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Trained on over 100,000+ agricultural specimens across 38 crop taxonomies.
                Upload any crop or plant leaf to generate an exhaustive, science-fair grade
                8-tier pathology dossier.
              </p>
            </div>

            {/* Architecture Highlights Pill Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    100K+ Specimen Corpus
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Aggregated from PlantVillage, CGIAR, and USDA certified pathology archives.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
                  <Microscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    98.7% Concordance
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    High-precision recognition of necrotic rings, chlorotic halos, and veinal margins.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    8-Tier Pathology Dossier
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Exact taxonomy, FRAC chemistry, biological antagonists & cultural hygiene.
                  </p>
                </div>
              </div>
            </div>

            {/* Upload & Sample Testing Section */}
            <UploadZone
              onImageSelected={handleImageSelected}
              selectedImage={selectedImage}
              onClear={handleClearImage}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleRunDiagnosis}
            />
          </div>
        )}
      </main>

      {/* Dataset Information Modal */}
      <DatasetModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 space-y-2">
          <p className="flex items-center justify-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>
              PlantScan AI — Powered by Curated Global Agricultural Pathology Datasets
            </span>
          </p>
          <p className="text-[11px] text-slate-500">
            Engineered for Academic Research, Extension Laboratories & Science Fair Exhibitions.
            Always adhere to certified agronomic safety guidelines and manufacturer chemical labels.
          </p>
        </div>
      </footer>
    </div>
  );
}
