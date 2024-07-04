import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import app from "./server";
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
    socket.emit("log", {
      log_type: log.level,
      message: log.message,
      log_time: format(new Date(log.date)),
    });
  });
  socket.emit("log", { log_time: format(new Date(Date.now())), log_type: "daemon", message: "Connected to the server." });
});

process.on('unhandledRejection', (reason, promise) => {
  io.emit('log', { log_time: format(new Date(Date.now())), log_type: 'error', message: `Unhandled Rejection at: ${promise}, reason: ${reason}` });
});

process.on('uncaughtException', (err) => {
  io.emit('log', { log_time: format(new Date(Date.now())), log_type: 'error', message: `Uncaught Exception: ${err.message}` });
});

export { socketServer, io };
export default io;
