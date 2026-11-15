"use client";

import React, { useState, useEffect } from "react";
import { X, KeyRound, ShieldAlert, CheckCircle2, Eye, EyeOff, Sparkles, RefreshCw } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKeys: (key1: string, key2: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, onSaveKeys }: ApiKeyModalProps) {
  const [key1, setKey1] = useState("");
  const [key2, setKey2] = useState("");
  const [showKey1, setShowKey1] = useState(false);
  const [showKey2, setShowKey2] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setKey1(localStorage.getItem("phyto_gemini_key_1") || "");
      setKey2(localStorage.getItem("phyto_gemini_key_2") || "");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("phyto_gemini_key_1", key1.trim());
    localStorage.setItem("phyto_gemini_key_2", key2.trim());
    onSaveKeys(key1.trim(), key2.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setKey1("");
    setKey2("");
    localStorage.removeItem("phyto_gemini_key_1");
    localStorage.removeItem("phyto_gemini_key_2");
    onSaveKeys("", "");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Dual-API Key Rate Limit Controller
            </h3>
            <p className="text-xs text-slate-400">
              High-concurrency rate limit failover for Google Gemini
            </p>
          </div>
        </div>

        {/* Rate Limit Architecture Info Box */}
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
          <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            Automatic Rate-Limit Protection (HTTP 429 Failover)
          </div>
          <p className="leading-relaxed">
            Google Gemini free-tier enforces a 15 RPM quota. By configuring two API keys,
            PhytoScan AI round-robins traffic and activates <strong className="text-emerald-300">instant zero-downtime failover</strong> to
            Key 2 whenever Key 1 reaches its quota or returns a 429 error.
          </p>
          <p className="text-[11px] text-slate-400">
            <em>Optional:</em> If left empty here, the server uses the configured <code className="text-emerald-300">GEMINI_API_KEY_1</code> and <code className="text-emerald-300">GEMINI_API_KEY_2</code> environment variables on Vercel.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Key 1 */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Primary Key: Gemini API Key #1</span>
              <span className="text-[11px] text-emerald-400 font-mono">Active Channel A</span>
            </label>
            <div className="relative">
              <input
                type={showKey1 ? "text" : "password"}
                placeholder="AIzaSy..."
                value={key1}
                onChange={(e) => setKey1(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono text-slate-100 placeholder:text-slate-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey1(!showKey1)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showKey1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Key 2 */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Secondary Key: Gemini API Key #2</span>
              <span className="text-[11px] text-teal-400 font-mono">Failover Standby Channel B</span>
            </label>
            <div className="relative">
              <input
                type={showKey2 ? "text" : "password"}
                placeholder="AIzaSy..."
                value={key2}
                onChange={(e) => setKey2(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm font-mono text-slate-100 placeholder:text-slate-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey2(!showKey2)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showKey2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-medium"
          >
            Clear Stored Keys
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Saved!
                </>
              ) : (
                "Save & Apply"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
