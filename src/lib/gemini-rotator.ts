import { DiagnosisMetadata } from "@/types/diagnosis";

interface GeminiKeySlot {
  id: "GEMINI_API_KEY_1" | "GEMINI_API_KEY_2" | "CLIENT_KEY_1" | "CLIENT_KEY_2";
  key: string;
  source: "env" | "client";
  lastRateLimitTime?: number;
  failureCount: number;
  successCount: number;
}

// In-memory runtime state for server-level key rotation
let globalKeyIndex = 0;
const rateLimitCooldownMs = 60 * 1000; // 60 seconds cooldown after HTTP 429

export class GeminiDualRotator {
  private slots: GeminiKeySlot[] = [];

  constructor(clientKey1?: string, clientKey2?: string) {
    // 1. Gather keys from client override if provided
    if (clientKey1 && clientKey1.trim()) {
      this.slots.push({
        id: "CLIENT_KEY_1",
        key: clientKey1.trim(),
        source: "client",
        failureCount: 0,
        successCount: 0,
      });
    }
    if (clientKey2 && clientKey2.trim()) {
      this.slots.push({
        id: "CLIENT_KEY_2",
        key: clientKey2.trim(),
        source: "client",
        failureCount: 0,
        successCount: 0,
      });
    }

    // 2. Fall back to / supplement with Environment Variables
    const envKey1 = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY;
    const envKey2 = process.env.GEMINI_API_KEY_2;

    if (this.slots.length === 0) {
      if (envKey1 && envKey1.trim()) {
        this.slots.push({
          id: "GEMINI_API_KEY_1",
          key: envKey1.trim(),
          source: "env",
          failureCount: 0,
          successCount: 0,
        });
      }
      if (envKey2 && envKey2.trim()) {
        this.slots.push({
          id: "GEMINI_API_KEY_2",
          key: envKey2.trim(),
          source: "env",
          failureCount: 0,
          successCount: 0,
        });
      }
    }
  }

  public getAvailableSlots(): { id: string; source: string; hasKey: boolean }[] {
    return this.slots.map((s) => ({
      id: s.id,
      source: s.source,
      hasKey: Boolean(s.key),
    }));
  }

  /**
   * Executes a multimodal Gemini request with automatic dual-key failover and rate-limit control.
   */
  public async analyzeImage(
    imageBase64: string,
    mimeType: string,
    prompt: string
  ): Promise<{ text: string; metadata: DiagnosisMetadata }> {
    if (this.slots.length === 0) {
      throw new Error(
        "No Gemini API keys detected. Please provide GEMINI_API_KEY_1 and GEMINI_API_KEY_2 in your environment or enter them in the application settings."
      );
    }

    const startTime = Date.now();
    let primarySlotIndex = 0;

    // If we have 2 keys, use round-robin to balance baseline load across both keys
    if (this.slots.length >= 2) {
      primarySlotIndex = globalKeyIndex % this.slots.length;
      globalKeyIndex++;
    }

    const primarySlot = this.slots[primarySlotIndex];
    const secondarySlot = this.slots[(primarySlotIndex + 1) % this.slots.length];

    // Priority ordering: try primary slot first, then secondary if 429/503 occurs
    const candidates = this.slots.length >= 2 ? [primarySlot, secondarySlot] : [primarySlot];

    let lastError: Error | null = null;
    let failoverOccurred = false;
    let failoverReason = "";
    let winningSlot = primarySlot;
    let responseText = "";
    let modelUsed = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    for (let i = 0; i < candidates.length; i++) {
      const slot = candidates[i];

      // Check if slot is currently cooling down from a recent 429
      if (slot.lastRateLimitTime && Date.now() - slot.lastRateLimitTime < rateLimitCooldownMs) {
        if (candidates.length > 1 && i === 0) {
          failoverOccurred = true;
          failoverReason = `${slot.id} is in rate-limit cooldown. Automatically switched to standby key.`;
          continue; // skip to candidate 2
        }
      }

      try {
        const result = await this.executeGeminiRequest(
          slot.key,
          imageBase64,
          mimeType,
          prompt,
          modelUsed
        );
        responseText = result.text;
        modelUsed = result.model;
        slot.successCount++;
        winningSlot = slot;
        if (i > 0) {
          failoverOccurred = true;
        }
        break; // Successfully obtained response!
      } catch (err: any) {
        lastError = err;
        slot.failureCount++;

        const isRateLimit =
          err.status === 429 ||
          err.message?.includes("429") ||
          err.message?.includes("RESOURCE_EXHAUSTED") ||
          err.message?.includes("quota");

        if (isRateLimit) {
          slot.lastRateLimitTime = Date.now();
        }

        // If another candidate key is available, initiate immediate failover
        if (i < candidates.length - 1) {
          failoverOccurred = true;
          failoverReason = `Failover triggered: ${slot.id} encountered ${
            isRateLimit ? "Rate Limit (HTTP 429 / Quota Exhaustion)" : "connection error"
          }. Retrying with secondary key ${candidates[i + 1].id}...`;
          continue;
        }
      }
    }

    if (!responseText) {
      throw (
        lastError ||
        new Error(
          "All configured Gemini API keys failed to return a response due to rate limits or service unavailability."
        )
      );
    }

    const latencyMs = Date.now() - startTime;

    return {
      text: responseText,
      metadata: {
        keyUsed: winningSlot.id,
        failoverOccurred,
        failoverReason: failoverOccurred ? failoverReason : undefined,
        modelUsed,
        latencyMs,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Dispatches direct REST payload to Google Generative AI API with lightweight model fallback.
   */
  private async executeGeminiRequest(
    apiKey: string,
    imageBase64: string,
    mimeType: string,
    prompt: string,
    preferredModel: string
  ): Promise<{ text: string; model: string }> {
    const modelsToTry = [preferredModel, "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
    // Remove duplicates while preserving priority
    const uniqueModels = Array.from(new Set(modelsToTry));

    let lastHttpError: any = null;

    for (const model of uniqueModels) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for factual, authoritative pathology diagnostics
          topP: 0.95,
          maxOutputTokens: 3500,
        },
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorJson = await res.json().catch(() => null);
          const errorMsg =
            errorJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;

          const errObj: any = new Error(errorMsg);
          errObj.status = res.status;
          errObj.details = errorJson;

          // If it's a 429 rate limit, throw immediately so the outer key rotator can failover to Key 2
          if (res.status === 429) {
            throw errObj;
          }

          // If model not found (404), try the next fallback model in the list
          if (res.status === 404) {
            lastHttpError = errObj;
            continue;
          }

          throw errObj;
        }

        const data = await res.json();
        const candidate = data?.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;

        if (!text) {
          throw new Error("No diagnostic response text generated by the model.");
        }

        return { text, model };
      } catch (err: any) {
        if (err.status === 429) {
          throw err; // Propagate 429 immediately to trigger key failover
        }
        lastHttpError = err;
      }
    }

    throw lastHttpError || new Error("Failed to process specimen with available Gemini vision models.");
  }
}
