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

/**
 * 現在のタイプ番号セットに対して組み合わせられるタイプ番号のインデックスがtrueとなる配列を返す.
 * @param numSet タイプ番号のリスト
 */
const getPossibleTypeNumList = (numSet: Set<number>) => {
  // 集合が空の場合すべてtrueとなるのでOK.
  const result = possibleTypePairAdjacencyMatrix.map(() => true);
  for (const num of numSet) {
    for (let i = 0; i < result.length; i++) {
      // 一つでもfalseなら最終的にfalseになる
      result[i] &&= possibleTypePairAdjacencyMatrix[num][i];
    }
  }
  return result;
};

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
    public imageName: string | null = null,
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
  /** タイプ番号から簡易版の文字列を返す. */
  static computedTypeStr(num: number) {
    switch (num) {
      case 0:
        return "";
      case 4:
        return "トイレ";
      case 5:
        return "トイレ(簡)";
      default:
        return recordTypeStrList[num];
    }
  }
  static computedTypeStrFull(num: number) {
    return recordTypeStrList[num];
  }
  /**
   * 表示するお世話タイプの文字列を作る.
   * スキーマバージョンやオプション指定により変化する.
   * @param option
   * @param full 完全文字列を使うかどうか
   * @param threshold 文字数制限。1より大きくなければならない。超過した場合は「他」が付与され、それを含めて超過しない。
   */
  public getTypeStr(option: { full?: boolean; threshold?: number } = {}): string {
    // 完全文字列指定かどうかで用いるメソッドを分ける
    const getStrMethod = option.full ? Record.computedTypeStrFull : Record.computedTypeStr;
    if (this.version === 1) {
      const recordType = this.recordType as number;
      return getStrMethod(recordType);
    } else if (this.version === 2) {
      const threshold = option.threshold;
      const recordTypeStrList = (this.recordType as number[]).map((typeNum) =>
        getStrMethod(typeNum),
      );
      if (recordTypeStrList.length === 0) return "";
      // 文字数制限を超えないように文字列の配列の部分配列を作る。
      const usingTypeStrList = recordTypeStrList.reduce((accum, typeStr) => {
        // accumに含まれる文字列の長さの合計
        const accumLength = accum.reduce((total, s) => total + s.length, 0);
        if (threshold && accumLength + typeStr.length > threshold - 1) {
          // 最後の要素かつ長さが1の場合だけは追加（最終的に変わらないため）
          if (recordTypeStrList.length - accum.length === 1 && typeStr.length === 1) {
            accum.push(typeStr);
          }
          return accum;
        } else {
          accum.push(typeStr);
          return accum;
        }
      }, [] as string[]);
      // 部分配列の長さがもとと違っていれば「他」を追加
      if (usingTypeStrList.length != recordTypeStrList.length) {
        usingTypeStrList.push("他");
      }
      const resultStr = usingTypeStrList.join(", ");

      return resultStr;
    } else {
      throw new Error("バージョンが不正です");
    }
  }
}

export { getPossibleTypeNumList };
