import Server from "./server";
import Database from "./database";
import DiscordBot from "./bot";

let database: Database | null = null;
let bot: DiscordBot | null = null;
let server: Server | null = null;

async function startApp() {
  try {
    database = new Database();
    await database.start();

    bot = new DiscordBot();
    await bot.start();

    server = new Server();
    await server.start();

    console.log("App started! " + new Date().toISOString());
  } catch (error) {
    console.error(error);

    await stopApp();
  }
}

async function stopApp() {
  try {
    if (bot) {
      await bot.stop();
    }

    if (server) {
      server.stop();
    }

    if (database) {
      await database.stop();
    }
  } catch (error) {
    console.error(error);
  } finally {
    return process.exit(1);
  }
}

process.on("SIGINT", stopApp);
process.on("SIGTERM", stopApp);

(async () => {
  await startApp();
})();
