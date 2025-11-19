import express from 'express';
import router from './routes/index.ts'; 
import { ENV } from './lib/env.ts';

const app = express();
const PORT = ENV.PORT;

app.use('/api', router);

app.listen(PORT, () => {
  console.log('Server running on port:', PORT);
});