import * as chokidar from "chokidar";
import * as net from "net";
import { join } from "path";

export class ImageWatcher {
  private readonly patterns = ["*.jpg", "*.jpeg", "*.png", "*.bmp", "*.gif"];
  private readonly serverPort = 39999;
  private readonly serverHost = "localhost";

  constructor(private watchDir: string) {}

  start() {
    const watcher = chokidar.watch(this.patterns, {
      cwd: this.watchDir,
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on("add", (path) => {
      console.log(`${path} has been created`);
      this.sendScript(join(this.watchDir, path));
    });

    console.log(`Watching ${this.watchDir} for new images`);
  }

  private sendScript(imagePath: string) {
    const client = new net.Socket();

    client.connect(this.serverPort, this.serverHost, () => {
      const messageData = {
        messageID: 3,
        guid: "-1",
        script: `
          function spawnBlankCard()
            log("Card is being spawned...")
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
              face = "file:////${imagePath}",
              back = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/faa4901c-faff-4f66-bc2d-ff0500d9551a/dazglsi-1d054a7c-0ccc-42e8-9ea7-9c810cefe01a.png/v1/fill/w_400,h_560/fantasy_card_back__1_by_gameliberty_dazglsi-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTYwIiwicGF0aCI6IlwvZlwvZmFhNDkwMWMtZmFmZi00ZjY2LWJjMmQtZmYwNTAwZDk1NTFhXC9kYXpnbHNpLTFkMDU0YTdjLTBjY2MtNDJlOC05ZWE3LTljODEwY2VmZTAxYS5wbmciLCJ3aWR0aCI6Ijw9NDAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.misctyg7z_NIM1zz-Ccl5cKRZl1zkqEueqjejaeJHLg"
            })
            log("Card has been spawned...")
          end
          spawnBlankCard()
        `,
      };

      try {
        client.write(JSON.stringify(messageData));
        console.log("Message sent");
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        client.end();
      }
    });

    client.on("error", (error) => {
      console.error("Connection error:", error);
    });
  }
}
