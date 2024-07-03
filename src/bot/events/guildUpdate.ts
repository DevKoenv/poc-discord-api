import type { Guild as GuildType } from "discord.js";
import BaseEvent from "../base/BaseEvent";
import { Guild } from "../../database";
import Logger from "../../utils/logger";

class GuildUpdateEvent extends BaseEvent {
  name = "guildUpdate";

  async run(oldGuild: GuildType, newGuild: GuildType) {
    Logger.bot("Guild %s updated!", newGuild.name);

    // Update the guild in the database
    const guild = await Guild.findOne({
      where: {
        id: oldGuild.id,
      },
    });

    if (guild) {
      await guild.update({
        name: guild.name,
        icon: guild.icon || "",
      });
    }
  }
}

export default GuildUpdateEvent;