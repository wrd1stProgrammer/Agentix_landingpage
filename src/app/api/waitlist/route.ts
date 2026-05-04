type WaitlistPayload = {
  email: string;
  asset?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
};

type WaitlistResponse =
  | {
      ok: true;
      mode: "webhook" | "development";
    }
  | {
      ok: false;
      error: string;
      details?: string;
    };

const OPTIONAL_FIELDS = [
  "asset",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "referrer",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body: WaitlistResponse, status: number): Response {
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
  key: (typeof OPTIONAL_FIELDS)[number],
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

function parseWaitlistPayload(body: unknown): WaitlistPayload | null {
  if (!isRecord(body)) {
    return null;
  }

  const email = normalizeEmail(body.email);

  if (!email) {
    return null;
  }

  const payload: WaitlistPayload = { email };

  for (const key of OPTIONAL_FIELDS) {
    const value = readOptionalString(body, key);

    if (value === null) {
      return null;
    }

    if (value !== undefined) {
      payload[key] = value;
    }
  }

  return payload;
}

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  const payload = parseWaitlistPayload(body);

  if (!payload) {
    return jsonResponse(
      {
        ok: false,
        error:
          "Invalid waitlist submission. Send a valid email and optional string fields only.",
      },
      400,
    );
  }

  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[waitlist] WAITLIST_WEBHOOK_URL is not configured; refusing to fake production collection.",
      );

      return jsonResponse(
        {
          ok: false,
          error: "Waitlist collection is not configured.",
          details: "Set WAITLIST_WEBHOOK_URL before accepting production signups.",
        },
        500,
      );
    }

    console.warn(
      "[waitlist] WAITLIST_WEBHOOK_URL is not configured; returning development-only success.",
    );

    return jsonResponse({ ok: true, mode: "development" }, 200);
  }

  let webhookResponse: Response;

  try {
    webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return jsonResponse(
      {
        ok: false,
        error: "Waitlist webhook request failed.",
        details: message,
      },
      502,
    );
  }

  if (!webhookResponse.ok) {
    const responseText = await webhookResponse.text().catch(() => "");
    const details = responseText
      ? `Webhook returned ${webhookResponse.status}: ${responseText.slice(0, 300)}`
      : `Webhook returned ${webhookResponse.status}.`;

    return jsonResponse(
      {
        ok: false,
        error: "Waitlist webhook rejected the submission.",
        details,
      },
      502,
    );
  }

  return jsonResponse({ ok: true, mode: "webhook" }, 200);
}
