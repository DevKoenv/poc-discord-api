import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

const app = Router();

app.use("/api/auth", require("./api/auth").default);
app.use("/api/users", authMiddleware, require("./api/users").default);
app.use("/api/guilds", authMiddleware, require("./api/guilds").default);

export default app;
