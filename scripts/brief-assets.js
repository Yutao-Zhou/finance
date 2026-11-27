import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { archivePageSize, hasContent, reportSearchText, text } from "../src/lib/reports.js";

const dataDir = resolve(fileURLToPath(new URL("../data/", import.meta.url)));
const dateModule = "virtual:brief-dates";
const resolvedDateModule = "\0" + dateModule;
const assetDirectory = "briefs/";

function archivePreview(report) {
  const title = Object.fromEntries(["zh", "en"].map((lang) => [
    lang,
    text(report.topNews?.find((story) => hasContent(story.title, lang))?.title, lang),
  ]));
  return {
    date: report.date,
    title,
    summary: report.summary,
    mood: report.judgment?.type,
  };
}

function collectBriefs() {
  const reports = readdirSync(dataDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => {
      const json = readFileSync(join(dataDir, entry.name), "utf8");
      return JSON.parse(json.replace(/^\uFEFF/, ""));
    })
    .filter((report) => /^\d{4}-\d{2}-\d{2}$/.test(report?.date))
    .sort((a, b) => b.date.localeCompare(a.date));

  const assets = new Map();
  const previews = reports.map(archivePreview);
  for (const report of reports) {
    assets.set(`reports/${report.date}.json`, JSON.stringify(report));
  }
  for (let offset = 0; offset < previews.length; offset += archivePageSize) {
    const page = offset / archivePageSize + 1;
    assets.set(`archive/${page}.json`, JSON.stringify(previews.slice(offset, offset + archivePageSize)));
  }
  assets.set("search.json", JSON.stringify(previews.map((preview, index) => ({
    ...preview,
    searchText: reportSearchText(reports[index]),
  }))));

  return { assets, dates: reports.map(({ date }) => date) };
}

export default function briefAssets() {
  let briefs;
  function getBriefs() {
    return briefs ??= collectBriefs();
  }

  return {
    name: "finance-brief-assets",
    resolveId(id) {
      if (id === dateModule) return resolvedDateModule;
    },
    load(id) {
      if (id === resolvedDateModule) {
        return `export default ${JSON.stringify(getBriefs().dates)};`;
      }
    },
    generateBundle() {
      for (const [path, source] of getBriefs().assets) {
        this.emitFile({ type: "asset", fileName: assetDirectory + path, source });
      }
    },
    configureServer(server) {
      const prefix = server.config.base + assetDirectory;
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split("?", 1)[0];
        if (!path?.startsWith(prefix)) return next();
        const source = getBriefs().assets.get(path.slice(prefix.length));
        if (source === undefined) {
          res.statusCode = 404;
          return res.end();
        }
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(source);
      });

      server.watcher.add(dataDir);
      server.watcher.on("all", (event, path) => {
        if (!["add", "change", "unlink"].includes(event) || !path.endsWith(".json") ||
          dirname(resolve(path)) !== dataDir) return;
        briefs = undefined;
        const module = server.moduleGraph.getModuleById(resolvedDateModule);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: "full-reload", path: "*" });
      });
    },
  };
}
