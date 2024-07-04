export function dateTimePad(value: number, digits: number): string {
  let number = value.toString();
  while (number.length < digits) {
    number = "0" + number;
  }
  return number;
}

export function format(tDate: Date): string {
  return (
    tDate.getFullYear() +
    "-" +
    dateTimePad(tDate.getMonth() + 1, 2) +
    "-" +
    dateTimePad(tDate.getDate(), 2) +
    " " +
    dateTimePad(tDate.getHours(), 2) +
    ":" +
    dateTimePad(tDate.getMinutes(), 2) +
    ":" +
    dateTimePad(tDate.getSeconds(), 2) +
    "." +
    dateTimePad(tDate.getMilliseconds(), 3)
  );
}
