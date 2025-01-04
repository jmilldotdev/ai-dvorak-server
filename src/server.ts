import express from "express";
import { ImageWatcher } from "./imageWatcher";
import { join } from "path";
import { localHandlers } from "./lib/local";
import { composeImage } from "./lib/image";
import { Card, CardType } from "./lib/types";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the output directory
app.use("/images", express.static(join(__dirname, "../output")));

// Initialize image watcher
const watchDir = join(__dirname, "../output");
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

    const card: Card = {
      name: "Test",
      type: CardType.Action,
      rules: "Test",
    };

    // First generate the art image
    const artImagePath = await localHandlers.generateImage(prompt);

    // Then compose the full card with the generated art
    const cardImagePath = await composeImage(card, artImagePath);

    res.json({
      success: true,
      artImagePath,
      cardImagePath,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
