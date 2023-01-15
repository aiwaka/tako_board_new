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
];

export class Record {
  constructor(
    public id: string,
    public userId: string,
    public who: string,
    public type: number,
    public date: Timestamp,
    public comment: string,
    public imageName: string | null = null
  ) {}
  public getDate(): string {
    const dateObj: Date = this.date.toDate();
    const month = dateObj.getMonth() + 1; // getMonthは0始まり
    const date = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const hourStr = hour.toString().padStart(2, "0");
    const minuteStr = minute.toString().padStart(2, "0");
    return `${month}/${date} ${hourStr}:${minuteStr}`;
  }
  public getTime(): string {
    const dateObj = this.date.toDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    // const second = dateObj.getSeconds();
    return `${hour}時${minute}分`;
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
}
