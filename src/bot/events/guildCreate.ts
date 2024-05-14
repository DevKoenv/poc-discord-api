import type { Guild as GuildType } from "discord.js";
import { Guild } from "../../database";
import BaseEvent from "../base/BaseEvent";

class GuildCreateEvent extends BaseEvent {
  name = "guildCreate";

  async run(guild: GuildType) {
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
