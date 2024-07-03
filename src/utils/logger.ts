import chalk from "chalk";
import util from "util";
import io from "../server/socket";

function dateTimePad(value: number, digits: number): string {
  let number = value.toString();
  while (number.length < digits) {
    number = "0" + number;
  }
  return number;
}

function format(tDate: Date): string {
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

class Logger {
  private static logMessage(
    args: any[], // Accept an array of arguments
    type: string,
    color: (text: string) => string
  ): void {
    const date = `[${format(new Date(Date.now()))}]:`;
    const coloredType = color(type.toUpperCase());
    console.log(date, coloredType, ...args);

    io.emit("log", {
      id: Date.now(),
      log_time: format(new Date(Date.now())),
      log_type: type,
      message: util.format(...args),
    });
  }

  static log(...args: any[]): void {
    this.logMessage(args, "log", chalk.bgBlue);
  }

  static warn(...args: any[]): void {
    this.logMessage(args, "warn", chalk.black.bgYellow);
  }

  static error(...args: any[]): void {
    this.logMessage(args, "error", chalk.black.bgRed);
  }

  static debug(...args: any[]): void {
    this.logMessage(args, "debug", chalk.green);
  }

  static cmd(...args: any[]): void {
    this.logMessage(args, "cmd", chalk.black.bgWhite);
  }

  static db(...args: any[]): void {
    this.logMessage(args, "db", chalk.black.bgCyan);
  }

  static bot(...args: any[]): void {
    this.logMessage(args, "bot", chalk.black.bgCyan);
  }

  static web(...args: any[]): void {
    this.logMessage(args, "web", chalk.black.bgCyan);
  }

  static ready(...args: any[]): void {
    this.logMessage(args, "ready", chalk.black.bgGreen);
  }
}

export default Logger;
