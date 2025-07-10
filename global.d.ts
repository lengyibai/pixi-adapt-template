declare module globalThis {
  interface Window {
    CommonTurboSpin: any;
    /** 类 */
    commonTurboSpin: any;
    /** 添加数据 */
    _turboAddData: (data: GameTurboSpinDataParams) => void;
    /** 快速Spin类 */
    gameTurboSpin: any;
  }
}

/** @description 快速Spin添加数据 */
interface GameTurboSpinDataParams {
  /** 用于回放免费转 */
  id?: number;
  /** 是否为免费转 */
  isFree?: boolean;
  /** 中奖类型 */
  type: ICON_TYPE;
  /** 余额 */
  balance: number;
  /** 中奖倍数 */
  multiple: number;
  /** 中奖金额 */
  win: number;
  /** 总下注成本 */
  totalBet: string;
  /** 总盈利 */
  totalWin: string;
  /** 免费转剩余次数 */
  freeCount?: number;
}
