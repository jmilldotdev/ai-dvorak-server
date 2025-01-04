import path from "path";
import fs from "fs";
import sharp from "sharp";
import TextToSVG from "text-to-svg";
import crypto from "crypto";
import axios from "axios";
import type { GenerationOptions, Anchor } from "text-to-svg";
import { Card } from "./types";

function generateSVGWithLineBreaks(
  text: string,
  maxWidth: number,
  lineHeight: number,
  fontSize: number
): string {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  words.slice(1).forEach((word) => {
    if ((currentLine + " " + word).length > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += " " + word;
    }
  });
  lines.push(currentLine);

  const svgLines = lines
    .map(
      (line, index) =>
        `<tspan x="0" dy="${index === 0 ? 0 : lineHeight}">${line}</tspan>`
    )
    .join("");
  const svgHeight = lines.length * lineHeight;
  const svgWidth = maxWidth * (fontSize * 0.6);

  return `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <text font-family="Arial" font-size="${fontSize}" y="${fontSize}" fill="black">
      ${svgLines}
    </text>
  </svg>`;
}

export async function composeImage(
  card: Card,
  imageUrl: string
): Promise<string> {
  const framePath = path.join(process.cwd(), "src", "assets", "frame.png");
  const outputDir = path.join(process.cwd(), "output");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputImagePath = path.join(
    outputDir,
    `${crypto.randomBytes(20).toString("hex")}.png`
  );

  try {
    const textToSVG = TextToSVG.loadSync();

    const options: GenerationOptions = {
      fontSize: 32,
      anchor: "top" as Anchor,
      attributes: { fill: "black" },
    };

    const nameText = textToSVG.getSVG(card.name, options);
    const typeText = textToSVG.getSVG(card.type, options);
    const rulesText = generateSVGWithLineBreaks(card.rules, 45, 40, 32);

    let imageBuffer;
    if (imageUrl.startsWith("http")) {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      imageBuffer = Buffer.from(response.data);
    } else {
      imageBuffer = fs.readFileSync(imageUrl);
    }

    await sharp(framePath)
      .composite([
        { input: imageBuffer, top: 154, left: 34 },
        { input: Buffer.from(nameText), top: 71, left: 69 },
        { input: Buffer.from(typeText), top: 820, left: 69 },
        { input: Buffer.from(rulesText), top: 904, left: 69 },
      ])
      .toFile(outputImagePath);

    return outputImagePath;
  } catch (error) {
    console.error("Failed to compose image:", error);
    throw new Error("Failed to compose image");
  }
}

export type { Card };
