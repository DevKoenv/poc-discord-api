import express from "express";
import cors from "cors";
import routes from "./routes";
import { serverConfig } from "../config";

const app = express();

app.use(cors(serverConfig.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

export default app;
