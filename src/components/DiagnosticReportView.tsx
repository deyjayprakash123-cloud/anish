"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Printer,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Bug,
  Activity,
  Database,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DiagnosisResult } from "@/types/diagnosis";

interface DiagnosticReportViewProps {
  diagnosis: DiagnosisResult;
  imageSrc: string;
  onReset: () => void;
}

export function DiagnosticReportView({
  diagnosis,
  imageSrc,
  onReset,
}: DiagnosticReportViewProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"structured" | "raw">("structured");
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});

  const { summary, metadata, sections, rawMarkdown } = diagnosis;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (id: number) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Status Badge Color Mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Healthy":
        return {
          bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        };
      case "Diseased":
        return {
          bg: "bg-rose-500/15 border-rose-500/30 text-rose-300",
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
        };
      case "Pest-Infested":
        return {
          bg: "bg-purple-500/15 border-purple-500/30 text-purple-300",
          icon: <Bug className="w-4 h-4 text-purple-400" />,
        };
      case "Nutrient-Deficient":
        return {
          bg: "bg-amber-500/15 border-amber-500/30 text-amber-300",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      default:
        return {
          bg: "bg-slate-500/15 border-slate-500/30 text-slate-300",
          icon: <Activity className="w-4 h-4 text-slate-400" />,
        };
    }
  };

  const statusStyle = getStatusBadge(summary.healthStatus);

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Specimen Thumbnail & Primary Diagnosis */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 flex-shrink-0 shadow-lg">
              <img
                src={imageSrc}
                alt="Analyzed Specimen"
                className="w-full h-full object-contain p-1"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg}`}
                >
                  {statusStyle.icon}
                  {summary.healthStatus}
                </span>

                {summary.severityRating !== "None" && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      summary.severityRating === "Critical" || summary.severityRating === "Severe"
                        ? "bg-rose-950/60 text-rose-400 border-rose-500/40"
                        : summary.severityRating === "Moderate"
                        ? "bg-amber-950/60 text-amber-400 border-amber-500/40"
                        : "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                    }`}
                  >
                    Severity: {summary.severityRating}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {summary.diseaseName || "Pathological Analysis"}
              </h2>

              <p className="text-sm text-slate-300">
                <strong className="text-emerald-400 font-semibold">{summary.commonName}</strong>{" "}
                <span className="italic text-slate-400">({summary.scientificName})</span>
              </p>

              {summary.causalOrganism && summary.causalOrganism !== "Not specified" && (
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Causal Agent:</span>{" "}
                  <span className="font-mono text-emerald-300">{summary.causalOrganism}</span>
                </p>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end no-print pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Markdown!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Report
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" /> Print Dossier
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Scan Another
            </button>
          </div>
        </div>

        {/* Dataset Verification & Neural Telemetry Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reference Corpus:</span>
              <span className="font-medium text-emerald-300">
                100K+ Multimodal Specimen Dataset
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span>Feature Concordance:</span>
              <span className="font-mono font-medium text-emerald-400">
                {metadata.confidenceMatch}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span>Inference Time:</span>
              <span className="font-mono text-slate-300">
                {(metadata.latencyMs / 1000).toFixed(2)}s
              </span>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {metadata.verificationStatus}
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher (Structured Visual Dossier vs Raw Research Markdown) */}
      <div className="flex items-center justify-between no-print">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Exhaustive 8-Tier Pathology Dossier
        </h3>
        <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setViewMode("structured")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === "structured"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Structured Cards
          </button>
          <button
            onClick={() => setViewMode("raw")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === "raw"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Full Markdown
          </button>
        </div>
      </div>

      {/* Structured Sections Mode */}
      {viewMode === "structured" ? (
        <div className="space-y-5">
          {sections.map((section) => {
            const isCollapsed = collapsedSections[section.id];
            return (
              <div
                key={section.id}
                className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-emerald-500/30 transition-all"
              >
                {/* Section Header */}
                <div
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {section.icon}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Section {section.id}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {section.title}
                      </h4>
                    </div>
                  </div>

                  <button className="p-1 rounded-lg text-slate-400 group-hover:text-white transition-colors no-print">
                    {isCollapsed ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronUp className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Section Body */}
                {!isCollapsed && (
                  <div className="mt-5 space-y-4 pt-4 border-t border-slate-800/80">
                    {section.bullets.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {section.bullets.map((b, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-1"
                          >
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                              {b.label}
                            </span>
                            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                              {b.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Raw Markdown View */
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950">
          {rawMarkdown}
        </div>
      )}
    </div>
  );
}
