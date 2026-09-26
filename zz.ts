import { createClient } from "@supabase/supabase-js";
const db = createClient((process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
(async () => {
  const rows: any[] = [];
  for (let f = 0; ; f += 1000) { const { data } = await db.from("newsletter_subscribers").select("id,email,first_name,last_name,company,source,raw_data").range(f, f + 999); rows.push(...data!); if (data!.length < 1000) break; }
  const noFirst = rows.filter((r) => !String(r.first_name ?? "").trim());
  const noLast = rows.filter((r) => !String(r.last_name ?? "").trim());
  const noCompany = rows.filter((r) => !String(r.company ?? "").trim());
  console.log({ total: rows.length, noFirst: noFirst.length, noLast: noLast.length, noCompany: noCompany.length });
  const withRawName = noFirst.filter((r) => String(r.raw_data?.name ?? "").trim());
  console.log("noFirst but raw name:", withRawName.length, withRawName.slice(0, 5).map((r) => r.raw_data.name));
  console.log("noFirst samples:", noFirst.slice(0, 25).map((r) => `${r.email} | ${r.source} | ${r.raw_data?.name ?? ""}`));
  console.log("noLast only samples:", noLast.filter((r) => String(r.first_name ?? "").trim()).slice(0, 15).map((r) => `${r.first_name} | ${r.email} | ${r.raw_data?.name ?? ""}`));
  const oddCase = rows.filter((r) => /^[a-z]/.test(r.first_name ?? "") || /^[A-Z]{3,}$/.test(r.first_name ?? "")).slice(0, 10).map((r) => `${r.first_name} ${r.last_name}`);
  console.log("case issues:", oddCase);
})();
