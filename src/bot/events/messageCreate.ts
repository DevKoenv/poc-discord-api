import {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import BaseEvent from "../base/BaseEvent";
import { Guild } from "../../database";
import executeCode from "../../utils/vm";
import type { ResponseJson } from "../../../types/command";
import Logger from "../../utils/logger";

class MessageCreateEvent extends BaseEvent {
  name = "messageCreate";

  async run(message: Message) {
    // Check if the message author is a bot
    if (message.author.bot) return;

    // Get the guild-specific prefix from the database
    const guild = await Guild.findOne({ where: { id: message.guild?.id } });

    // Check if the guild exists
    if (!guild) return;

    // Get the prefix and custom commands for the guild
    const prefix = guild.prefix;
    const customCommands = await guild.getCommands();

    // Check if the message starts with the prefix
    if (!message.content.startsWith(prefix)) return;

    // Split the message content into a trigger and arguments
    const [trigger, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/);

    // Check if the command is a custom command for the guild
    const command = customCommands.find(
      (command) => command.trigger === trigger
    );

    if (command) {
      Logger.cmd(
        "User %s executed custom command %s",
        message.author.tag,
        trigger
      );

      // Get the response JSON from the command
      if (typeof command.response === "string") {
        // Parse the response JSON if it's a string
        try {
          command.response = JSON.parse(command.response);
        } catch (error) {
          Logger.error(error);
          return;
        }
      }
      const responseJson: ResponseJson = command.response;

      // Check if the response JSON is empty
      if (!responseJson) return;

      // Create embeds using EmbedBuilder
      // Function to replace "${x}" with args[x] where x is a number
      function replaceArgs(str: string, args: any[]): string {
        return str.replace(/\$\{(\d+)\}/g, (match, group1) => {
          const index = parseInt(group1);
          return args[index - 1] !== undefined ? args[index - 1] : match;
        });
      }

      // Replace "${x}" with args[x] in content
      responseJson.content = replaceArgs(responseJson.content, args);

      // Create embeds using EmbedBuilder
      const embeds = responseJson.embeds
        ? responseJson.embeds.map((embedData) => {
            const embed = new EmbedBuilder();

            // Check if each field exists before using it
            if (embedData.color) {
              const colorInt = parseInt(embedData.color.replace("#", ""), 16);
              embed.setColor(colorInt);
            }
            if (embedData.title) embed.setTitle(embedData.title);
            if (embedData.description)
              embed.setDescription(embedData.description);
            if (embedData.url) embed.setURL(embedData.url);
            if (embedData.timestamp)
              embed.setTimestamp(new Date(embedData.timestamp));
            if (embedData.thumbnail)
              embed.setThumbnail(embedData.thumbnail.url);
            if (embedData.image) embed.setImage(embedData.image.url);
            if (embedData.author) embed.setAuthor(embedData.author);
            if (embedData.footer) embed.setFooter(embedData.footer);
            if (embedData.fields) {
              embed.addFields(
                embedData.fields.map((field) => ({
                  name: field.name,
                  value: field.value,
                  inline: field.inline || false,
                }))
              );
            }

            return embed;
          })
        : [];

      // Create components using ActionRowBuilder and ButtonBuilder
      const components = responseJson.components
        ? responseJson.components.map((componentRow) => {
            const row = new ActionRowBuilder<
              ButtonBuilder | StringSelectMenuBuilder
            >();
            componentRow.forEach((componentData) => {
              if (componentData.type === 2) {
                // Button
                const button = new ButtonBuilder()
                  .setCustomId(componentData.customId)
                  .setLabel(componentData.label)
                  .setStyle(componentData.style);
                row.addComponents(button);
              } else if (componentData.type === 3) {
                // Select Menu
                const selectMenu = new StringSelectMenuBuilder()
                  .setCustomId(componentData.customId)
                  .setPlaceholder("Select an option");

                // Conditional checks for optional fields
                if (componentData.minValues)
                  selectMenu.setMinValues(componentData.minValues);
                if (componentData.maxValues)
                  selectMenu.setMaxValues(componentData.maxValues);

                selectMenu.addOptions(
                  componentData.options.map((option) => {
                    const optionBuilder = new StringSelectMenuOptionBuilder()
                      .setLabel(option.label)
                      .setValue(option.value);

                    if (option.description)
                      optionBuilder.setDescription(option.description);
                    if (option.emoji) optionBuilder.setEmoji(option.emoji);
                    if (option.default)
                      optionBuilder.setDefault(option.default);

                    return optionBuilder;
                  })
                );

                row.addComponents(selectMenu);
              }
            });
            return row;
          })
        : [];

      // Send message with embeds and components
      const response = await message.reply({
        allowedMentions: { repliedUser: false },
        content: responseJson.content,
        embeds: embeds,
        components: components,
      });

      // Create a message component collector if there are any components
      if (
        !responseJson.components ||
        !responseJson.components.length ||
        !command.interaction
      )
        return;

      // Create a message component collector
      const collector = response.createMessageComponentCollector({
        time: 60000,
      });

      // Listen for component interactions
      collector.on("collect", async (interaction) => {
        // Execute user code in a sandboxed environment to prevent malicious code execution
        // The user code are code snippets that are provided by the user for handling the interaction
        await executeCode(command.interaction, interaction);
      });

      // Remove components when the collector is finished
      collector.on("end", async () => {
        await response.edit({ components: [] });
      });
    }
  }
}

export default MessageCreateEvent;
