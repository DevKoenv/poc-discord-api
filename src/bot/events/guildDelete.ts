import type { Guild as GuildType } from "discord.js";
import { Guild } from "../../database";
import BaseEvent from "../base/BaseEvent";

class GuildDeleteEvent extends BaseEvent {
  name = "guildDelete";

  async run(guild: GuildType) {
    Guild.destroy({
      where: {
        id: guild.id,
      },
      cascade: true,
    })
  }
}

export default GuildDeleteEvent;
