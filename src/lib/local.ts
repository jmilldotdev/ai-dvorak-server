import { ComfyUIClient } from "comfy-ui-client";
import type { Prompt } from "comfy-ui-client";
import { randomInt } from "crypto";
import path from "path";
import fs from "fs";

const comfyWorkflow = (prompt: string): Prompt => {
  return {
    "3": {
      inputs: {
        seed: randomInt(1, 4294967294),
        steps: 35,
        cfg: 8,
        sampler_name: "euler",
        scheduler: "normal",
        denoise: 1,
        model: ["10", 0],
        positive: ["6", 0],
        negative: ["7", 0],
        latent_image: ["5", 0],
      },
      class_type: "KSampler",
    },
    "4": {
      inputs: {
        ckpt_name: "sdxl-juggernaut.safetensors",
      },
      class_type: "CheckpointLoaderSimple",
    },
    "5": {
      inputs: {
        width: 832,
        height: 632,
        batch_size: 1,
      },
      class_type: "EmptyLatentImage",
    },
    "6": {
      inputs: {
        text: `${prompt}, in the style of embedding:clipguideddiffusion_embeddings`,
        clip: ["10", 1],
      },
      class_type: "CLIPTextEncode",
    },
    "7": {
      inputs: {
        text: "text, watermark",
        clip: ["10", 1],
      },
      class_type: "CLIPTextEncode",
    },
    "8": {
      inputs: {
        samples: ["3", 0],
        vae: ["4", 2],
      },
      class_type: "VAEDecode",
    },
    "9": {
      inputs: {
        filename_prefix: "ComfyUI",
        images: ["8", 0],
      },
      class_type: "SaveImage",
    },
    "10": {
      inputs: {
        lora_name: "clipguideddiffusion_lora.safetensors",
        strength_model: 0.7000000000000001,
        strength_clip: 1,
        model: ["4", 0],
        clip: ["4", 1],
      },
      class_type: "LoraLoader",
    },
  };
};

export const generateImage = async (prompt: string): Promise<string> => {
  const serverAddress = "127.0.0.1:8188";
  const clientId = "baadbabe-b00b-4206-9420-deadd00d1337";
  const client = new ComfyUIClient(serverAddress, clientId);
  const inputPrompt = comfyWorkflow(prompt);

  // Connect to server
  await client.connect();

  // Generate images
  const images = await client.getImages(inputPrompt);
  const imageFilename = images["9"][0].image.filename;

  const outputDir = path.join(process.cwd(), "raw_output");
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await client.saveImages(images, outputDir);
  const filepath = path.join(outputDir, imageFilename);
  console.log(`Image saved to ${filepath}`);

  // Disconnect
  await client.disconnect();

  return filepath;
};

export const localHandlers = {
  generateImage,
};
