import express from "express";
import { ImageWatcher } from "./imageWatcher";
import { join } from "path";
import { localHandlers } from "./lib/local";
import { composeImage } from "./lib/image";
import { createCard } from "./lib/llm";

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

type GenerateRequest = {
  name: string;
  type?: string;
  rulesHint?: string;
  imagePrompt?: string;
};

app.post("/generate", async (req, res) => {
  try {
    const {
      name,
      type,
      rulesHint,
      imagePrompt = "",
    }: GenerateRequest = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Run card text and image generation in parallel
    const [cardData, artImagePath] = await Promise.all([
      createCard({ name, type, rulesHint }),
      localHandlers.generateImage(
        imagePrompt || `Fantasy card art for ${name}`
      ),
    ]);

    // Then compose the full card with the generated art
    const cardImagePath = await composeImage(cardData, artImagePath);

    res.json({
      success: true,
      card: cardData,
      artImagePath,
      cardImagePath,
    });
  } catch (error) {
    console.error("Error generating card:", error);
    res.status(500).json({
      error: "Failed to generate card",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
