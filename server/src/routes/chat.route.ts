import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createSession,
  getActiveSessions,
  getRecentSessions,
  getSessionById,
  joinSession,
  endSession,
} from "../controllers/session.controller.js";

const sessionRoutes = Router();

// Collection routes
sessionRoutes.post("/", protectRoute, createSession);
sessionRoutes.get("/active", protectRoute, getActiveSessions);
sessionRoutes.get("/recent", protectRoute, getRecentSessions);

// Resource route
sessionRoutes.get("/:sessionId", protectRoute, getSessionById);

// Nested resource actions
sessionRoutes.post("/:sessionId/participants", protectRoute, joinSession);
sessionRoutes.patch("/:sessionId/status", protectRoute, endSession);

export default sessionRoutes;