import { Router } from "express";
import { Guild } from "../../../database";

const app = Router();

app.get("/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const guild = await Guild.findOne({
    where: { id: req.params.id },
  });

  if (!guild) {
    return res.status(404).json({ error: "Guild not found" });
  }

  return res.json(guild);
  /*
    #swagger.responses[200] = {
      description: 'Guild found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            $ref: '#/components/schemas/Guild'
          }
        }
      }
    }
  */
});

app.put("/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const guild = await Guild.findOne({
    where: { id: req.params.id },
  });

  if (!guild) {
    return res.status(404).json({ error: "Guild not found" });
  }

  await guild.update(req.body);

  return res.json(guild);
  /*
    #swagger.responses[200] = {
      description: 'Guild updated',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            $ref: '#/components/schemas/Guild'
          }
        }
      }
    }
  */
});

app.get("/:id/commands", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const guild = await Guild.findOne({ where: { id: req.params.id } });

  if (!guild) {
    return res.status(404).json({ error: "Guild not found" });
  }

  const commands = await guild.getCommands();

  return res.json(commands);
  /*
    #swagger.responses[200] = {
      description: 'Commands found',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Command'
            }
          }
        }
      }
    }
  */
});

app.get("/:id/commands/:commandId", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing id" });
  }
  if (!req.params.commandId) {
    return res.status(400).json({ error: "Missing commandId" });
  }

  const guild = await Guild.findOne({ where: { id: req.params.id } });

  if (!guild) {
    return res.status(404).json({ error: "Guild not found" });
  }

  const command = await guild.getCommands({
    where: { id: req.params.commandId },
  });

  if (!command.length) {
    return res.status(404).json({ error: "Command not found" });
  }

  return res.json(command[0]);
  /*
    #swagger.responses[200] = {
      description: 'Command found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            $ref: '#/components/schemas/Command'
          }
        }
      }
    }
  */
});

app.post("/:id/commands", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing id" });
  }
  if (!req.body.trigger) {
    return res.status(400).json({ error: "Missing trigger" });
  }
  if (!req.body.response) {
    if (!req.body.response.content || req.body.response.embeds.length === 0) {
      return res.status(400).json({ error: "Missing response" });
    }
  }

  const guild = await Guild.findOne({ where: { id: req.params.id } });

  if (!guild) {
    return res.status(404).json({ error: "Guild not found" });
  }

  if (req.body.trigger.startsWith(guild.prefix)) {
    return res
      .status(400)
      .json({ error: "Trigger cannot start with the prefix" });
  }

  const existingCommand = await guild.getCommands({
    where: { trigger: req.body.trigger },
  });

  if (existingCommand.length) {
    return res.status(400).json({ error: "Command already exists" });
  }

  const command = await guild.createCommand({
    trigger: req.body.trigger,
    response: req.body.response,
    interaction: req.body.interaction || undefined,
  });

  return res.json(command);
  /*
    #swagger.responses[200] = {
      description: 'Command created',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            $ref: '#/components/schemas/Command'
          }
        }
      }
    }
  */
});

app.put("/:id/commands/:commandId", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing id" });
  }
  if (!req.params.commandId) {
    return res.status(400).json({ error: "Missing commandId" });
  }

  const guild = await Guild.findOne({ where: { id: req.params.id } });

  if (!guild) {
    return res.status(404).json({ error: "Guild not found" });
  }

  const command = await guild.getCommands({
    where: { id: req.params.commandId },
  });

  if (!command.length)
    return res.status(404).json({ error: "Command not found" });

  if (req.body.trigger && req.body.trigger.startsWith(guild.prefix)) {
    return res
      .status(400)
      .json({ error: "Trigger cannot start with the prefix" });
  }
  if (req.body.response && !req.body.response.content) {
    return res.status(400).json({ error: "Missing response content" });
  }

  await command[0].update({
    trigger: req.body.trigger || command[0].trigger,
    response: req.body.response || command[0].response,
    interaction: req.body.interaction || command[0].interaction,
  });

  return res.json(command[0]);
  /*
    #swagger.responses[200] = {
      description: 'Command updated',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            $ref: '#/components/schemas/Command'
          }
        }
      }
    }
  */
});

app.delete(":id/commands/:commandId", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing id" });
  }
  if (!req.params.commandId) {
    return res.status(400).json({ error: "Missing commandId" });
  }

  const guild = await Guild.findOne({ where: { id: req.params.id } });

  if (!guild) {
    return res.status(404).json({ error: "Guild not found" });
  }

  const command = await guild.getCommands({
    where: { id: req.params.commandId },
  });

  if (!command.length)
    return res.status(404).json({ error: "Command not found" });

  await command[0].destroy();

  return res.json({ success: true });
  /*
    #swagger.responses[200] = {
      description: 'Command deleted',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: { type: 'boolean' }
            }
          }
        }
      }
    }
  */
});

export default app;
