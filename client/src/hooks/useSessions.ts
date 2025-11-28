import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import sessionApi from "../api/sessions";
import { getErrorMessage } from "../lib/utils";
import type { Session, RoomConfig, CreateSessionResponse } from "../types";

/* ============================================
   TYPE GUARDS
   ============================================ */

/** Narrow unknown → Session */
export const isSession = (data: unknown): data is Session => {
  return (
    typeof data === "object" &&
    data !== null &&
    "_id" in data &&
    "problem" in data &&
    "difficulty" in data &&
    "status" in data &&
    "callId" in data &&
    "host" in data
  );
};

/** Narrow unknown → Session[] */
export const isSessionArray = (data: unknown): data is Session[] => {
  return Array.isArray(data) && data.every(item => isSession(item));
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
      const data = await sessionApi.getActiveSessions();
      return data.sessions;   // <- required
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
      const data = await sessionApi.getRecentSessions();
      if (!isSessionArray(data)) throw new Error("Invalid session array format");
      return data;
    },
  });
};

/**
 * Fetch one session by id
 */
export const useSessionById = (id: string | null) => {
  return useQuery<Session>({
    queryKey: ["session", id],
    queryFn: async () => {
      const data = await sessionApi.getSessionById(id as string);
      if (!isSession(data)) throw new Error("Invalid session format");
      return data;
    },
    enabled: !!id,
    refetchInterval: 5000,
  });
};

/**
 * Join a session
 */
export const useJoinSession = (id: string | null) => {
  return useMutation({
    mutationFn: () => sessionApi.joinSession(id as string),
    onSuccess: () => toast.success("Joined successfully!"),
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });
};

/**
 * End a session
 */
export const useEndSession = (id: string | null) => {
  return useMutation({
    mutationFn: () => sessionApi.endSession(id as string),
    onSuccess: () => toast.success("Ended session"),
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });
};