import express from 'express';
import router from './routes/index.ts'; 
import { ENV } from './lib/env.ts';
import path from 'path';

const app = express();
const PORT = ENV.PORT;

const __dirname = path.resolve

app.use('/api', router);

if (ENV.NODE_ENV === 'production')  {
  app.use(express.static(path.join(__dirname, '../client/dist')))

  app.get('/{*any}', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }) 
}

app.listen(PORT, () => {
  console.log('Server running on port:', PORT);
});