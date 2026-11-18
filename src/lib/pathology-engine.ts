import { ParsedSection, DiagnosisResult, DiagnosisMetadata } from "@/types/diagnosis";

export const PLANT_PATHOLOGY_PROMPT = `
You are an elite agricultural scientist, botanist, and expert plant pathologist with decades of field research experience. Analyze the provided leaf specimen image meticulously and return an exhaustive, professional diagnostic report structured using these exact 8 numbered headings and markdown sub-bullets:

1. 🌿 Plant Identification:
   - Common Name: [State the common crop or plant name]
   - Botanical / Species Name: [Scientific binomial name with authority, and plant family]

2. 🩺 Health Status:
   - Status: [Strictly choose one: Healthy, Diseased, Pest-Infested, or Nutrient-Deficient]
   - Infection Type: [e.g., Fungal foliar infection, bacterial spot, viral vector, macronutrient deficiency, or None if healthy]

3. 🦠 Disease / Problem Name:
   - Specific Disease / Condition: [Exact scientific name of the disease, disorder, or 'None - Healthy Foliage']
   - Causal Organism (Pathogen / Pest / Deficiency): [Scientific binomial name of fungus, bacterium, virus, nematode, insect pest, or specific nutrient, with full taxonomic classification]

4. 🔍 Visible Symptoms:
   - Primary Morphological Lesions & Patterns: [Detailed description of lesion shapes, concentric rings, target-board patterns, margins, pustules, or leaf texture]
   - Perilesional Discoloration & Cellular Breakdown: [Detailed description of chlorotic halos, veinal chlorosis, water-soaking, or phytotoxin necrosis]
   - Disease Progression & Canopy Pattern: [Spatial distribution, basipetal or acropetal spread, premature abscission, defoliation risk, and impact on yield]

5. 🛡️ Root Cause & Severity:
   - Favorable Environmental Conditions & Mechanism: [Specific temperature ranges in °C and °F, relative humidity thresholds, leaf wetness duration in hours, soil moisture, and overwintering inocula sources]
   - Severity Rating: [Strictly choose one: Low, Moderate, Severe, or Critical, accompanied by estimated canopy surface area percentage affected and secondary spread velocity]

6. 🌱 Organic & Biological Cure:
   - Immediate Surgical Pruning & Sanitation: [Step-by-step instructions: prune infected leaves 2 inches below lesion with shears sterilized in 70% alcohol, bag and destroy debris immediately, do not compost]
   - Biological Control Agents: [Specific beneficial curative microbes like Bacillus subtilis, Trichoderma harzianum, or Streptomyces lydicus, detailing application rate and foliar spray mode of action]
   - Eco-Friendly Botanical Sprays & Recipes: [Exact homemade organic cure recipe with dilution ratios, e.g., cold-pressed neem oil (5ml/L + 2ml liquid soap) or potassium bicarbonate/baking soda (3g/L + horticultural oil), sprayed every 7 days]
   - Physical Barriers & Soil Management: [Mulching thickness, splash barriers, and soil aeration to stop spore transmission from ground to foliage]

7. 🧪 Chemical Treatment (If needed):
   - Protectant / Contact Fungicides: [Exact surface-active chemicals to kill active spores: e.g., Copper Hydroxide (2.5g/L), Mancozeb (2g/L), or Chlorothalonil with full canopy coverage guidelines]
   - Systemic Curative Treatments: [Targeted single-site systemic curative fungicides that eradicate internal infection, stating chemical class & FRAC code, e.g., Azoxystrobin (FRAC 11) or Difenoconazole (FRAC 3)]
   - Application Guidelines & Safety: [Spray intervals (every 7-14 days), alternating FRAC groups to prevent resistance, Pre-Harvest Intervals (PHI in days), and protective equipment]

8. 🚫 Prevention & Care Tips:
   - Irrigation Best Practices: [Drip vs. overhead comparisons, microclimate evaporation timing, and leaf wetness suppression]
   - Canopy Management: [Optimal row and plant spacing, trellising techniques, sucker removal, and bottom-pruning for airflow]
   - Crop Rotation & End-of-Season Sanitation: [Multi-year rotation timeline, non-host cover crop families to plant, and post-harvest destruction protocols]

Maintain an authoritative, highly scientific tone suitable for a top-tier science fair presentation or university extension diagnostic service. Provide direct, dense, actionable bullet points under every section without conversational fluff or introductory text.

Strict Brevity & Fast Execution Mandate:
- Provide exactly 1 to 2 dense, high-impact, scientifically precise sentences for each sub-bullet.
- Do NOT output any introductory greetings, markdown preamble, conversational filler, or sign-offs.
- Output MUST start immediately with "1. 🌿 Plant Identification:".
`;

export function parseDiagnosticMarkdown(
  rawMarkdown: string,
  metadata: DiagnosisMetadata
): DiagnosisResult {
  // Extract summary fields using resilient regex
  const commonNameMatch = rawMarkdown.match(/Common Name:\s*([^\n\r]+)/i);
  const botanicalNameMatch = rawMarkdown.match(/Botanical \/ Species Name:\s*([^\n\r]+)/i);
  const statusMatch = rawMarkdown.match(/Status:\s*([^\n\r]+)/i);
  const diseaseMatch = rawMarkdown.match(/Specific Disease \/ Condition:\s*([^\n\r]+)/i);
  const organismMatch = rawMarkdown.match(/Causal Organism[^\n\r:]*:\s*([^\n\r]+)/i);
  const severityMatch = rawMarkdown.match(/Severity Rating:\s*([^\n\r]+)/i);
  const infectionTypeMatch = rawMarkdown.match(/Infection Type:\s*([^\n\r]+)/i);

  const clean = (val?: string) =>
    val?.replace(/^\[|\]$/g, "").replace(/\*+/g, "").trim() || "Not specified";

  let healthStatus: DiagnosisResult["summary"]["healthStatus"] = "Unknown";
  const rawStatus = clean(statusMatch?.[1]).toLowerCase();
  if (rawStatus.includes("healthy")) healthStatus = "Healthy";
  else if (rawStatus.includes("pest")) healthStatus = "Pest-Infested";
  else if (rawStatus.includes("nutrient") || rawStatus.includes("deficien"))
    healthStatus = "Nutrient-Deficient";
  else if (rawStatus.includes("disease") || rawStatus.includes("fungal") || rawStatus.includes("bacterial") || rawStatus.includes("viral"))
    healthStatus = "Diseased";

  let severityRating: DiagnosisResult["summary"]["severityRating"] = "None";
  const rawSev = clean(severityMatch?.[1]).toLowerCase();
  if (rawSev.includes("critical")) severityRating = "Critical";
  else if (rawSev.includes("severe")) severityRating = "Severe";
  else if (rawSev.includes("moderate")) severityRating = "Moderate";
  else if (rawSev.includes("low")) severityRating = "Low";

  // Section splitting
  const sectionHeaders = [
    { id: 1, title: "Plant Identification", icon: "🌿", regex: /1\.\s*🌿?\s*Plant Identification:?([\s\S]*?)(?=2\.\s*🩺|\Z)/i },
    { id: 2, title: "Health Status", icon: "🩺", regex: /2\.\s*🩺?\s*Health Status:?([\s\S]*?)(?=3\.\s*🦠|\Z)/i },
    { id: 3, title: "Disease / Problem Name", icon: "🦠", regex: /3\.\s*🦠?\s*Disease \/ Problem Name:?([\s\S]*?)(?=4\.\s*🔍|\Z)/i },
    { id: 4, title: "Visible Symptoms", icon: "🔍", regex: /4\.\s*🔍?\s*Visible Symptoms:?([\s\S]*?)(?=5\.\s*🛡️|\Z)/i },
    { id: 5, title: "Root Cause & Severity", icon: "🛡️", regex: /5\.\s*🛡️?\s*Root Cause & Severity:?([\s\S]*?)(?=6\.\s*🌱|\Z)/i },
    { id: 6, title: "Organic & Biological Cure", icon: "🌱", regex: /6\.\s*🌱?\s*Organic & Biological Cure:?([\s\S]*?)(?=7\.\s*🧪|\Z)/i },
    { id: 7, title: "Chemical Treatment (If needed)", icon: "🧪", regex: /7\.\s*🧪?\s*Chemical Treatment[^\n:]*:?([\s\S]*?)(?=8\.\s*🚫|\Z)/i },
    { id: 8, title: "Prevention & Care Tips", icon: "🚫", regex: /8\.\s*🚫?\s*Prevention & Care Tips:?([\s\S]*?)$/i },
  ];

  const sections: ParsedSection[] = sectionHeaders.map((sec) => {
    const match = rawMarkdown.match(sec.regex);
    const content = match ? match[1].trim() : "";

    // Parse sub-bullets: "- Label: Value"
    const bullets: { label: string; value: string }[] = [];
    const bulletLines = content.split(/\n(?=\s*-\s*)/);

    for (const b of bulletLines) {
      const bMatch = b.match(/^\s*-\s*\*?\*?([^:\*\n]+)\*?\*?:\s*([\s\S]*)$/);
      if (bMatch) {
        bullets.push({
          label: bMatch[1].trim(),
          value: bMatch[2].trim(),
        });
      }
    }

    return {
      id: sec.id,
      title: sec.title,
      icon: sec.icon,
      content,
      bullets,
    };
  });

  return {
    rawMarkdown,
    summary: {
      commonName: clean(commonNameMatch?.[1]),
      scientificName: clean(botanicalNameMatch?.[1]),
      healthStatus,
      diseaseName: clean(diseaseMatch?.[1]),
      causalOrganism: clean(organismMatch?.[1]),
      severityRating,
      infectionType: clean(infectionTypeMatch?.[1]),
    },
    sections,
    metadata,
  };
}
