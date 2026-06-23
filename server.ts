import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const IS_PROD = process.env.NODE_ENV === "production";
const ALLOWED_ORIGIN = process.env.APP_URL || "";

// ─── Body size limit (prevent large payload attacks) ──────────────────────────
app.use(express.json({ limit: "16kb" }));

// ─── Security headers (applied to every response) ─────────────────────────────
app.use((_req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  // Block MIME-type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // XSS filter (legacy browsers)
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Permissions policy (disable sensitive browser APIs not needed)
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  // HSTS (only in production — forces HTTPS for 1 year)
  if (IS_PROD) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // Vite HMR websocket + fonts in dev; restrict tighter in prod
      IS_PROD
        ? "script-src 'self'"
        : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      IS_PROD
        ? "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
        : "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://generativelanguage.googleapis.com wss: ws:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
  next();
});

// ─── CORS — only allow the configured app origin (or same-origin in dev) ───────
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (!IS_PROD) {
    // In dev, allow all origins (Vite proxies everything)
    if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// ─── Rate limiting ─────────────────────────────────────────────────────────────
// General API: 120 req / 15 min per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

// AI formulate endpoint: 10 req / 15 min per IP (expensive Gemini call)
const formulateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "AI formulation limit reached. Please wait before generating again." },
});

app.use("/api", apiLimiter);

// ─── Lazy-loaded Gemini client ─────────────────────────────────────────────────
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: { "User-Agent": "altitude-beverages/1.0" },
      },
    });
  }
  return aiClient;
}

// ─── Input sanitization helper ─────────────────────────────────────────────────
function sanitizeInput(value: unknown, maxLen = 120): string {
  if (typeof value !== "string") return "";
  // Strip control characters and limit length
  return value.replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLen).trim();
}

function sanitizeArray(arr: unknown, maxItems = 8, maxLen = 60): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .slice(0, maxItems)
    .map((item) => sanitizeInput(item, maxLen))
    .filter(Boolean);
}

// ─── Static catalog ───────────────────────────────────────────────────────────
const CATALOG = [
  {
    id: "margarita",
    name: "PRICKLY PEAR MARGARITA",
    flavorGroup: "Citrus | Crisp | Invigorating",
    tagline: "An Invigorated Classic Prickly Pear Margarita",
    price: 15.0,
    volume: "12 FL OZ (355 ML)",
    description:
      "A sharp, botanical twist on the coastal standard. Made with fresh-pressed red prickly pear cactus fruit, real Key lime pulp, and organic agave nectar, supercharged with our foundational adaptogen stack.",
    activeIngredients: ["L-Theanine (200mg)", "Lion's Mane (150mg)", "Magnesium (100mg)"],
    sensoryNotes: "Bright, tart lime skin, wild watermelon flesh, subtle earthy desert cactus bloom.",
    colorAccent: "#38bdf8",
  },
  {
    id: "rosemary",
    name: "ROSEMARY SPRITZ",
    flavorGroup: "Herbal | Bittersweet | Refreshing",
    tagline: "Low-Key Sophisticated Rosemary Spritz",
    price: 15.0,
    volume: "12 FL OZ (355 ML)",
    description:
      "A contemplative forest-to-glass botanical draft. Blending carbonated spring water, fresh rosemary needles oil distillations, gentian root bitters, and a touch of wild mountain honey.",
    activeIngredients: ["L-Theanine (200mg)", "Lion's Mane (150mg)", "Magnesium (100mg)"],
    sensoryNotes: "Pine resin, crisp pine needles, wet clay, bittersweet orange peel.",
    colorAccent: "#fb923c",
  },
  {
    id: "lilikoi",
    name: "LILI'KOI MAI TAI",
    flavorGroup: "Bold | Lush | Smooth",
    tagline: "Just Bold Enough Lili'Koi Mai Tai",
    price: 15.0,
    volume: "12 FL OZ (355 ML)",
    description:
      "An exotic, sunset-drenched tropical escape. Formulated with authentic Hawaiian yellow passion fruit (lili'koi), sweet almond orgeat syrup, and a squeeze of dark lime to anchor notes.",
    activeIngredients: ["L-Theanine (200mg)", "Lion's Mane (150mg)", "Magnesium (100mg)"],
    sensoryNotes: "Tart passionfruit punch, roasted marzipan, caramelized sugar cane.",
    colorAccent: "#e11d48",
  },
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check (for deployment platform liveness probes)
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", version: "1.0.0" });
});

// Catalog
app.get("/api/catalog", (_req: Request, res: Response) => {
  res.json({ beverages: CATALOG });
});

// AI Formulate — rate-limited separately
app.post("/api/formulate", formulateLimiter, async (req: Request, res: Response) => {
  try {
    // Sanitize every user-supplied field before injecting into the prompt
    const base = sanitizeInput(req.body?.base, 80) || "Sparkling Glacier Water";
    const botanicals = sanitizeArray(req.body?.botanicals);
    const adaptogens = sanitizeArray(req.body?.adaptogens);
    const intensity = sanitizeInput(req.body?.intensity, 40) || "Ethereal";
    const vibe = sanitizeInput(req.body?.vibe, 100) || "Silent Meditation";

    const prompt = `You are a world-class luxury non-alcoholic molecular mixologist for the avant-garde brand "Altitude Beverages". 
We need to formulate a custom botanical elixir based on:
- Liquid Base: ${base}
- Botanicals: ${botanicals.length ? botanicals.join(", ") : "None"}
- Functional Adaptogens: ${adaptogens.length ? adaptogens.join(", ") : "None"}
- General Vibe / Mood Profile: ${vibe}
- Carbonation Intensity level: ${intensity}

Formulate a sophisticated drink and return a JSON response with the following strictly typed schema:
1. "name": An oversized, beautiful, conceptual title (e.g. "Amber Canopy", "Dusk Horizon", "Pluto's Garden").
2. "tagline": A light, evocative serif pull-quote tagline (1 sentence).
3. "sensoryDescription": A elegant, sensory description written in a minimalist editorial fashion magazine pullquote style. Highlighting mouthfeel, nose, and top/mid/bottom flavor notes.
4. "adaptationReport": A functional description summarizing what the adaptogen doses do for the brain, nervous system, and overall relaxation.
5. "compositionMetrics": { "earthiness": 1-5, "citrus": 1-5, "herbal": 1-5, "sweetness": 1-5 } values.
6. "foodPairing": A short sentence suggesting what high-end minimalist dish this custom blend is meant to accompany.

Keep descriptions sophisticated, high-fashion, and pristine (avoid generic marketing fluff, avoid emojis, stay incredibly chic).`;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            tagline: { type: Type.STRING },
            sensoryDescription: { type: Type.STRING },
            adaptationReport: { type: Type.STRING },
            compositionMetrics: {
              type: Type.OBJECT,
              properties: {
                earthiness: { type: Type.INTEGER },
                citrus: { type: Type.INTEGER },
                herbal: { type: Type.INTEGER },
                sweetness: { type: Type.INTEGER },
              },
            },
            foodPairing: { type: Type.STRING },
          },
          required: [
            "name",
            "tagline",
            "sensoryDescription",
            "adaptationReport",
            "compositionMetrics",
            "foodPairing",
          ],
        },
      },
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);

  } catch (error: unknown) {
    // Never leak internal error details to the client
    const isAuthError =
      error instanceof Error && error.message?.toLowerCase().includes("key");

    console.error("[/api/formulate] Error:", error instanceof Error ? error.message : error);

    // Return a graceful fallback so the UI never breaks
    res.status(isAuthError ? 401 : 500).json({
      error: isAuthError
        ? "API authentication failed."
        : "Formulation service temporarily unavailable.",
      // Fallback content so the UI still renders something elegant
      name: "Silent Forest Draft",
      tagline: "An evocative quietude of pine mist and cold stones.",
      sensoryDescription:
        "Grounding damp clay and wild hand-torn rosemary oils give way to a crisp Key lime finish. On the nose, a soft wash of forest moss and cold rainfall.",
      adaptationReport:
        "Supercharged with L-Theanine and Lion's Mane to trigger high-frequency alpha brain wave states, creating deep cognitive clarity and structured relief from ambient visual noise.",
      compositionMetrics: { earthiness: 4, citrus: 3, herbal: 5, sweetness: 1 },
      foodPairing: "Accompanies clean matsutake mushroom broths and dark sea-kelp crisps.",
    });
  }
});

// ─── 404 catch-all for unknown API routes ─────────────────────────────────────
app.use("/api/*", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found." });
});

// ─── Static serving / Vite dev middleware ─────────────────────────────────────
async function bootstrapServer() {
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    // Cache static assets aggressively (hashed filenames from Vite build)
    app.use(
      "/assets",
      express.static(path.join(distPath, "assets"), {
        maxAge: "1y",
        immutable: true,
      })
    );

    // Serve other static files with shorter cache
    app.use(express.static(distPath, { maxAge: "1h" }));

    // SPA fallback — all unmatched routes serve index.html
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Altitude Beverages] Server ready on http://localhost:${PORT} (${IS_PROD ? "production" : "development"})`);
  });

  // ─── Graceful shutdown ───────────────────────────────────────────────────────
  const shutdown = (signal: string) => {
    console.log(`[${signal}] Shutting down gracefully...`);
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
    // Force exit if connections don't drain within 10s
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrapServer();
