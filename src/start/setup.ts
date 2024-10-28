import { hbs } from "../utils/hbs.js";
import { env } from "./env.js";

export function setup() {
  setupHandlebars();
}

// partials from root directory
const partials = ["./hbs/partials"];

function setupHandlebars() {
  //register all the partials
  partials.forEach((partial) => {
    hbs.registerPartials(partial);
  });

  //handle all the globals
  hbs.setGlobals({ env: env });
}
