import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

type WaitlistCreateResponse =
  | {
      ok: true;
      id: string;
      surveyToken: string;
      mode: "service_role" | "development_anon";
    }
  | {
      ok: false;
      error: string;
      details?: string;
    };

type WaitlistUpdateResponse =
  | {
      ok: true;
      mode: "service_role" | "development_anon";
    }
  | {
      ok: false;
      error: string;
      details?: string;
    };

type SupabaseMode = "service_role" | "development_anon";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const OPTIONAL_STRING_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "referrer",
  "landing_path",
  "placement",
] as const;

const rateLimits = new Map<string, { count: number; resetAt: number }>();

function jsonResponse(
  body: WaitlistCreateResponse | WaitlistUpdateResponse,
  status: number,
): Response {
  return Response.json(body, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const email = value.trim().toLowerCase();

  if (
    email.length < 3 ||
    email.length > 254 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return null;
  }

  return email;
}

function readOptionalString(
  body: Record<string, unknown>,
  key: (typeof OPTIONAL_STRING_FIELDS)[number],
): string | undefined | null {
  const value = body[key];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 500) : undefined;
}

function readOptionalStringArray(
  body: Record<string, unknown>,
  key: string,
): string[] | null {
  const value = body[key];

  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, 120))
    .filter(Boolean);

  if (items.length !== value.length || items.length > 20) {
    return null;
  }

  return items;
}

function getBoolean(body: Record<string, unknown>, key: string): boolean {
  return body[key] === true;
}

function createSurveyToken(): string {
  return randomBytes(32).toString("base64url");
}

function hashSurveyToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const firstForwarded = forwarded?.split(",")[0]?.trim();

  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    firstForwarded ||
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 20;
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  return current.count > maxRequests;
}

function getSupabaseConfig():
  | { url: string; key: string; mode: SupabaseMode }
  | { error: string; details?: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url) {
    return { error: "Supabase URL is not configured." };
  }

  if (serviceRoleKey) {
    return { url, key: serviceRoleKey, mode: "service_role" };
  }

  if (process.env.NODE_ENV !== "production" && anonKey) {
    return { url, key: anonKey, mode: "development_anon" };
  }

  return {
    error: "Supabase service role key is not configured.",
    details:
      "Set SUPABASE_SERVICE_ROLE_KEY in production so waitlist writes go through the server.",
  };
}

function createSupabaseClient() {
  const config = getSupabaseConfig();

  if ("error" in config) {
    return config;
  }

  return {
    mode: config.mode,
    client: createClient(config.url, config.key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }),
  };
}

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  const clientIp = getClientIp(request);

  if (isRateLimited(`create:${clientIp}`)) {
    return jsonResponse(
      { ok: false, error: "Too many waitlist requests. Try again later." },
      429,
    );
  }

  const body = await readJson(request);

  if (!isRecord(body)) {
    return jsonResponse({ ok: false, error: "Invalid JSON payload." }, 400);
  }

  const email = normalizeEmail(body.email);
  const privacyConsent = getBoolean(body, "privacyConsent");
  const marketingConsent = getBoolean(body, "marketingConsent");

  if (!email) {
    return jsonResponse({ ok: false, error: "Invalid email address." }, 400);
  }

  if (!privacyConsent) {
    return jsonResponse(
      { ok: false, error: "Privacy consent is required." },
      400,
    );
  }

  const optionalFields: Record<string, string | undefined> = {};

  for (const key of OPTIONAL_STRING_FIELDS) {
    const value = readOptionalString(body, key);

    if (value === null) {
      return jsonResponse(
        { ok: false, error: `Invalid optional field: ${key}.` },
        400,
      );
    }

    optionalFields[key] = value;
  }

  const supabase = createSupabaseClient();

  if ("error" in supabase) {
    return jsonResponse(
      { ok: false, error: supabase.error, details: supabase.details },
      500,
    );
  }

  const surveyToken = createSurveyToken();
  const now = new Date().toISOString();

  const { data, error } = await supabase.client
    .from("waitlist")
    .insert({
      email,
      survey_token_hash: hashSurveyToken(surveyToken),
      privacy_consent: privacyConsent,
      marketing_consent: marketingConsent,
      consent_version: "2026-05-12",
      consented_at: now,
      user_agent: request.headers.get("user-agent")?.slice(0, 500),
      utm_source: optionalFields.utm_source,
      utm_medium: optionalFields.utm_medium,
      utm_campaign: optionalFields.utm_campaign,
      utm_content: optionalFields.utm_content,
      utm_term: optionalFields.utm_term,
      fbclid: optionalFields.fbclid,
      referrer: optionalFields.referrer,
      landing_path: optionalFields.landing_path,
      placement: optionalFields.placement,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return jsonResponse(
        { ok: false, error: "This email is already registered." },
        409,
      );
    }

    console.error("[waitlist] Supabase insert failed:", error);
    return jsonResponse(
      {
        ok: false,
        error: "Waitlist submission failed.",
        details: error.message,
      },
      500,
    );
  }

  return jsonResponse(
    { ok: true, id: data.id, surveyToken, mode: supabase.mode },
    200,
  );
}

export async function PATCH(request: Request): Promise<Response> {
  const clientIp = getClientIp(request);

  if (isRateLimited(`survey:${clientIp}`)) {
    return jsonResponse(
      { ok: false, error: "Too many survey requests. Try again later." },
      429,
    );
  }

  const body = await readJson(request);

  if (!isRecord(body)) {
    return jsonResponse({ ok: false, error: "Invalid JSON payload." }, 400);
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const surveyToken =
    typeof body.surveyToken === "string" ? body.surveyToken.trim() : "";
  const assets =
    typeof body.assets === "string" ? body.assets.trim().slice(0, 500) : "";
  const agents = readOptionalStringArray(body, "agents");
  const tradingStyles = readOptionalStringArray(body, "tradingStyles");
  const infoGap =
    typeof body.infoGap === "string" ? body.infoGap.trim().slice(0, 20) : "";

  if (!UUID_PATTERN.test(id) || surveyToken.length < 20) {
    return jsonResponse({ ok: false, error: "Invalid survey session." }, 400);
  }

  if (!agents || !tradingStyles) {
    return jsonResponse({ ok: false, error: "Invalid survey payload." }, 400);
  }

  const supabase = createSupabaseClient();

  if ("error" in supabase) {
    return jsonResponse(
      { ok: false, error: supabase.error, details: supabase.details },
      500,
    );
  }

  const { data, error } = await supabase.client
    .from("waitlist")
    .update({
      survey_completed: true,
      assets,
      agents,
      trading_styles: tradingStyles,
      info_gap: infoGap,
      survey_token_hash: null,
    })
    .eq("id", id)
    .eq("survey_token_hash", hashSurveyToken(surveyToken))
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[waitlist] Supabase survey update failed:", error);
    return jsonResponse(
      {
        ok: false,
        error: "Survey submission failed.",
        details: error.message,
      },
      500,
    );
  }

  if (!data) {
    return jsonResponse(
      { ok: false, error: "Survey session was not found or already used." },
      404,
    );
  }

  return jsonResponse({ ok: true, mode: supabase.mode }, 200);
}
