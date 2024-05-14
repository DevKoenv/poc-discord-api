import { type Interaction } from "discord.js";
import BaseEvent from "../base/BaseEvent";

class InteractionCreateEvent extends BaseEvent {
  name = "interactionCreate";

  async run(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = this.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.run(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  }
}

export default InteractionCreateEvent;
