import type { Request, Response } from "express";
import { catchAsync } from "../lib/catchAsync.js";
import Session from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";
import { AppError } from "../lib/AppError.js";

/**
 * POST /api/session/
 * ------------------------------------------------------------
 * Create a new coding session and initialize Stream video + chat
 * infrastructure for the host.
 *
 * Access: Protected (requires protectRoute middleware)
 *
 * Request Body:
 *   - problem: string
 *   - difficulty: "easy" | "medium" | "hard"
 *
 * Behavior:
 *   1. Validates required fields.
 *   2. Creates a session document in MongoDB.
 *   3. Creates (or retrieves) a Stream video call with metadata.
 *   4. Creates a dedicated Stream chat channel for messaging.
 *
 * Response: 201 Created
 * {
 *   message: "Session created",
 *   session: SessionDocument,
 *   callId: string
 * }
 */
export const createSession = catchAsync(async (req: Request, res: Response) => {
  const { problem, difficulty } = req.body;

  if (!problem || !difficulty) {
    throw new AppError("problem and difficulty are required", 400);
  }

  const hostId = req.user?._id;
  const clerkId = req.user?.clerkId;

  if (!hostId || !clerkId) {
    throw new AppError("Unauthorized: missing user context", 401);
  }

  const callId = `session_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  const session = await Session.create({
    problem,
    difficulty,
    host: hostId,
    callId,
  });

  await streamClient.video.call("default", callId).getOrCreate({
    data: {
      created_by_id: clerkId,
      custom: {
        problem,
        difficulty,
        sessionId: session._id.toString(),
      },
    },
  });

  const channel = chatClient.channel("messaging", callId, {
    name: `${problem} Session`,
    created_by_id: clerkId,
    members: [clerkId],
  });

  await channel.create();

  return res.status(201).json({
    message: "Session created",
    session,
    callId,
  });
});

/**
 * GET /api/session/active
 * ------------------------------------------------------------
 * Fetch the most recent active coding sessions.
 *
 * Access: Protected
 */
export const getActiveSessions = catchAsync(
  async (_req: Request, res: Response) => {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name avatar")
      .populate("participant", "name avatar")
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json({ sessions });
  }
)

/**
 * GET /api/session/recent
 * ------------------------------------------------------------
 * Fetch the most recent completed sessions for the authenticated user.
 *
 * Access: Protected
 */
export const getRecentSessions = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("Unauthorized: missing user context", 401);
    }

    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ sessions });
  }
);

/**
 * GET /api/session/:sessionId
 * ------------------------------------------------------------
 * Fetch a single session by its MongoDB ID.
 *
 * Access: Protected
 */
export const getSessionById = catchAsync(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId)
      .populate("host", "name email avatar clerkId")
      .populate("participant", "name email avatar clerkId");

    if (!session) {
      throw new AppError("Session not found", 404);
    }

    return res.status(200).json({ session });
  }
);

/**
 * POST /api/session/:sessionId/participants
 * ------------------------------------------------------------
 * Join an active session as the participant.
 *
 * Access: Protected
 *
 * Behavior:
 *   - Ensures session exists and is not full
 *   - Sets participant to current user
 *   - Adds user to the session chat channel
 *
 * Response:
 *   200 OK { session }
 */
export const joinSession = catchAsync(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const userId = req.user?._id;
    const clerkId = req.user?.clerkId;

    if (!userId || !clerkId) {
      throw new AppError("Unauthorized: missing user context", 401);
    }

    const session = await Session.findById(sessionId);
    if (!session) throw new AppError("Session not found", 404);

    if (session.status !== "active") {
      throw new AppError("Session is not active", 400);
    }

    if (session.participant) {
      throw new AppError("Session is full", 409);
    }

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    return res.status(200).json({ session });
  }
);

/**
 * PATCH /api/session/:sessionId/status
 * ------------------------------------------------------------
 * End a session (host only). Marks session completed and
 * tears down Stream video call + chat channel.
 *
 * Access: Protected (host only)
 *
 * Behavior:
 *   - Validates session exists
 *   - Ensures requester is host
 *   - Prevents double-ending
 *   - Sets status to "completed"
 *   - Deletes Stream call and chat channel
 *
 * Response:
 *   200 OK { session }
 */
export const endSession = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError("Unauthorized: missing user context", 401);
  }

  const session = await Session.findById(sessionId);
  if (!session) throw new AppError("Session not found", 404);

  if (session.host.toString() !== userId.toString()) {
    throw new AppError("Only host can end session", 403);
  }

  if (session.status === "completed") {
    throw new AppError("Session is already completed", 400);
  }

  session.status = "completed";
  await session.save();

  const call = streamClient.video.call("default", session.callId);
  await call.delete({ hard: true });

  const channel = chatClient.channel("messaging", session.callId);
  await channel.delete();

  return res.status(200).json({ session });
});