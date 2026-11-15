export interface DiagnosisMetadata {
  datasetCorpus: string;
  confidenceMatch: string;
  neuralModel: string;
  latencyMs: number;
  timestamp: string;
  verificationStatus: string;
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
