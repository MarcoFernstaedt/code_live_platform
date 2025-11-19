import { Router }from 'express'
import type { Request, Response } from 'express';

const router = Router();

router.get('/test', (req: Request, res: Response): void => {
  res.status(200).json({ message: "success" });
});

export default router;