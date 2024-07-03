import type { Guild as GuildType } from "discord.js";
import { Guild } from "../../database";
import BaseEvent from "../base/BaseEvent";
import Logger from "../../utils/logger";

class GuildCreateEvent extends BaseEvent {
  name = "guildCreate";

  async run(guild: GuildType) {
    Logger.bot("Joined new guild: %s", guild.name);
    
    Guild.upsert({
      id: guild.id,
      name: guild.name,
      icon: guild.icon || "",
      language: "en",
      prefix: "!",
    });
  }
}

export default GuildCreateEvent;
