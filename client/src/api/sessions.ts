// api/sessions.ts
import axiosInstance from "../lib/axios";
import type { CreateSessionResponse, Session } from "../types";

const sessionApi = {
  // body: { problem, difficulty }
  createSession: async (data: { problem: string; difficulty: string }): Promise<CreateSessionResponse> => {
    const res = await axiosInstance.post<CreateSessionResponse>("/session", data);
    return res.data;
  },

  getActiveSessions: async (): Promise<{ sessions: Session[] }> => {
    const res = await axiosInstance.get<{ sessions: Session[] }>("/session/active");
    return res.data;
  },

  getRecentSessions: async (): Promise<{ sessions: Session[] }> => {
    const res = await axiosInstance.get<{ sessions: Session[] }>("/session/recent");
    return res.data;
  },

  getSessionById: async (id: string): Promise<{ session: Session }> => {
    const res = await axiosInstance.get<{ session: Session }>(`/session/${id}`);
    return res.data;
  },

  joinSession: async (id: string): Promise<{ session: Session }> => {
    // controller: POST /api/session/:sessionId/participants
    const res = await axiosInstance.post<{ session: Session }>(`/session/${id}/participants`);
    return res.data;
  },

  endSession: async (id: string): Promise<{ session: Session }> => {
    // controller: PATCH /api/session/:sessionId/status
    const res = await axiosInstance.patch<{ session: Session }>(`/session/${id}/status`);
    return res.data;
  },

  getStreamToken: async () => {
    const res = axiosInstance.get('/chat/token')
    return (await res).data;
  }
};

export default sessionApi;