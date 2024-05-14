import express from "express";
import cors from "cors";
import { serverConfig } from "../config";

import routes from "./routes";

const app = express();

app.use(cors(serverConfig.cors));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routes);

export default app;
