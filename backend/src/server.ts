import { createApp } from "./http/app.js";
import { SqliteRepository } from "./infrastructure/sqlite-repository.js";
import { config } from "./config.js";
const repository = new SqliteRepository(config.databasePath);
const server = createApp(repository, config).listen(
  config.port,
  "127.0.0.1",
  () => console.log(`StarShop API: http://localhost:${config.port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(() => {
      repository.close();
      process.exit(0);
    }),
  );
