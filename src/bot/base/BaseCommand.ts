import { CommandInteraction, Client, type ApplicationCommandOptionData } from "discord.js";

abstract class BaseCommand {
  constructor(protected client: Client) {}

  abstract name: string;
  abstract description: string;
  options?: ApplicationCommandOptionData[] = [];

  abstract run(interaction: CommandInteraction): void;
}

export default BaseCommand;