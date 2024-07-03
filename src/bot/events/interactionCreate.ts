import { type Interaction } from "discord.js";
import BaseEvent from "../base/BaseEvent";
import Logger from "../../utils/logger";

class InteractionCreateEvent extends BaseEvent {
  name = "interactionCreate";

  async run(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = this.commands.get(interaction.commandName);

      if (!command) return;

      try {
        Logger.cmd(
          "User %s executed command %s",
          interaction.user.tag,
          command.name
        );
        await command.run(interaction);
      } catch (error) {
        Logger.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  }
}

export default InteractionCreateEvent;
