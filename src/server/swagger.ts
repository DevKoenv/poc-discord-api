import swaggerAutogen from "swagger-autogen";
import swaggerUi from "swagger-ui-express";
import path from "path";
import app from "./server";
import schemas from "../swagger/schemas";

async function setupSwagger() {
  const doc = {
    info: {
      title: "POC-Discord API",
      description: "API for the POC-Discord project",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.NODE_ENV !== "production" ? "http://localhost:8080/" : "http://backend:8080/",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      "@schemas": schemas,
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };

  const outputFile = path.join(__dirname, "../swagger-output.json");
  const endpointsFiles = ["./src/server/routes/index.ts"];

  if (process.env.NODE_ENV !== "production") {
    await swaggerAutogen({ openapi: "3.0.3", disableLogs: true })(outputFile, endpointsFiles, doc);
  }

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(require(outputFile)));
}

export { setupSwagger };
