import type { Request, Response, NextFunction } from "express";
import { decodeToken } from "../../utils/jwt";
import { Role, User } from "../../database";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /*
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
    }
  */

  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const decodedToken = await decodeToken(token);
  if (!decodedToken) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const payload = decodedToken.payload;

  if (!payload.id || !payload.refresh_token) {
    return res
      .status(401)
      .json({ error: "Missing properties in the token payload" });
  }

  let dbUser = await User.findOne({
    where: {
      id: payload.id,
      refreshToken: payload.refresh_token as string,
    },
    include: {
      model: Role,
      through: {
        attributes: [],
      },
    },
  });

  if (!dbUser) {
    return res.status(403).json({ error: "User not found" });
  }

  res.locals.bearer = token; // Attach the token to the request object
  res.locals.token = payload; // Attach the payload to the request object
  res.locals.user = dbUser; // Attach the user to the request object
  next();
};
