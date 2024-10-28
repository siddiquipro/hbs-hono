import { Hono } from "hono";
import { hbs } from "./utils/hbs.js";
import { compress } from "hono/compress";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();
app.use("*", compress());

app.use("*", serveStatic({ root: "./public" }));

app.get("/", (c) => c.html(hbs.render("home", { message: "Hello World" })));

export default app;
