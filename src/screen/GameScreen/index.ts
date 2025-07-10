import { GameMount } from "@/main";
import { LibJsResizeWatcher } from "lyb-js/Base/LibJsResizeWatcher.js";
import { LibDestroyContainer } from "lyb-pixi-js/Components/Base/LibDestroyContainer.js";
import { LibPixiText } from "lyb-pixi-js/Components/Base/LibPixiText.js";

export class GameScreen extends LibDestroyContainer {
  constructor() {
    super();

    const text = new LibPixiText({
      text: "Hello World!",
      fontSize: 100,
      fontColor: "#fff",
    });
    this.addChild(text);
    text.anchor.set(0.5);

    const libJsResizeWatcher = new LibJsResizeWatcher(GameMount.ADAPT_MODE);
    this._onDestroyed = libJsResizeWatcher.on((w, h) => {
      if (w > h) {
        text.x = 1920 / 2;
        text.y = 1080 / 2;
      } else {
        text.x = 1080 / 2;
        text.y = 1920 / 2;
      }
    });
  }
}
