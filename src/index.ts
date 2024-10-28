import { serve } from "@hono/node-server";
import app from "./app.js";
import { env } from "./start/env.js";
import { setup } from "./start/setup.js";

const port = env.PORT;

setup();

serve({ fetch: app.fetch, port }, () => console.log(`Server is running on http://localhost:${port}`));
