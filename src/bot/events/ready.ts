import { Guild } from "../../database";
import BaseEvent from "../base/BaseEvent";

class ReadyEvent extends BaseEvent {
  name = "ready";

  async run() {
    console.log("Bot is ready!");

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
