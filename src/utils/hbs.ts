import handlebars from "handlebars";
import { env } from "../start/env.js";
import fs from "node:fs";
import { join } from "node:path";

const globalState: Record<string, any> = {};

const store = new Map();

class HBS {
  public registerPartials(path: string) {
    const partialsPath = join(env.rootPath, path);
    const files = fs.readdirSync(partialsPath);

    files.forEach((file) => {
      const [name, extension] = file.split(".");
      if (extension !== "hbs") return;

      const raw = fs.readFileSync(partialsPath + "/" + file, "utf-8");
      console.log("registering partial:: ", name);
      handlebars.registerPartial(name, this.compileRaw(raw));
    });
  }

  public setGlobals(data: Record<string, any>) {
    Object.assign(globalState, data);
  }

  private getReqData() {
    return { app: "hono hbs" };
  }

  private getFile(fileName: string) {
    const hbsPath = join(env.rootPath, "views", fileName + ".hbs");
    const raw = fs.readFileSync(hbsPath, "utf-8");
    return raw;
  }

  private compileRaw(raw: string) {
    return handlebars.compile(raw);
  }

  private getTemplate(filename: string) {
    if (env.inProduction && store.has(filename)) return store.get(filename);

    const rawTemplate = this.getFile(filename);
    const compiled = this.compileRaw(rawTemplate);

    store.set(filename, compiled);
    return compiled;
  }

  private getLayoutName(filename = "main") {
    return "layouts/" + filename;
  }

  render(name: string, data: any) {
    // get request scoped data
    const reqData = this.getReqData();

    // render layout and page with handlebars data
    const payload = { ...globalState, ...reqData, ...data };

    //render page with handlebars data
    const template = this.getTemplate(name);
    const pageSlotHTML = template(payload);

    // render with layout
    const layoutFileName = this.getLayoutName();
    const layoutTemplate = this.getTemplate(layoutFileName);
    const html = layoutTemplate({ ...payload, mainSlot: pageSlotHTML });
    return html;
  }
}

export const hbs = new HBS();
