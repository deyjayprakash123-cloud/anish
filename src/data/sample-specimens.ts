export interface SampleSpecimen {
  id: string;
  name: string;
  plant: string;
  condition: string;
  description: string;
  // High quality SVG data URL representing the botanical specimen for instant testing
  previewSvg: string;
}

export const SAMPLE_SPECIMENS: SampleSpecimen[] = [
  {
    id: "tomato-early-blight",
    name: "Tomato Early Blight",
    plant: "Tomato (Solanum lycopersicum)",
    condition: "Alternaria solani infection",
    description: "Features classic target-board concentric necrotic rings and chlorotic halos on lower foliage.",
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <radialGradient id="leafGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%234ade80"/>
          <stop offset="100%" stop-color="%23166534"/>
        </radialGradient>
        <radialGradient id="blightHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%233e2723"/>
          <stop offset="35%" stop-color="%235d4037"/>
          <stop offset="60%" stop-color="%238d6e63"/>
          <stop offset="85%" stop-color="%23fde047"/>
          <stop offset="100%" stop-color="%234ade80" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="%230f172a"/>
      <!-- Tomato Leaf Silhouette -->
      <path d="M 200 40 C 260 90, 310 160, 270 260 C 240 330, 205 360, 200 370 C 195 360, 160 330, 130 260 C 90 160, 140 90, 200 40 Z" fill="url(%23leafGrad)" stroke="%2322c55e" stroke-width="2"/>
      <!-- Main and Secondary Veins -->
      <path d="M 200 60 L 200 360" stroke="%2386efac" stroke-width="3" opacity="0.7"/>
      <path d="M 200 120 Q 230 110, 260 130 M 200 120 Q 170 110, 140 130" stroke="%2386efac" stroke-width="2" opacity="0.6"/>
      <path d="M 200 180 Q 240 170, 270 200 M 200 180 Q 160 170, 130 200" stroke="%2386efac" stroke-width="2" opacity="0.6"/>
      <path d="M 200 240 Q 230 230, 255 260 M 200 240 Q 170 230, 145 260" stroke="%2386efac" stroke-width="2" opacity="0.6"/>
      <!-- Alternaria Solani Target Board Lesions -->
      <circle cx="170" cy="190" r="45" fill="url(%23blightHalo)"/>
      <circle cx="170" cy="190" r="30" fill="none" stroke="%23271406" stroke-width="2" opacity="0.8"/>
      <circle cx="170" cy="190" r="20" fill="none" stroke="%231a0c04" stroke-width="2" opacity="0.9"/>
      <circle cx="170" cy="190" r="10" fill="none" stroke="%230f0702" stroke-width="2"/>
      <circle cx="230" cy="270" r="35" fill="url(%23blightHalo)"/>
      <circle cx="230" cy="270" r="22" fill="none" stroke="%23271406" stroke-width="1.8" opacity="0.8"/>
      <circle cx="230" cy="270" r="12" fill="none" stroke="%230f0702" stroke-width="1.8"/>
      <!-- Chlorotic margin fringe -->
      <path d="M 130 260 Q 120 300, 160 330" stroke="%23facc15" stroke-width="8" stroke-linecap="round" opacity="0.7"/>
    </svg>`,
  },
  {
    id: "potato-late-blight",
    name: "Potato Late Blight",
    plant: "Potato (Solanum tuberosum)",
    condition: "Phytophthora infestans oomycete infection",
    description: "Irregular water-soaked dark brown foliar lesions with pale greenish borders.",
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <radialGradient id="pLeafGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%2322c55e"/>
          <stop offset="100%" stop-color="%2314532d"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="%230f172a"/>
      <!-- Potato Leaf -->
      <ellipse cx="200" cy="200" rx="90" ry="140" fill="url(%23pLeafGrad)" stroke="%2315803d" stroke-width="2"/>
      <path d="M 200 70 L 200 330" stroke="%2386efac" stroke-width="3" opacity="0.6"/>
      <!-- Late Blight Water-Soaked Lesions -->
      <path d="M 140 130 Q 180 120, 190 160 Q 170 210, 130 190 Q 110 160, 140 130 Z" fill="%2329170e" stroke="%23a1a1aa" stroke-width="2" opacity="0.9"/>
      <path d="M 210 210 Q 270 200, 260 250 Q 230 290, 190 270 Q 180 230, 210 210 Z" fill="%231c0d06" stroke="%23e4e4e7" stroke-width="1.5" opacity="0.85"/>
    </svg>`,
  },
  {
    id: "healthy-tomato",
    name: "Healthy Tomato Foliage",
    plant: "Tomato (Solanum lycopersicum)",
    condition: "Optimal Physiological State (Control Specimen)",
    description: "Vibrant emerald lamina with intact cuticle, prominent turgor pressure, and zero necrosis.",
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <radialGradient id="hGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="%2386efac"/>
          <stop offset="60%" stop-color="%2322c55e"/>
          <stop offset="100%" stop-color="%2315803d"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="%230f172a"/>
      <path d="M 200 50 C 270 100, 310 180, 270 270 C 230 330, 205 360, 200 370 C 195 360, 170 330, 130 270 C 90 180, 130 100, 200 50 Z" fill="url(%23hGrad)" stroke="%234ade80" stroke-width="3"/>
      <path d="M 200 60 L 200 360" stroke="%23bbf7d0" stroke-width="3" opacity="0.8"/>
      <path d="M 200 130 Q 230 120, 265 140 M 200 130 Q 170 120, 135 140" stroke="%23bbf7d0" stroke-width="2" opacity="0.7"/>
      <path d="M 200 200 Q 240 190, 275 220 M 200 200 Q 160 190, 125 220" stroke="%23bbf7d0" stroke-width="2" opacity="0.7"/>
    </svg>`,
  },
];
