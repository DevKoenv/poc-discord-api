import { Client, GatewayIntentBits, Collection } from "discord.js";
import { discordConfig } from "../config";
import { readdirSync } from "fs";
import { join } from "path";

class DiscordBot {
  private client: Client;
  private commands = new Collection<string, any>();

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.loadEvents();
    this.loadSlashCommands();
  }

  private loadEvents() {
    const eventFiles = readdirSync(join(__dirname, "events"));

    for (const file of eventFiles) {
      const EventClass = require(`./events/${file}`).default;
      const event = new EventClass(this.client, this.commands);
      this.client.on(event.name, (...args: any[]) => event.run(...args));
    }
  }

  private loadSlashCommands() {
    const slashCommandFiles = readdirSync(join(__dirname, "commands"));

    for (const file of slashCommandFiles) {
      const CommandClass = require(`./commands/${file}`).default;
      const command = new CommandClass(this.client);
      this.commands.set(command.name, command);
    }
  }

  private async registerSlashCommands() {
    if (!this.client.application) return;

    // Unregister all the commands first to avoid conflicts
    for (const command of this.commands.values()) {
      await this.client.application.commands.cache
        .find((c) => c.name === command.name)
        ?.delete();
    }

    for (const command of this.commands.values()) {
      await this.client.application.commands.create({
        name: command.name,
        description: command.description,
        options: command.options,
      });
    }
  }

  public async start() {
    await this.client.login(discordConfig.bot_token);
    await this.registerSlashCommands();
  }

  public async stop() {
    await this.client.destroy();
  }
}

export default DiscordBot;
