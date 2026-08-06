/**
 * One-off: upload public/events/** into Supabase Storage bucket `media` at events/...
 * Uses SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local / env.
 *
 *   node scripts/upload-event-media.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

loadEnvLocal();

const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET = "media";
const LOCAL_ROOT = path.join(root, "public", "events");

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function main() {
  const files = await walk(LOCAL_ROOT);
  console.log(`Uploading ${files.length} files to ${BUCKET}/events/ …`);
  let ok = 0;
  let fail = 0;
  for (const file of files) {
    const rel = path.relative(LOCAL_ROOT, file).split(path.sep).join("/");
    const objectPath = `events/${rel}`;
    const body = await fs.readFile(file);
    const { error } = await supabase.storage.from(BUCKET).upload(objectPath, body, {
      contentType: contentType(file),
      cacheControl: "31536000",
      upsert: true,
    });
    if (error) {
      fail += 1;
      console.error("FAIL", objectPath, error.message);
    } else {
      ok += 1;
      if (ok % 25 === 0) console.log(`… ${ok}/${files.length}`);
    }
  }
  console.log(`Done. ok=${ok} fail=${fail}`);
  if (fail) process.exit(1);
  const sample = `${url}/storage/v1/object/public/${BUCKET}/events/cannes-lions-2026/UNIKday1-2.jpg`;
  console.log("Sample URL:", sample);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
