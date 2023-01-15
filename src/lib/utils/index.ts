import { getUserName } from "./get-username";
import { setDescription } from "./set-title-description";
import { toDateString, toTimeString, fillZero } from "./utils";

export { getUserName, setDescription, toDateString, toTimeString, fillZero };

/**
 * 日付データをフォーマットした文字列を返す. このアプリで共通で用いる.
 * @param date: Date
 * @returns "yyyy-mm-dd"形式の文字列
 */
export const getDateText = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
