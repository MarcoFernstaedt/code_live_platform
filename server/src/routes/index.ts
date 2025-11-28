import { Router }from 'express'
import chatRoutes from './chat.route.js';
import sessionRoutes from './session.route.js';

const router = Router();

router.use('/chat', chatRoutes);
router.use('/session', sessionRoutes);

export default router;