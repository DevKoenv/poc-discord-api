import { Guild } from "../../database";
import Logger from "../../utils/logger";
import BaseEvent from "../base/BaseEvent";

class ReadyEvent extends BaseEvent {
  name = "ready";

  async run() {
    Logger.ready("Bot is ready!")

    const guilds = this.client.guilds.cache;

    for (const guild of guilds.values()) {
      Guild.upsert({
        id: guild.id,
        name: guild.name,
        icon: guild.icon || "",
        language: "en",
        prefix: "!",
      });
    }

    this.client.user?.setActivity({
      name: "with your mama",
    });
  }
}

export default ReadyEvent;
