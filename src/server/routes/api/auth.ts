import { discordConfig } from "../../../config";
import { generateEncryptedToken } from "../../../utils/jwt";
import { Role, User } from "../../../database";
import { Router } from "express";

const app = Router();

app.post("/token", async (req, res) => {
  /*
    #swagger.security = []
  */

  const { code, redirect_uri } = req.body;

  if (!code || !redirect_uri) {
    return res.status(422).json({ error: "Missing parameters" });
  }

  const data = {
    client_id: discordConfig.client_id,
    client_secret: discordConfig.client_secret,
    grant_type: "authorization_code",
    code,
    redirect_uri,
  };

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return null;
    }
  });

  if (!response) {
    return res.status(400).json({ error: "Bad request" });
  }

  // get the user from discord, and save the user in the database
  const apiUser = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${response.access_token}`,
    },
  }).then((res) => res.json());

  // map the API response to the database fields
  const dbUser = {
    id: apiUser.id,
    username: apiUser.username,
    globalName: apiUser.global_name,
    avatar: apiUser.avatar,
    email: apiUser.email,
    refreshToken: response.refresh_token,
  };

  // Find the user in the database
  let user = await User.findOne({ where: { id: dbUser.id } });

  // If the user doesn't exist, create a new one
  if (!user) {
    user = await User.create({
      id: dbUser.id,
      username: dbUser.username,
      globalName: dbUser.globalName,
      avatar: dbUser.avatar,
      email: dbUser.email,
      refreshToken: dbUser.refreshToken,
    });

    const userRole = await Role.findOne({ where: { name: "USER" } });
    const adminRole = await Role.findOne({ where: { name: "ADMIN" } });
    if (userRole && adminRole) {
      await user.setRoles([userRole, adminRole]);
    }
  } else {
    // If the user exists, update it
    await user.update({
      username: dbUser.username,
      globalName: dbUser.globalName,
      avatar: dbUser.avatar,
      email: dbUser.email,
      refreshToken: dbUser.refreshToken,
    });
  }

  response.id = dbUser.id;

  const token = await generateEncryptedToken(response);

  if (token) {
    return res.json({ token });
    /*
      #swagger.responses[200] = {
        description: 'Token generated',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    */
  }

  return res.status(500).json({ error: "Failed to generate token" });
});

export default app;
