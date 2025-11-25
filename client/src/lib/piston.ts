// ----------------------------------------
// Piston API Base
// ----------------------------------------
const PISTON_API_BASE = "https://emkc.org/api/v2/piston";

// ----------------------------------------
// Supported Languages
// ----------------------------------------
export type SupportedLanguage = "javascript" | "python" | "java";

interface LanguageConfig {
  language: SupportedLanguage;
  version: string;
}

// Specific piston runtime versions
const LANGUAGE_VERSION: Record<SupportedLanguage, LanguageConfig> = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
} as const;

// File extensions per language
const FILE_EXT: Record<SupportedLanguage, string> = {
  javascript: "js",
  python: "py",
  java: "java",
};

const getFileExtension = (language: SupportedLanguage): string =>
  FILE_EXT[language];

// ----------------------------------------
// Execution Result Types
// ----------------------------------------
export type ExecuteResult =
  | { success: true; output: string }
  | { success: false; error: string; output?: string };

// Minimal shape of piston runtime response
interface PistonExecuteResponse {
  run?: {
    stdout?: string;
    stderr?: string;
    output?: string;
    code?: number;
    signal?: string | null;
  };
  compile?: {
    stdout?: string;
    stderr?: string;
    code?: number;
  };
  message?: string;
}

// ----------------------------------------
// Build payload for piston
// ----------------------------------------
const buildFilesPayload = (language: SupportedLanguage, code: string) => {
  return [
    {
      name: `main.${getFileExtension(language)}`,
      content: code,
    },
  ];
};

// ----------------------------------------
// Execute Code via Piston API
// ----------------------------------------
export const executeCode = async (
  language: SupportedLanguage,
  code: string,
  opts?: { timeoutMs?: number }
): Promise<ExecuteResult> => {
  if (!code.trim()) {
    return { success: false, error: "Code is empty." };
  }

  const config = LANGUAGE_VERSION[language];
  const timeoutMs = opts?.timeoutMs ?? 12_000;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${PISTON_API_BASE}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: buildFilesPayload(language, code),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        success: false,
        error: `Piston request failed (${res.status}) — ${text || res.statusText}`,
      };
    }

    const data = (await res.json()) as PistonExecuteResponse;

    // Handle compilation errors
    const compileErr =
      data.compile?.stderr?.trim() || data.compile?.stdout?.trim();

    if (compileErr) {
      return {
        success: false,
        error: "Compilation error.",
        output: compileErr,
      };
    }

    // Merge stdout + stderr if needed
    const runOutput =
      data.run?.output ??
      [data.run?.stdout?.trim(), data.run?.stderr?.trim()]
        .filter(Boolean)
        .join("\n");

    if (!runOutput && data.message) {
      return { success: false, error: data.message };
    }

    // Runtime checks
    const exitCode = data.run?.code ?? 0;
    const stderr = data.run?.stderr?.trim();

    if (exitCode !== 0 || stderr) {
      return {
        success: false,
        error: "Runtime error.",
        output: runOutput || stderr || "Unknown runtime error.",
      };
    }

    return { success: true, output: runOutput || "" };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        success: false,
        error: `Execution timed out after ${timeoutMs}ms.`,
      };
    }

    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown execution error.",
    };
  } finally {
    clearTimeout(timeout);
  }
};