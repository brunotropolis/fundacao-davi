// Publica o Worker proxy e liga o dominio. Uso: node fundacao-davi/deploy.mjs (a partir de D:\CLAUDE)
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync("D:/CLAUDE/.env.meta", "utf8").split(/\r?\n/)
  .filter(l => /^[A-Z0-9_]+=/.test(l)).map(l => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, "")]; }));
const TOKEN = env.CLOUDFLARE_WORKERS_TOKEN, ACCT = env.CLOUDFLARE_ACCOUNT_ID, ZONE = env.CLOUDFLARE_ZONE_BRUNOTROPOLIS;
const NAME = "fundacao-davi", HOST = "fundacao.brunotropolis.com.br";
const api = "https://api.cloudflare.com/client/v4";
const fd = new FormData();
fd.append("metadata", new Blob([JSON.stringify({ main_module: "index.js", compatibility_date: "2024-01-01" })], { type: "application/json" }));
fd.append("index.js", new Blob([readFileSync(new URL("./worker.js", import.meta.url))], { type: "application/javascript+module" }), "index.js");
let r = await fetch(`${api}/accounts/${ACCT}/workers/scripts/${NAME}`, { method: "PUT", headers: { Authorization: `Bearer ${TOKEN}` }, body: fd });
let j = await r.json(); console.log("script:", j.success, JSON.stringify(j.errors));
if (process.argv.includes("--so-script")) process.exit(0);
r = await fetch(`${api}/accounts/${ACCT}/workers/domains`, { method: "PUT", headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ hostname: HOST, service: NAME, zone_id: ZONE, environment: "production" }) });
j = await r.json(); console.log("domain:", j.success, JSON.stringify(j.errors));
