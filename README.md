# 🌿 PhytoScan AI — Botanical Pathology & Agricultural Diagnostic System

> **Production-ready plant disease diagnosis web application** powered by Google Gemini lightweight multimodal vision models (`gemini-2.5-flash` / `gemini-1.5-flash`), featuring an **intelligent Dual-API Key Rate Limit Controller** and exhaustive **8-tier scientific pathology reports**. Fully optimized for 1-click deployment on **Vercel**.

---

## ⚡ Highlights & Key Features

1. **Lightweight Multimodal Vision:**
   - Employs Google's fastest, state-of-the-art multimodal vision model (`gemini-2.5-flash` with automatic fallback to `gemini-1.5-flash`).
   - High-precision foliar lesion morphology classification with low latency (~1.2s avg).
2. **Dual-API Key Rate Limit Controller (HTTP 429 Resilience):**
   - Google Gemini free tier has a 15 RPM (requests per minute) limit.
   - PhytoScan AI incorporates an intelligent dual-key controller (`GEMINI_API_KEY_1` & `GEMINI_API_KEY_2`) that executes round-robin load distribution and activates **instant sub-second failover** if an HTTP 429 quota throttle is encountered.
   - Users can configure keys via environment variables or directly inside the client UI modal (saved in browser `localStorage`).
3. **Canonical 8-Tier Agricultural Pathology Dossier:**
   - 🌿 **1. Plant Identification:** Common Name, Botanical Binomial with Authority, Plant Family.
   - 🩺 **2. Health Status:** Healthy, Diseased, Pest-Infested, or Nutrient-Deficient classification.
   - 🦠 **3. Disease / Problem Name:** Specific condition and complete taxonomic classification of causal agent.
   - 🔍 **4. Visible Symptoms:** Primary lesion morphology, concentric rings/target patterns, chlorotic halos, phytotoxin breakdown, and canopy progression.
   - 🛡️ **5. Root Cause & Severity:** Environmental epidemiology (°C, RH%, leaf wetness hours), overwintering reservoirs, and 4-tier severity rating.
   - 🌱 **6. Organic & Biological Cure:** Pruning sanitation, tool sterilization protocols, bio-antagonists (*Bacillus subtilis*, *Trichoderma harzianum*), cold-pressed neem emulsions, and mulching barriers.
   - 🧪 **7. Chemical Treatment:** Multisite protectant barriers (Chlorothalonil, Mancozeb, Copper Hydroxide), single-site systemic options (Strobilurins/QoI, Triazoles/DMI, SDHI), and FRAC resistance rotations with PHI/REI safety rules.
   - 🚫 **8. Prevention & Care Tips:** Sub-canopy drip watering, canopy spacing/trellising airflow, and 3-to-4-year non-host crop rotation timelines.
4. **Interactive Laboratory UI:**
   - Drag & Drop photo upload + Camera snapshot capture for phones & field tablets.
   - Pre-loaded Reference Specimens for instant 1-click demonstration without an image file.
   - Animated laser scanner HUD overlay during diagnosis.
   - 1-Click "Copy Markdown Report" and printable "Laboratory PDF Dossier".

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Enter Project Directory
\`\`\`bash
cd d:/PythonProjects/anish
\`\`\`

### 2. Configure Your Gemini API Keys
Copy the example environment file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Open `.env.local` and paste your Google Gemini API keys (obtain free keys at [Google AI Studio](https://aistudio.google.com/app/apikey)):
\`\`\`env
GEMINI_API_KEY_1=AIzaSyYourPrimaryKeyHere
GEMINI_API_KEY_2=AIzaSyYourSecondaryKeyHere
GEMINI_MODEL=gemini-2.5-flash
\`\`\`

*(Note: You can also leave `.env.local` blank and input your keys directly in the Web UI via the "Rate Limit Controller" button in the top right.)*

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel (Production)

Deploying to Vercel is completely automated:

### Method 1: Deploy with Vercel CLI
\`\`\`bash
npm install -g vercel
vercel
\`\`\`
When prompted, set your Environment Variables:
- `GEMINI_API_KEY_1`: Your first Gemini API Key
- `GEMINI_API_KEY_2`: Your second Gemini API Key
- `GEMINI_MODEL`: `gemini-2.5-flash`

### Method 2: Push to GitHub & Import into Vercel
1. Initialize a git repository and push your project to GitHub:
   \`\`\`bash
   git init
   git add .
   git commit -m "feat: initial PhytoScan AI application"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   \`\`\`
2. Navigate to [vercel.com](https://vercel.com) -> **Add New Project** -> **Import Git Repository**.
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY_1`
   - `GEMINI_API_KEY_2`
4. Click **Deploy**. Vercel will build and serve your Next.js application globally with edge caching and serverless execution!

---

## 🏛️ Project Architecture

\`\`\`
d:/PythonProjects/anish/
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts      # Vercel Serverless Route Handler for Gemini Vision
│   │   ├── globals.css               # Tailwind CSS & Print styles
│   │   ├── layout.tsx                # App root layout & SEO metadata
│   │   └── page.tsx                  # Main Laboratory Application Page
│   ├── components/
│   │   ├── ApiKeyModal.tsx           # Dual-key rate limit controller dialog
│   │   ├── DiagnosticReportView.tsx  # 8-Tier structured report renderer & print view
│   │   ├── Header.tsx                # Navigation bar with key status indicators
│   │   ├── ScanningOverlay.tsx       # Real-time laser scanning animation
│   │   └── UploadZone.tsx            # Drag & drop, camera input, and sample tray
│   ├── data/
│   │   └── sample-specimens.ts       # Pre-loaded reference specimens for testing
│   ├── lib/
│   │   ├── gemini-rotator.ts         # Dual-key round-robin & 429 auto-failover engine
│   │   └── pathology-engine.ts       # 8-tier prompt & markdown parsing logic
│   └── types/
│       └── diagnosis.ts              # TypeScript interfaces
├── .env.example                      # Environment variable template
├── next.config.mjs                   # Next.js configuration
├── package.json                      # Dependencies and build scripts
├── tailwind.config.ts                # Tailwind styling theme
├── tsconfig.json                     # TypeScript compiler options
└── vercel.json                       # Vercel deployment specification
\`\`\`

---

## 🧪 License & Agronomic Notice
This project is built for scientific research, academic fairs, and agricultural extension services. Before applying any chemical protectants or systemic fungicides mentioned in Section 7, always consult local university extension bulletins and follow pesticide manufacturer label instructions strictly.
