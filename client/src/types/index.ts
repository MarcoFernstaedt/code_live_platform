/**
 * ------------------------------------------------------------
 * Shared App Types
 * ------------------------------------------------------------
 * Central place for cross-feature types used by:
 * - Problems UI
 * - Code runner (Piston)
 * - Editor / language selectors
 * ------------------------------------------------------------
 */

/* =========================
   Problems / Practice Types
   ========================= */

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemDescriptionData {
  text: string;
  notes: string[];
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty | string; // keep string to tolerate future server-side values
  category: string;
  description: ProblemDescriptionData;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
  expectedOutput: Record<SupportedLanguage, string>;
}

/* =========================
   Code Runner / Languages
   ========================= */

export type SupportedLanguage = "javascript" | "python" | "java";

export type LanguageConfig = Readonly<{
  language: SupportedLanguage;
  version: string;
}>;

export type ExecuteResult =
  | { success: true; output: string }
  | { success: false; error: string; output?: string };

export type PistonExecuteResponse = {
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
};