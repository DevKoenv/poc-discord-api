import { Client, GatewayIntentBits, Collection } from "discord.js";
import { discordConfig } from "../config";
import { readdirSync, lstatSync } from "fs";
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
    this.loadCommands(join(__dirname, "commands"));
  }

  private loadEvents() {
    const eventFiles = readdirSync(join(__dirname, "events"));

    for (const file of eventFiles) {
      const EventClass = require(`./events/${file}`).default;
      const event = new EventClass(this.client, this.commands);
      this.client.on(event.name, (...args: any[]) => event.run(...args));
    }
  }

  private loadCommands(directory: string) {
    const commandFiles = readdirSync(directory);

    for (const file of commandFiles) {
      const fullPath = join(directory, file);
      if (lstatSync(fullPath).isDirectory()) {
        this.loadCommands(fullPath); // Recursively load commands from subdirectories
      } else if (file.endsWith(".ts") || file.endsWith(".js")) {
        const CommandClass = require(fullPath).default;
        const command = new CommandClass();
        this.commands.set(command.name, command); // Assuming each command class has a 'name' property
      }
    }
  }

  public async start() {
    await this.client.login(discordConfig.bot_token);
  }

  public async stop() {
    await this.client.destroy();
  }
}

export default DiscordBot;
