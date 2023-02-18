import type { Timestamp } from "@firebase/firestore";

export const recordTypeStrList = [
  "コメントのみ",
  "草",
  "ペレット",
  "水",
  "トイレ掃除",
  "簡易トイレ掃除",
  "散歩",
  "爪切り",
  "病院",
];

export class Record {
  constructor(
    public id: string,
    public userId: string,
    public who: string,
    public type: number,
    public date: Timestamp,
    public actualDate: Timestamp,
    public comment: string,
    public imageName: string | null = null
  ) {}
  /**
   * `display`なら表示時刻, `actual`なら実際の入力時刻を整形して取得する.
   * @param flag `display`か`actual`のいずれか.
   */
  private getDate(flag: "display" | "actual"): string {
    const dateObj: Date = flag === "display" ? this.date.toDate() : this.actualDate.toDate();
    const month = dateObj.getMonth() + 1; // getMonthは0始まり
    const date = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const hourStr = hour.toString().padStart(2, "0");
    const minuteStr = minute.toString().padStart(2, "0");
    return `${month}/${date} ${hourStr}:${minuteStr}`;
  }
  /**
   * 表示時刻を整形して返す
   */
  public getDisplayDate(): string {
    return this.getDate("display");
  }
  /**
   * 実際の入力時刻を整形して返す
   */
  public getActualDate(): string {
    return this.getDate("actual");
  }
  public getType(): string {
    // コメントのみは表示しないことにする.
    if (this.type === 0) {
      return "";
    }
    // トイレ掃除は長いので省略表記
    if (this.type === 4) {
      return "トイレ";
    }
    if (this.type === 5) {
      return "トイレ(簡)";
    }
    return recordTypeStrList[this.type];
  }
  /**
   * 完全な名前のタイプを取得
   */
  public getFullType(): string {
    return recordTypeStrList[this.type];
  }
}
