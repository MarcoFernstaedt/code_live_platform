import { Router }from 'express'
import chatRoutes from './chat.route.js';

const router = Router();

router.get('/chat', chatRoutes);

export default router;