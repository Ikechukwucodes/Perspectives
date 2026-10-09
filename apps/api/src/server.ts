import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

await connectDatabase();

createApp().listen(env.API_PORT, () => {
  console.log(`PERSPECTIVES API listening on port ${env.API_PORT}`);
});
