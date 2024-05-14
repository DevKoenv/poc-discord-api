import { Server as httpServer } from "http";
import { socketServer } from "./socket";
import { setupSwagger } from "./swagger";

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
      console.log(`Server is running on port ${this.port}.`);
    });
  }

  public stop() {
    this.server.close(() => {
      console.log(`Server stopped on port ${this.port}.`);
    });
  }
}

export default Server;
