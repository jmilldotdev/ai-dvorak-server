import * as chokidar from 'chokidar';
import * as net from 'net';
import { join } from 'path';

export class ImageWatcher {
  private readonly patterns = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.gif'];
  private readonly serverPort = 39999;
  private readonly serverHost = 'localhost';

  constructor(private watchDir: string) {}

  start() {
    const watcher = chokidar.watch(this.patterns, {
      cwd: this.watchDir,
      persistent: true
    });

    watcher.on('add', (path) => {
      console.log(`${path} has been created`);
      this.sendScript(join(this.watchDir, path));
    });

    console.log(`Watching ${this.watchDir}`);
  }

  private sendScript(imagePath: string) {
    const client = new net.Socket();

    client.connect(this.serverPort, this.serverHost, () => {
      const messageData = {
        messageID: 3,
        guid: '-1',
        script: `
          function spawnBlankCard()
            local object = spawnObject({
              type = "CardCustom",
              sound = false,
              scale = {2, 2, 2},
              rotation = {0, 180, 0},
              callback_function = function(spawned_object)
                log(spawned_object.getBounds())
              end
            })
            object.setCustomObject({
              face = "file:////${imagePath.replace(/\\/g, '/')}",
              back = "https://urzas.ai/img/gen-card-back.7649821c.png"
            })
            log("Card has been spawned...")
          end
          spawnBlankCard()
        `
      };

      try {
        client.write(JSON.stringify(messageData));
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        client.end();
      }
    });

    client.on('error', (error) => {
      console.error('Connection error:', error);
    });
  }
} 