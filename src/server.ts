import express from "express";
import { ImageWatcher } from "./imageWatcher";
import { join } from "path";
import { localHandlers } from "./lib/local";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize image watcher
const watchDir = join(__dirname, "output");
const watcher = new ImageWatcher(watchDir);
watcher.start();

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const imagePath = await localHandlers.generateImage(prompt);
    res.json({ success: true, imagePath });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
