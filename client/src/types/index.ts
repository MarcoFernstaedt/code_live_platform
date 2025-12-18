/* ======================================================
   SHARED APP TYPES (AUTHORITATIVE SOURCE)
   ====================================================== */

/* =========================
   PROBLEMS / PRACTICE
   ========================= */

export type Difficulty = "Easy" | "Medium" | "Hard";

export type SupportedLanguage = "javascript" | "python" | "java";

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemDescription {
  text: string;
  notes: string[];
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty | string;
  category: string;
  description: ProblemDescription;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
}

/* =========================
   CODE EXECUTION (PISTON)
   ========================= */

export type ExecuteResult =
  | {
      success: true;
      output: string;
    }
  | {
      success: false;
      error: string;
      output?: string;
    };

/* =========================
   LIVE SESSIONS
   ========================= */

export type SessionDifficulty = "easy" | "medium" | "hard";
export type SessionStatus = "active" | "completed";

export interface SessionUser {
  _id?: string;
  name: string;
  avatar?: string;
  clerkId?: string;
}

export interface Session {
  _id: string;
  problem: string;
  difficulty: SessionDifficulty;
  status: SessionStatus;
  callId: string;
  host: SessionUser;
  participant?: SessionUser | null;
}

/* =========================
   API RESPONSES
   ========================= */

export interface CreateSessionResponse {
  message: string;
  session: Session;
  callId: string;
}

/* =========================
   DASHBOARD / UI
   ========================= */

export interface RoomConfig {
  problem: string;
  difficulty: SessionDifficulty | "";
}