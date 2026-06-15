import "server-only";

const HF_API_BASE_URL = "https://api-inference.huggingface.co/models";
const PLACEHOLDER_TOKEN = "your_huggingface_token_here";

type HuggingFaceSettings = {
  enabled: boolean;
  hasToken: boolean;
  model: string | null;
  reason?: string;
};

type GenerateTextOptions = {
  maxNewTokens?: number;
  model?: string;
  prompt: string;
  temperature?: number;
  topP?: number;
};

type GenerateTextResult =
  | {
      ok: true;
      model: string;
      text: string;
    }
  | {
      code:
        | "HF_INVALID_RESPONSE"
        | "HF_NOT_CONFIGURED"
        | "HF_REQUEST_FAILED";
      error: string;
      ok: false;
    };

type HuggingFaceGeneratedText = {
  generated_text?: unknown;
};

type HuggingFaceError = {
  error?: unknown;
};

function getToken() {
  const token = process.env.HF_TOKEN?.trim();

  if (!token || token === PLACEHOLDER_TOKEN) {
    return null;
  }

  return token;
}

function getModel() {
  return process.env.HF_MODEL?.trim() || null;
}

function modelToUrlPath(model: string) {
  return model.split("/").map(encodeURIComponent).join("/");
}

function extractGeneratedText(payload: unknown) {
  if (Array.isArray(payload)) {
    const first = payload[0] as HuggingFaceGeneratedText | undefined;
    return typeof first?.generated_text === "string"
      ? first.generated_text
      : null;
  }

  if (payload && typeof payload === "object") {
    const generated = (payload as HuggingFaceGeneratedText).generated_text;
    return typeof generated === "string" ? generated : null;
  }

  return null;
}

function extractErrorMessage(payload: unknown) {
  if (payload && typeof payload === "object") {
    const error = (payload as HuggingFaceError).error;
    return typeof error === "string" ? error : null;
  }

  return null;
}

export function getHuggingFaceSettings(): HuggingFaceSettings {
  const token = getToken();
  const model = getModel();

  if (!token) {
    return {
      enabled: false,
      hasToken: false,
      model,
      reason: "HF_TOKEN is not configured.",
    };
  }

  if (!model) {
    return {
      enabled: false,
      hasToken: true,
      model: null,
      reason: "HF_MODEL is not configured.",
    };
  }

  return {
    enabled: true,
    hasToken: true,
    model,
  };
}

export async function generateHuggingFaceText({
  maxNewTokens = 360,
  model,
  prompt,
  temperature = 0.7,
  topP = 0.9,
}: GenerateTextOptions): Promise<GenerateTextResult> {
  const settings = getHuggingFaceSettings();
  const selectedModel = model ?? settings.model;
  const token = getToken();

  if (!token || !selectedModel) {
    return {
      code: "HF_NOT_CONFIGURED",
      error:
        settings.reason ??
        "Hugging Face is not configured for this environment.",
      ok: false,
    };
  }

  const response = await fetch(
    `${HF_API_BASE_URL}/${modelToUrlPath(selectedModel)}`,
    {
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: maxNewTokens,
          return_full_text: false,
          temperature,
          top_p: topP,
        },
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      code: "HF_REQUEST_FAILED",
      error:
        extractErrorMessage(payload) ??
        `Hugging Face request failed with status ${response.status}.`,
      ok: false,
    };
  }

  const text = extractGeneratedText(payload);

  if (!text) {
    return {
      code: "HF_INVALID_RESPONSE",
      error: "Hugging Face returned an unsupported response shape.",
      ok: false,
    };
  }

  return {
    model: selectedModel,
    ok: true,
    text: text.trim(),
  };
}
