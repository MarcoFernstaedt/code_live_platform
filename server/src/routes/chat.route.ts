import {Router} from 'express'
import { getStreamToken } from '../controllers/chat.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const chatRoutes = Router()

chatRoutes.get('/token', protectRoute, getStreamToken);

export default chatRoutes;
