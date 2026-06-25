import "server-only";

const HF_CHAT_COMPLETIONS_URL =
  "https://router.huggingface.co/v1/chat/completions";
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
  responseFormat?: unknown;
  systemPrompt?: string;
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

type HuggingFaceError = {
  error?: unknown;
  message?: unknown;
};

type HuggingFaceChatCompletion = {
  choices?: Array<{
    delta?: {
      content?: unknown;
    };
    message?: {
      content?: unknown;
      reasoning?: unknown;
    };
    text?: unknown;
  }>;
  error?: unknown;
  content?: unknown;
  generated_text?: unknown;
  output_text?: unknown;
  response?: unknown;
  text?: unknown;
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

function extractTextContent(content: unknown): string | null {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const parts = content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          const text = record.text ?? record.content ?? record.value;
          return typeof text === "string" ? text : "";
        }

        return "";
      })
      .filter(Boolean);

    return parts.length > 0 ? parts.join("\n") : null;
  }

  if (content && typeof content === "object") {
    const record = content as Record<string, unknown>;
    const text = record.text ?? record.content ?? record.value;
    return typeof text === "string" ? text : null;
  }

  return null;
}

function extractGeneratedText(payload: unknown): string | null {
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const text = extractGeneratedText(item);
      if (text) return text;
    }

    return null;
  }

  if (payload && typeof payload === "object") {
    const completion = payload as HuggingFaceChatCompletion;
    const choice = completion.choices?.[0];
    return (
      extractTextContent(choice?.message?.content) ??
      extractTextContent(choice?.message?.reasoning) ??
      extractTextContent(choice?.delta?.content) ??
      extractTextContent(completion.generated_text) ??
      extractTextContent(completion.output_text) ??
      extractTextContent(completion.response) ??
      extractTextContent(completion.content) ??
      extractTextContent(completion.text) ??
      extractTextContent(choice?.text)
    );
  }

  return null;
}

function extractErrorMessage(payload: unknown) {
  if (payload && typeof payload === "object") {
    const { error, message } = payload as HuggingFaceError;
    if (typeof error === "string") {
      return error;
    }

    if (error && typeof error === "object" && "message" in error) {
      const nestedMessage = (error as { message?: unknown }).message;
      if (typeof nestedMessage === "string") {
        return nestedMessage;
      }
    }

    return typeof message === "string" ? message : null;
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
  responseFormat,
  systemPrompt = "You are a concise writing assistant.",
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

  const response = await fetch(HF_CHAT_COMPLETIONS_URL, {
    body: JSON.stringify({
      max_tokens: maxNewTokens,
      messages: [
        { content: systemPrompt, role: "system" },
        { content: prompt, role: "user" },
      ],
      model: selectedModel,
      response_format: responseFormat,
      stream: false,
      temperature,
      top_p: topP,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

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
