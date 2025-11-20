import express from 'express';
import type { Request, Response } from 'express';
import router from './routes/index.ts';
import { ENV } from './lib/env.ts';
import connectDB from './lib/db.ts';
import path from 'path';

const app = express();
const PORT = ENV.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json());
app.use('/api', router);

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('[*any]', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log('Server running on port:', PORT);
  });
})();