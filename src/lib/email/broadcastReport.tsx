import "server-only";

import path from "node:path";

import { Document, Font, Image, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

import type { Broadcast, BroadcastStats, EngagedPerson } from "@/lib/email/broadcasts";

const FONTS = path.join(process.cwd(), "src/app/styles/fonts");
const REPORT_LOGO = path.join(process.cwd(), "public/culturin_logotype_white.png");

Font.register({
  family: "NewSpirit",
  fonts: [
    { src: path.join(FONTS, "NewSpirit-Regular-Condensed.otf"), fontWeight: 400 },
    { src: path.join(FONTS, "NewSpirit-SemiBold-Condensed.otf"), fontWeight: 600 },
  ],
});
Font.register({
  family: "Maison",
  fonts: [
    { src: path.join(FONTS, "MaisonNeue-Book.otf"), fontWeight: 400 },
    { src: path.join(FONTS, "MaisonNeue-Medium.otf"), fontWeight: 500 },
    { src: path.join(FONTS, "MaisonNeue-Demi.otf"), fontWeight: 600 },
  ],
});
// Never hyphenate, but let long unbroken strings (email addresses, URLs) wrap inside table cells.
Font.registerHyphenationCallback((word) => (word.length > 20 ? word.match(/.{1,16}/g) ?? [word] : [word]));

const BG = "#f6f1ea";
const CARD = "#fffdf9";
const INK = "#1c1a17";
const MUTED = "#6f675d";
const RULE = "#e4dccf";
const ACCENT = "#cd6b3f";
const HEAD = "#0e0b08";
const HEAD_MUTED = "#b9ab98";
const WARN = "#c2413b";

const s = StyleSheet.create({
  page: { backgroundColor: BG, fontFamily: "Maison", fontSize: 9.5, color: INK, paddingBottom: 56 },
  head: { backgroundColor: HEAD, borderBottomWidth: 3, borderBottomColor: ACCENT, paddingHorizontal: 40, paddingVertical: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { width: 112, height: 17 },
  headLabel: { color: HEAD_MUTED, fontSize: 8, letterSpacing: 1.6, textTransform: "uppercase" },
  slimHead: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 40, paddingTop: 26, paddingBottom: 10, color: MUTED, fontSize: 8 },
  body: { paddingHorizontal: 40 },
  eyebrow: { color: ACCENT, fontSize: 8, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", marginTop: 26 },
  title: { fontFamily: "NewSpirit", fontWeight: 600, fontSize: 26, lineHeight: 1.12, marginTop: 8 },
  meta: { color: MUTED, fontSize: 9.5, marginTop: 6, lineHeight: 1.45 },
  lede: { fontFamily: "NewSpirit", fontSize: 13, lineHeight: 1.4, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: RULE },
  tiles: { flexDirection: "row", flexWrap: "wrap", marginTop: 14, marginHorizontal: -4 },
  tileWrap: { width: "33.333%", padding: 4 },
  tile: { backgroundColor: CARD, borderWidth: 1, borderColor: RULE, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, height: 66 },
  tileLabel: { fontSize: 7, fontWeight: 600, letterSpacing: 1.3, textTransform: "uppercase", color: MUTED },
  tileValue: { fontFamily: "NewSpirit", fontWeight: 600, fontSize: 22, marginTop: 4 },
  tileSub: { fontSize: 8, color: MUTED, marginTop: 2 },
  section: { marginTop: 20 },
  h2: { fontFamily: "NewSpirit", fontWeight: 600, fontSize: 15, marginBottom: 6 },
  h3: { fontSize: 7.5, fontWeight: 600, letterSpacing: 1.3, textTransform: "uppercase", color: MUTED, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4.5, borderBottomWidth: 1, borderBottomColor: RULE },
  rowLabel: { flex: 1, paddingRight: 12 },
  rowValue: { color: MUTED },
  cols: { flexDirection: "row", marginHorizontal: -10 },
  col: { flex: 1, paddingHorizontal: 10 },
  note: { fontSize: 8, color: MUTED, lineHeight: 1.5, marginTop: 10 },
  table: { borderWidth: 1, borderColor: RULE, borderRadius: 8, backgroundColor: CARD },
  th: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: RULE, paddingVertical: 7, paddingHorizontal: 10, fontSize: 7, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: MUTED },
  tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: RULE, paddingVertical: 7, paddingHorizontal: 10 },
  cName: { width: "28%", paddingRight: 8 },
  cCompany: { width: "22%", paddingRight: 8, color: MUTED },
  cClicks: { width: "8%", paddingRight: 8 },
  cLinks: { width: "22%", paddingRight: 8, color: MUTED },
  cPlace: { width: "20%", color: MUTED },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: RULE, paddingTop: 8, fontSize: 7.5, color: MUTED },
});

const pct = (n: number, of: number) => (of > 0 ? `${Math.round((n / of) * 1000) / 10}%` : "–");
const n = (v: number) => v.toLocaleString("en-GB");
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** "https://www.culturin.com/partner?x=1" -> "culturin.com/partner". */
const shortLink = (url: string) => {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname === "/" ? "" : u.pathname}`;
  } catch {
    return url;
  }
};

function Tile({ label, value, sub, warn }: { label: string; value: number; sub?: string; warn?: boolean }) {
  return (
    <View style={s.tileWrap}>
      <View style={s.tile}>
        <Text style={s.tileLabel}>{label}</Text>
        <Text style={[s.tileValue, warn && value > 0 ? { color: WARN } : {}]}>{n(value)}</Text>
        {sub ? <Text style={s.tileSub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

function Breakdown({ title, items }: { title: string; items: { label: string; people: number }[] }) {
  return (
    <View style={s.col}>
      <Text style={s.h3}>{title}</Text>
      {items.slice(0, 6).map((i) => (
        <View key={i.label} style={s.row} wrap={false}>
          <Text style={s.rowLabel}>{i.label}</Text>
          <Text style={s.rowValue}>
            {i.people} {i.people === 1 ? "person" : "people"}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Footer({ generatedOn }: { generatedOn: string }) {
  return (
    <View style={s.footer} fixed>
      <Text>Culturin · culturin.com · Confidential</Text>
      <Text render={({ pageNumber, totalPages }) => `Generated ${generatedOn} · Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

export type ReportInput = {
  broadcast: Broadcast;
  stats: BroadcastStats;
  sent: number;
  total: number;
  audience: string;
};

function Report({ broadcast, stats, sent, total, audience }: ReportInput) {
  const base = stats.delivered || stats.sent;
  const generatedOn = day(new Date().toISOString());
  const clickers = stats.people.filter((p) => p.clickedAt).sort((a, b) => b.clickCount - a.clickCount || (a.name || a.email).localeCompare(b.name || b.email));
  const bounceHigh = stats.sent > 0 && stats.bounced / stats.sent >= 0.02;
  const spamHigh = stats.sent > 0 && stats.complained / stats.sent >= 0.001;
  const health =
    bounceHigh || spamHigh
      ? `${bounceHigh ? `The bounce rate of ${pct(stats.bounced, stats.sent)} is above the 2% guideline` : ""}${bounceHigh && spamHigh ? " and the" : spamHigh ? "The" : ""}${spamHigh ? ` spam rate of ${pct(stats.complained, stats.sent)} is above 0.1%` : ""}; bounced addresses have already been removed from future sends.`
      : "Deliverability is healthy.";
  const label = (p: EngagedPerson) => p.name || p.email;

  return (
    <Document title={`${broadcast.subject || "Email"}: campaign report`} author="Culturin" creator="Culturin" producer="Culturin">
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
          <Image src={REPORT_LOGO} style={s.logo} />
          <Text style={s.headLabel}>Email campaign report</Text>
        </View>

        <View style={s.body}>
          <Text style={s.eyebrow}>Campaign report</Text>
          <Text style={s.title}>{broadcast.subject || "Untitled email"}</Text>
          <Text style={s.meta}>
            Sent to {audience}
            {broadcast.sentAt ? ` from ${day(broadcast.sentAt)}` : ""}. {n(sent)} of {n(total)} emails sent.
          </Text>

          <Text style={s.lede}>
            {n(stats.delivered)} people received this email. About {n(stats.opened)} opened it ({pct(stats.opened, base)}) and {n(stats.clicked)}{" "}
            clicked through ({pct(stats.clicked, base)}).{" "}
            {health}
          </Text>

          <View style={s.tiles}>
            <Tile label="Sent" value={stats.sent} />
            <Tile label="Delivered" value={stats.delivered} sub={pct(stats.delivered, stats.sent)} />
            <Tile label="Opened" value={stats.opened} sub={`${pct(stats.opened, base)} · approximate`} />
            <Tile label="Clicked" value={stats.clicked} sub={`${pct(stats.clicked, base)} · real people`} />
            <Tile label="Bounced" value={stats.bounced} sub={`${pct(stats.bounced, stats.sent)} · keep under 2%`} warn={stats.bounced / Math.max(1, stats.sent) >= 0.02} />
            <Tile label="Marked spam" value={stats.complained} sub={`${pct(stats.complained, stats.sent)} · keep under 0.1%`} warn />
          </View>

          {stats.topLinks.length > 0 ? (
            <View style={s.section} wrap={false}>
              <Text style={s.h2}>Most clicked links</Text>
              {stats.topLinks.slice(0, 8).map((l) => (
                <View key={l.link} style={s.row}>
                  <Text style={s.rowLabel}>{shortLink(l.link)}</Text>
                  <Text style={s.rowValue}>
                    {l.people} {l.people === 1 ? "person" : "people"} · {l.clicks} clicks
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {stats.clickLocations.length > 0 || stats.clickDevices.length > 0 ? (
            <View style={s.section} wrap={false}>
              <Text style={s.h2}>Who engaged, and how</Text>
              <View style={s.cols}>
                {stats.clickLocations.length > 0 ? <Breakdown title="Where people clicked from" items={stats.clickLocations} /> : null}
                {stats.clickDevices.length > 0 ? <Breakdown title="Devices people clicked on" items={stats.clickDevices} /> : null}
              </View>
            </View>
          ) : null}

          <Text style={s.note}>
            Clicks count real people only. Corporate email security (Mimecast, Proofpoint, Microsoft Defender) opens emails and clicks every
            link seconds after delivery to check it is safe
            {stats.automatedClickers > 0 ? `; that happened for ${n(stats.automatedClickers)} recipients here, who are left out of the numbers` : ""}.
            Opens are approximate, because Apple Mail opens every email automatically for privacy. Anyone who bounces or marks the email as spam
            is removed from future sends.
          </Text>
        </View>
        <Footer generatedOn={generatedOn} />
      </Page>

      {clickers.length > 0 ? (
        <Page size="A4" style={s.page}>
          <View style={s.slimHead} fixed>
            <Text>{broadcast.subject}</Text>
            <Text>Culturin campaign report</Text>
          </View>
          <View style={s.body}>
            <Text style={[s.h2, { marginTop: 8 }]}>Who clicked</Text>
            <Text style={[s.meta, { marginTop: 0, marginBottom: 12 }]}>
              {n(clickers.length)} {clickers.length === 1 ? "person" : "people"} clicked through, most engaged first.
            </Text>
            <View style={s.table}>
              <View style={s.th} fixed>
                <Text style={s.cName}>Person</Text>
                <Text style={s.cCompany}>Company</Text>
                <Text style={s.cClicks}>Clicks</Text>
                <Text style={s.cLinks}>Links</Text>
                <Text style={s.cPlace}>Location</Text>
              </View>
              {clickers.map((p, i) => (
                <View key={p.email} style={[s.tr, i === clickers.length - 1 ? { borderBottomWidth: 0 } : {}]} wrap={false}>
                  <Text style={s.cName}>{label(p)}</Text>
                  <Text style={s.cCompany}>{p.company || "–"}</Text>
                  <Text style={s.cClicks}>{p.clickCount}</Text>
                  <Text style={s.cLinks}>{p.links.length > 0 ? p.links.map(shortLink).join("\n") : "–"}</Text>
                  <Text style={s.cPlace}>{p.locations.length > 0 ? p.locations.join("\n") : "–"}</Text>
                </View>
              ))}
            </View>
          </View>
          <Footer generatedOn={generatedOn} />
        </Page>
      ) : null}
    </Document>
  );
}

export function renderBroadcastReport(input: ReportInput): Promise<Buffer> {
  return renderToBuffer(<Report {...input} />);
}
