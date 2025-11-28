/**
 * ------------------------------------------------------------
 * Shared App Types
 * ------------------------------------------------------------
 * Central place for cross-feature types used by:
 * - Problems UI
 * - Code runner (Piston)
 * - Editor / language selectors
 * - Sessions (live interview sessions)
 * - CreateSessionModal (room config)
 * ------------------------------------------------------------
 */

/* =====================================
   Problems / Practice Problem Types
   ===================================== */

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

export type SupportedLanguage = "javascript" | "python" | "java";

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty | string;
  category: string;
  description: ProblemDescriptionData;
  examples: ProblemExample[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
  expectedOutput: Record<SupportedLanguage, string>;
}

/* =====================================
   Code Runner / Piston API Types
   ===================================== */

export interface LanguageConfig {
  language: SupportedLanguage;
  version: string;
}

export type ExecuteResult =
  | { success: true; output: string }
  | { success: false; error: string; output?: string };

export interface PistonExecuteResponse {
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

/* =====================================
   Live Session Types (Interview Sessions)
   ===================================== */

export type SessionDifficulty = "easy" | "medium" | "hard";
export type SessionStatus = "active" | "completed";

export interface SessionUser {
  _id?: string;
  name: string;
  avatar?: string;
  clerkId?: string;
}

/**
 * Matches backend response:
 * session._id, session.problem, session.status, etc.
 */
export interface Session {
  _id: string;
  problem: string;
  difficulty: SessionDifficulty;
  status: SessionStatus;
  callId: string;
  host: SessionUser;
  participant?: SessionUser | null;
}

/**
 * Response from POST /api/session
 */
export interface CreateSessionResponse {
  message: string;
  session: Session;
  callId: string;
}

/* =====================================
   Create Session Modal / Dashboard Types
   ===================================== */

export type RoomDifficulty = SessionDifficulty | ""; // allow "" as initial state

export interface RoomConfig {
  problem: string;
  difficulty: RoomDifficulty;
}

export interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomConfig: RoomConfig;
  setRoomConfig: (config: RoomConfig) => void;
  onCreateRoom: () => void;
  isCreating: boolean;
}

export interface StatsCardsProps {
  activeSessionsCount: number;
  recentSessionsCount: number;
}

export interface ActiveSessionsProps {
  sessions: Session[];
  isLoading: boolean;
  isUserInSession: (session: Session) => boolean;
}

export interface RecentSessionsProps {
  sessions: Session[],
  isLoading: boolean,
}