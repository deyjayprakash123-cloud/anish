export interface DiagnosisMetadata {
  keyUsed: "GEMINI_API_KEY_1" | "GEMINI_API_KEY_2" | "CLIENT_KEY_1" | "CLIENT_KEY_2";
  failoverOccurred: boolean;
  failoverReason?: string;
  modelUsed: string;
  latencyMs: number;
  timestamp: string;
}

export interface ParsedSection {
  id: number;
  title: string;
  icon: string;
  content: string;
  bullets: { label: string; value: string }[];
}

export interface DiagnosisResult {
  rawMarkdown: string;
  summary: {
    commonName: string;
    scientificName: string;
    healthStatus: "Healthy" | "Diseased" | "Pest-Infested" | "Nutrient-Deficient" | "Unknown";
    diseaseName: string;
    causalOrganism: string;
    severityRating: "Low" | "Moderate" | "Severe" | "Critical" | "None";
    infectionType: string;
  };
  sections: ParsedSection[];
  metadata: DiagnosisMetadata;
}

export interface ApiKeysConfig {
  key1: string;
  key2: string;
}
