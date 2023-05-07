import type { Timestamp } from "@firebase/firestore";

/** レコードタイプの番号と表示文字列を紐付けるリスト */
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
] as const;
/** レコードに組み合わせて追加するのを許可するタイプ番号の対のリスト. */
export const possibleTypePairList = [
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [3, 4],
  [3, 5],
  [3, 6],
  // [4, 5] : トイレ掃除二種は両立不可能とする
  [4, 6],
  [5, 6],
  [7, 8],
] as const;
/** 組み合わせを許可する番号対の隣接行列 */
export const possibleTypePairAdjacencyMatrix = ((list: typeof possibleTypePairList) => {
  const result = recordTypeStrList.map(() => recordTypeStrList.map(() => false));
  for (const pair of list) {
    result[pair[0]][pair[1]] = true;
    result[pair[1]][pair[0]] = true;
  }
  return result;
})(possibleTypePairList);

export interface RecordSchema {
  /**
   * スキーマタイプのバージョン番号.
   * 1: recordTypeを単一の数値で保持する.
   * 2: recordTypeを数値の配列で保持する.
   */
  version: 1 | 2;
  id: string;
  userId: string;
  userName: string;
  recordType: number | number[];
  recordDate: Timestamp;
  actualDate: Timestamp;
  comment: string;
  imageName: string | null;
}

export class Record implements RecordSchema {
  constructor(
    public version: 1 | 2,
    public id: string,
    public userId: string,
    public userName: string,
    public recordType: number | number[],
    public recordDate: Timestamp,
    public actualDate: Timestamp,
    public comment: string,
    public imageName: string | null = null
  ) {}
  /**
   * `display`なら表示時刻, `actual`なら実際の入力時刻を整形して取得する.
   * @param flag `display`か`actual`のいずれか.
   */
  private getDate(flag: "display" | "actual"): string {
    const dateObj: Date = flag === "display" ? this.recordDate.toDate() : this.actualDate.toDate();
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
  static computedTypeStr(num: number) {
    if (num === 0) {
      // コメントのみは表示しないことにする.
      return "";
    }
    // トイレ掃除は長いので省略表記
    if (num === 4) {
      return "トイレ";
    }
    if (num === 5) {
      return "トイレ(簡)";
    }
    return recordTypeStrList[num];
  }
  static computedFullTypeStr(num: number) {
    return recordTypeStrList[num];
  }
  private getTypeByMethod(method: (num: number) => string): string {
    if (this.version === 1) {
      const recordType = this.recordType as number;
      return method(recordType);
    } else if (this.version === 2) {
      const recordTypeList = this.recordType as number[];
      const result = [];
      for (const num of recordTypeList) {
        result.push(method(num));
      }
      return result.join(", ");
    } else {
      throw new Error("バージョンが不正です");
    }
  }
  public getType(): string {
    return this.getTypeByMethod(Record.computedTypeStr);
  }
  /**
   * 完全な名前のタイプを取得
   */
  public getFullType(): string {
    return this.getTypeByMethod(Record.computedFullTypeStr);
  }
}
