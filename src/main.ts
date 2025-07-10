import gsap from "gsap";
import { Application, Container, Graphics } from "pixi.js";
import { LibPixiPerforMon } from "lyb-pixi-js/Components/Custom/LibPixiPerforMon.js";
import { libJsIsMobile } from "lyb-js/Browser/LibJsIsMobile.js";
import { libJsIsPad } from "lyb-js/Browser/LibJsIsPad.js";
import { GameScreen } from "./screen/GameScreen";

export const notPC = () => libJsIsMobile() || libJsIsPad();

export const app = new Application<HTMLCanvasElement>({
  resizeTo: window,
  antialias: false,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  powerPreference: "high-performance",
  premultipliedAlpha: false,
});
app.stage.sortableChildren = true;
document.body!.appendChild(app.view);
(globalThis as any).__PIXI_APP__ = app;

export class GameMount {
  /** 游戏主界面 */
  private _gameScreen: any;
  /** 横竖屏遮罩 */
  private _HVMask!: Graphics;
  /** 舞台 */
  gameStage: Container;
  /** 游戏层 */
  gameLayer: Container;
  /** 弹窗层 */
  dialogLayer: Container;
  /** 状态层 */
  statusLayer: Container;
  /** 当前适配模式 */
  static ADAPT_MODE: "h" | "v" | "hv" = "hv";

  private _Z_INDEX = {
    bgImgFill: 1,
    stage: 2,
    gameScreen: 998,
    dialogLayer: 999,
    statusLayer: 1000,
  };

  constructor() {
    this.gameStage = new Container();
    app.stage.addChild(this.gameStage);
    this.gameStage.name = "游戏舞台";
    this.gameStage.sortableChildren = true;
    this.gameStage.zIndex = this._Z_INDEX.stage;

    this.gameLayer = new Container();
    this.gameStage.addChild(this.gameLayer);
    this.gameLayer.name = "游戏层";
    this.gameLayer.zIndex = this._Z_INDEX.gameScreen;

    this.dialogLayer = new Container();
    this.gameStage.addChild(this.dialogLayer);
    this.dialogLayer.name = "游戏内弹窗层";
    this.dialogLayer.zIndex = this._Z_INDEX.dialogLayer;

    this.statusLayer = new Container();
    this.gameStage.addChild(this.statusLayer);
    this.statusLayer.name = "公用状态弹窗层";
    this.statusLayer.zIndex = this._Z_INDEX.statusLayer;

    LibPixiPerforMon.ADAPT_MODE = GameMount.ADAPT_MODE;
    const libPixiPerforMon = new LibPixiPerforMon(app);
    this.statusLayer.addChild(libPixiPerforMon);
    libPixiPerforMon.name = "性能监视器";
  }

  /** @description 挂载 */
  mount(screen: any) {
    this._gameScreen = new screen();
    gameMount.gameLayer.addChild(this._gameScreen);

    //横竖屏遮罩
    this._HVMask = new Graphics();
    this.gameStage.addChild(this._HVMask);
    this._HVMask.name = "横竖屏遮罩裁剪";
    this.gameStage.mask = this._HVMask;

    const adapt = {
      h: this._updateH,
      v: this._updateV,
      hv: this._updateHV,
    };
    const updateView = adapt[GameMount.ADAPT_MODE].bind(this);
    window.addEventListener("resize", updateView);
    updateView();
  }

  /** @description 仅适配横版 */
  private _updateH() {
    let x: number;
    let y: number;
    let s: number;
    let rotation: number;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const orientation = w > h ? "h" : "v";
    this.gameStage.pivot.set(1920 / 2, 1080 / 2);

    if (orientation === "h" || !notPC()) {
      rotation = 0;
      s = Math.min(w / 1920, h / 1080);
      x = w / 2;
      y = h / 2;
    } else {
      rotation = Math.PI / 2;
      s = Math.min(w / 1080, h / 1920);
      x = w / 2;
      y = h / 2;
    }

    this.gameStage.scale.set(s);
    this.gameStage.x = x;
    this.gameStage.y = y;
    gsap.killTweensOf(this.gameStage);
    gsap.to(this.gameStage, {
      rotation,
      duration: 0.25,
      ease: "power1.out",
    });

    this._updateMask(1920, 1080);
  }

  /** @description 仅适配竖版 */
  private _updateV() {
    let x: number;
    let y: number;
    let s: number;
    let rotation: number;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const orientation = w > h ? "h" : "v";
    this.gameStage.pivot.set(1080 / 2, 1920 / 2);

    if (orientation === "h" || !notPC()) {
      rotation = 0;
      s = Math.min(w / 1080, h / 1920);
      x = w / 2;
      y = h / 2;
    } else {
      rotation = Math.PI / 2;
      s = Math.min(w / 1920, h / 1080);
      x = w / 2;
      y = h / 2;
    }

    this.gameStage.scale.set(s);
    this.gameStage.x = x;
    this.gameStage.y = y;
    gsap.killTweensOf(this.gameStage);
    gsap.to(this.gameStage, {
      rotation,
      duration: 0.25,
      ease: "power1.out",
    });

    this._updateMask(1080, 1920);
  }

  /** @description 适配横竖版 */
  private _updateHV() {
    let x: number;
    let y: number;
    let s: number;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const orientation = w > h ? "h" : "v";

    if (orientation === "h") {
      s = Math.min(w / 1920, h / 1080);
      x = w / 2 - (1920 * s) / 2;
      y = (h - 1080 * s) / 2;
    } else {
      s = Math.min(w / 1080, h / 1920);
      x = w / 2 - (1080 * s) / 2;
      y = (h - 1920 * s) / 2;
    }

    this.gameStage.scale.set(s);
    this.gameStage.x = x;
    this.gameStage.y = y;

    this._updateMask(w, h);
  }

  /** @description 更新遮罩 */
  private _updateMask(w: number, h: number) {
    this._HVMask.clear();
    this._HVMask.beginFill("#000");
    if (w > h) {
      this._HVMask.drawRect(0, 0, 1920, 1080);
    } else {
      this._HVMask.drawRect(0, 0, 1080, 1920);
    }
    this._HVMask.endFill();
  }
}
export const gameMount = new GameMount();
gameMount.mount(GameScreen);
