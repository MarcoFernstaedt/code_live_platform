import express from 'express';
import type { Request, Response } from 'express';
import router from './routes/index.ts';
import { ENV } from './lib/env.ts';
import connectDB from './lib/db.ts';
import path from 'path';
import cors from 'cors';
import { serve } from 'inngest/express';
import { functions, inngest } from './lib/inngest.ts';

const app = express();
const PORT = ENV.PORT || 5000;

const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true,
}))

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

// routes
app.use('/api', router);


if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('[*any]', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// boot
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log('Server running on port:', PORT);
  });
})();