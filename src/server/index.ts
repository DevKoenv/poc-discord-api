import { Server as httpServer } from "http";
import { socketServer } from "./socket";
import { setupSwagger } from "./swagger";
import Logger from "../utils/logger";

class Server {
  private server: httpServer;
  private port: number;

  constructor(port: number = 8080) {
    this.port = port;
    this.server = socketServer;
  }

  public async start() {
    await setupSwagger();

    this.server.listen(this.port, () => {
      Logger.ready(`Webserver is running on port ${this.port}.`);
    });
  }

  public stop() {
    this.server.close(() => {
      Logger.log(`Webserver stopped on port ${this.port}.`);
    });
  }
}

export default Server;
