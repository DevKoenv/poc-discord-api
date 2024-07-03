import { Client, Message } from "discord.js";

abstract class BaseCommand {
  protected client: Client;
  protected category: string = __dirname.split("/").pop() || "Other";

  abstract name: string;
  abstract description: string;
  abstract enabled: boolean;
  abstract aliases: string[];
  abstract ownerOnly: boolean;

  abstract run(message: Message): void;

  constructor(client: Client) {
    this.client = client;
  }
}

export default BaseCommand;
