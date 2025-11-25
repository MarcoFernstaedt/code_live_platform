import { Router }from 'express'
import chatRoutes from './chat.route.js';
import sessionRoutes from './session.route.js';

const router = Router();

router.get('/chat', chatRoutes);
router.get('/session', sessionRoutes);

export default router;