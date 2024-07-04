import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import app from "./server";
// import { Log } from "../database/models/Log";
import { serverConfig } from "../config";
import { Log } from "../database";
import { format } from "../utils/date";

const socketServer = createServer(app);
const io = new IOServer(socketServer, {
  cors: serverConfig.cors,
});

io.on("connection", async (socket) => {
  const logs = await Log.findAll({
    limit: 50,
    order: [["date", "DESC"]],
  });
  logs.reverse().forEach((log) => {
    io.emit("log", {
      log_type: log.level,
      message: log.message,
      log_time: format(new Date(log.date)),
    });
  });
});

process.on('unhandledRejection', (reason, promise) => {
  io.emit('log', { log_type: 'error', message: `Unhandled Rejection at: ${promise}, reason: ${reason}` });
});

process.on('uncaughtException', (err) => {
  io.emit('log', { log_type: 'error', message: `Uncaught Exception: ${err.message}` });
});

export { socketServer, io };
export default io;
