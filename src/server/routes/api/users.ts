import { Router } from "express";
import { Guild } from "../../../database";

const app = Router();

app.get("/me", async (req, res) => {
  return res.json(res.locals.user);
  /*
    #swagger.responses[200] = {
      description: 'Users found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            $ref: '#/components/schemas/User'
          }
        }
      }
    }
  */
});

app.get("/me/guilds", async (req, res) => {
  const response = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${res.locals.token.access_token}`,
    },
  });

  if (!response.ok) {
    return res
      .status(response.status)
      .json({ message: "Failed to fetch guilds" });
  }

  const guilds = await response.json().then((guilds: any) => {
    return guilds.filter((guild: any) => (guild.permissions & 0x8) === 0x8);
  });

  const botGuilds = await Guild.findAll({
    where: {
      id: guilds.map((guild: any) => guild.id),
    },
  });

  return res.json(botGuilds);
  /*
    #swagger.responses[200] = {
      description: 'Guilds found',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Guild'
            }
          }
        }
      }
    }
  */
});

export default app;
