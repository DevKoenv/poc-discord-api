import { Client, Collection } from "discord.js";

abstract class BaseEvent {
  constructor(protected client: Client, protected commands: Collection<string, any>) {}

  abstract name: string;

  abstract run(...args: any[]): void;
}

export default BaseEvent;