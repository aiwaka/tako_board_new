export const fillZero = (num: number, digit: number): string => {
  // digit桁になるように0埋めした文字列を返す. num, digitは整数の前提.
  return ("0".repeat(digit - 1) + num).slice(-digit);
};

export const toDateString = (date: Date): string => {
  // input[type='date']で用いる日付文字列に変換する
  return (
    `${date.getFullYear()}-${fillZero(date.getMonth() + 1, 2)}` +
    `-${fillZero(date.getDate(), 2)}`
  );
};

export const toTimeString = (time: Date): string => {
  // input[type='time']で用いる時刻文字列に変換する. 秒は用いない.
  return (
    `${fillZero(time.getHours(), 2)}` + `:${fillZero(time.getMinutes(), 2)}`
  );
};
