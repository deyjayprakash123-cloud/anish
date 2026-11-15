"use client";

import React, { useRef, useState } from "react";
import { Upload, Camera, Image as ImageIcon, Sparkles, CheckCircle, RefreshCcw, Database } from "lucide-react";
import { SAMPLE_SPECIMENS, SampleSpecimen } from "@/data/sample-specimens";

interface UploadZoneProps {
  onImageSelected: (base64: string, previewUrl: string, sampleInfo?: SampleSpecimen) => void;
  selectedImage: string | null;
  onClear: () => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export function UploadZone({
  onImageSelected,
  selectedImage,
  onClear,
  isAnalyzing,
  onAnalyze,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSample, setSelectedSample] = useState<SampleSpecimen | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedSample(null);
      onImageSelected(result, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (sample: SampleSpecimen) => {
    setSelectedSample(sample);
    onImageSelected(sample.previewSvg, sample.previewSvg, sample);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Drag & Drop Container */}
      {!selectedImage ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 border-2 border-dashed ${
            isDragging
              ? "border-emerald-400 bg-emerald-950/40 scale-[1.01]"
              : "border-emerald-500/30 hover:border-emerald-400/60 bg-slate-900/40 hover:bg-slate-900/70"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          />

          <div className="max-w-md mx-auto space-y-4">
            {/* Visual Icon Halo */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-b from-emerald-500/20 to-teal-500/5 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/60 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 stroke-[1.8]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Upload or Drop Leaf Specimen Image
              </h3>
              <p className="text-sm text-slate-400">
                Cross-referenced against our 100,000+ multimodal foliar dataset across 38 crop taxonomies.
              </p>
            </div>

            {/* Quick Actions (Browse or Camera) */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-md shadow-emerald-900/40"
              >
                <ImageIcon className="w-4 h-4" />
                Browse File
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                Capture Camera
              </button>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Supports JPEG, PNG, WebP up to 15MB • Automatic EXIF Orientation
            </p>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Specimen Loaded
              </span>
              <h4 className="text-base font-bold text-white">
                {selectedSample ? selectedSample.name : "Custom Foliar Specimen"}
              </h4>
              {selectedSample && (
                <p className="text-xs text-slate-400">{selectedSample.condition}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClear}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Change Specimen
              </button>

              <button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                {isAnalyzing ? "Classifying Against Dataset..." : "Run Scientific Diagnosis"}
              </button>
            </div>
          </div>

          {/* Centered Image Preview */}
          <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 flex items-center justify-center shadow-inner">
            <img
              src={selectedImage}
              alt="Leaf Specimen"
              className="w-full h-full object-contain p-2"
            />
          </div>
        </div>
      )}

      {/* Pre-Loaded Laboratory Sample Specimens */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            Or Test With Dataset Benchmark Archetypes:
          </h4>
          <span className="text-[11px] text-slate-500">Instant 1-Click Load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_SPECIMENS.map((specimen) => {
            const isSelected = selectedSample?.id === specimen.id;
            return (
              <button
                key={specimen.id}
                type="button"
                onClick={() => handleSampleClick(specimen)}
                disabled={isAnalyzing}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? "bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400/40"
                    : "glass-panel hover:border-emerald-500/40 hover:bg-slate-900/80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700 bg-slate-950">
                    <img
                      src={specimen.previewSvg}
                      alt={specimen.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                      {specimen.name}
                      {isSelected && <CheckCircle className="w-3 h-3 text-emerald-400 inline" />}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium truncate">
                      {specimen.plant}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {specimen.condition}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
