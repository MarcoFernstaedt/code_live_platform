import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const chatRoutes = Router();

/**
 * ------------------------------------------------------------
 *  /api/chat/token
 *  -----------------------------------------------------------
 *  Get authentication token for Stream Chat & Stream Video.
 *
 *  Access: Protected (Clerk user required)
 * ------------------------------------------------------------
 */
chatRoutes.get("/token", protectRoute, getStreamToken);

export default chatRoutes;