# Setup

**Start ComfyUI**
Make sure ComfyUI is running on an accessible server.

**Create env**
Copy `.env.example` and fill in the values.
`COMFYUI_EMBEDDINGS_NAME` and `COMFYUI_LORA_NAME` should be the entire filenames of the LoRA and embeddings you are using, and they should be loaded in your ComfyUI server.

**Setup repo**

```bash
pnpm i
pnpm dev
```

**Start Tabletop Simulator**

- Open Tabletop Simulator
- Click 'Create'
- Choose 'Singleplayer'
- Choose 'Classic' -> 'Cards' lobby type, and delete the default objects


# Testing

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Build Week",
    "imagePrompt": "A vibrant desert party scene at night with neon lights and dancing figures"
  }'
```