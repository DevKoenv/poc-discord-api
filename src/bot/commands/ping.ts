import {
  ApplicationCommandOptionType,
  CommandInteraction,
  type ApplicationCommandOptionData,
} from "discord.js";
import BaseCommand from "../base/BaseCommand";
import Logger from "../../utils/logger";

class PingCommand extends BaseCommand {
  name = "ping";
  description = "Replies with Pong!";
  options = [
    {
      type: ApplicationCommandOptionType.String.valueOf(),
      name: "input",
      description: "The input to echo back",
      required: false,
    },
  ];

  async run(interaction: CommandInteraction) {
    const { options } = interaction;
    const subcommand = options.get("input")?.value;

    if (subcommand) {
      interaction.reply(`You said: ${subcommand}`);
      Logger.log(`User ${interaction.user.tag} used the ping command with the input: ${subcommand}`)
      return;
    }

    return interaction.reply("Pong!");
  }
}

export default PingCommand;
