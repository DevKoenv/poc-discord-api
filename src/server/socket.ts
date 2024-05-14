import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import app from "./server";
// import { Log } from "../database/models/Log";
import { serverConfig } from "../config";

const socketServer = createServer(app);
const io = new IOServer(socketServer, {
  cors: serverConfig.cors,
});

io.on("connection", async (socket) => {
  // const logs = await Log.findAll({
  //   limit: 50,
  //   order: [["timestamp", "DESC"]],
  // });
  // logs.reverse().forEach((log) => {
  //   io.emit("log", {
  //     log_level: log.level,
  //     message: log.message,
  //     log_time: log.timestamp.toISOString().replace("T", " ").split(".")[0],
  //     stacktrace: log.stacktrace,
  //   });
  // });
});

export { socketServer, io };
export default io;
