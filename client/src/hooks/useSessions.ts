import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import sessionApi from "../api/sessions";
import { getErrorMessage } from "../lib/utils";
import type { CreateSessionResponse, RoomConfig, Session } from "../types";

/* ============================================
   API RESPONSE TYPES (LOCAL)
   ============================================ */

type SessionsListResponse = { sessions: Session[] };
type SessionByIdResponse = { session: Session };

/* ============================================
   TYPE GUARDS
   ============================================ */

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const hasString = (obj: Record<string, unknown>, key: string): obj is Record<string, string> =>
  typeof obj[key] === "string";

/** Narrow unknown → Session (minimal required shape used across UI) */
export const isSession = (data: unknown): data is Session => {
  if (!isRecord(data)) return false;

  // core session fields
  if (!hasString(data, "_id")) return false;
  if (!hasString(data, "problem")) return false;
  if (!hasString(data, "difficulty")) return false;
  if (!hasString(data, "status")) return false;
  if (!hasString(data, "callId")) return false;

  // host must exist and be object
  if (!("host" in data) || !isRecord((data as any).host)) return false;

  return true;
};

/** Narrow unknown → Session[] */
export const isSessionArray = (data: unknown): data is Session[] => {
  return Array.isArray(data) && data.every(isSession);
};

/** Narrow unknown → { sessions: Session[] } */
const isSessionsListResponse = (data: unknown): data is SessionsListResponse => {
  if (!isRecord(data)) return false;
  return "sessions" in data && isSessionArray((data as any).sessions);
};

/** Narrow unknown → { session: Session } */
const isSessionByIdResponse = (data: unknown): data is SessionByIdResponse => {
  if (!isRecord(data)) return false;
  return "session" in data && isSession((data as any).session);
};

/* ============================================
   MUTATIONS + QUERIES
   ============================================ */

/**
 * Create a new coding session
 */
export const useCreateSession = () => {
  return useMutation<CreateSessionResponse, unknown, RoomConfig>({
    mutationFn: (payload) => sessionApi.createSession(payload),
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });
};

/**
 * Fetch active sessions
 */
export const useActiveSessions = () => {
  return useQuery<Session[]>({
    queryKey: ["activeSessions"],
    queryFn: async () => {
      const data = (await sessionApi.getActiveSessions()) as unknown;

      if (!isSessionsListResponse(data)) {
        throw new Error("Invalid active sessions response shape");
      }

      return data.sessions;
    },
  });
};

/**
 * Fetch user’s recent sessions
 */
export const useRecentSessions = () => {
  return useQuery<Session[]>({
    queryKey: ["myRecentSessions"],
    queryFn: async () => {
      const data = (await sessionApi.getRecentSessions()) as unknown;

      if (!isSessionsListResponse(data)) {
        throw new Error("Invalid recent sessions response shape");
      }

      return data.sessions;
    },
  });
};

/**
 * Fetch one session by id
 * Backend returns: { session: Session }
 * Hook returns: Session
 */
export const useSessionById = (id: string | null) => {
  return useQuery<Session>({
    queryKey: ["session", id],
    enabled: typeof id === "string" && id.length > 0,
    queryFn: async () => {
      const data = (await sessionApi.getSessionById(id as string)) as unknown;

      if (!isSessionByIdResponse(data)) {
        throw new Error("Invalid getSessionById response shape");
      }

      return data.session;
    },
    refetchInterval: 5000,
  });
};

/**
 * Join a session
 */
export const useJoinSession = () => {
  return useMutation<SessionByIdResponse, unknown, string>({
    mutationFn: (sessionId: string) => sessionApi.joinSession(sessionId),
    onSuccess: () => toast.success("Joined successfully!"),
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });
};

/**
 * End a session
 */
export const useEndSession = () => {
  return useMutation<SessionByIdResponse, unknown, string>({
    mutationFn: (sessionId: string) => sessionApi.endSession(sessionId),
    onSuccess: () => toast.success("Ended session"),
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });
};