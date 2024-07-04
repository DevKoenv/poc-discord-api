import chalk from "chalk";
import util from "util";
import io from "../server/socket";
import { Log } from "../database";
import { format } from "./date";

class Logger {
  private static async logMessage(
    args: any[], // Accept an array of arguments
    type: string,
    color: (text: string) => string
  ): Promise<void> {
    const timestamp = new Date(Date.now());
    const date = `[${format(timestamp)}]:`;
    const coloredType = color(type.toUpperCase());
    console.log(date, coloredType, ...args);

    const log = await Log.create({
      level: type,
      message: util.format(...args),
      // stacktrace: '',
      date: new Date(timestamp),
    });
    
    io.emit("log", {
      id: log.id,
      log_level: log.level,
      log_time: format(new Date(log.date)),
      message: log.message,
      // stacktrace: '',
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
