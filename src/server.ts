import express from 'express';
import { ImageWatcher } from './imageWatcher';
import { join } from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Initialize image watcher
const watchDir = join(__dirname, '../../img');
const watcher = new ImageWatcher(watchDir);
watcher.start();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 