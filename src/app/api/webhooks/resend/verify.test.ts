import { createHmac } from "node:crypto";

import { afterEach, describe, expect, it } from "vitest";

import { POST } from "./route";

const SECRET = "whsec_" + Buffer.from("test-secret-key-123").toString("base64");

function signedRequest(body: string, { secret = SECRET, ageSeconds = 0 } = {}) {
  const id = "msg_test";
  const ts = String(Math.floor(Date.now() / 1000) - ageSeconds);
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const sig = createHmac("sha256", key).update(`${id}.${ts}.${body}`).digest("base64");
  return new Request("http://x/api/webhooks/resend", {
    method: "POST",
    body,
    headers: { "svix-id": id, "svix-timestamp": ts, "svix-signature": `v1,${sig}` },
  });
}

describe("resend webhook signature", () => {
  afterEach(() => {
    delete process.env.RESEND_WEBHOOK_SECRET;
  });

  it("rejects a bad signature and stale timestamps", async () => {
    process.env.RESEND_WEBHOOK_SECRET = SECRET;
    const body = JSON.stringify({ type: "email.opened", data: {} });
    const wrongKey = "whsec_" + Buffer.from("another-key").toString("base64");
    expect((await POST(signedRequest(body, { secret: wrongKey }))).status).toBe(401);
    expect((await POST(signedRequest(body, { ageSeconds: 3600 }))).status).toBe(401);
  });

  it("accepts a valid signature (test sends are ignored before touching the database)", async () => {
    process.env.RESEND_WEBHOOK_SECRET = SECRET;
    const body = JSON.stringify({ type: "email.opened", data: { tags: { broadcast_id: "test" } } });
    const res = await POST(signedRequest(body));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ignored: "test send" });
  });
});
