import "server-only";

import { Document, Image, Link, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

import { LOGO_WHITE, PDF_COLORS as C, registerBrandFonts } from "@/lib/pdf/brand";

import { citedKeys, formatDateRange, visibleSections } from "./output";
import type { Briefing } from "./store";
import { SECTION_META, type BriefingRequest, type BriefingSource, type NamedItem } from "./types";

registerBrandFonts();

const PAD = 48;

const s = StyleSheet.create({
  page: { backgroundColor: C.bg, fontFamily: "Maison", fontSize: 9.5, color: C.ink, paddingHorizontal: PAD, paddingTop: 44, paddingBottom: 60, lineHeight: 1.45 },
  eyebrow: { fontSize: 7.5, fontWeight: 600, letterSpacing: 1.8, textTransform: "uppercase", color: C.accent },
  h2: { fontFamily: "NewSpirit", fontWeight: 600, fontSize: 22, marginTop: 6, marginBottom: 10 },
  itemName: { fontFamily: "NewSpirit", fontWeight: 600, fontSize: 11.5 },
  cite: { fontSize: 7, color: C.muted },
  item: { marginBottom: 10 },
  footer: { position: "absolute", left: PAD, right: PAD, bottom: 26, flexDirection: "row", justifyContent: "space-between", fontSize: 7, letterSpacing: 1.2, textTransform: "uppercase", color: C.muted },
  rule: { borderBottomWidth: 1, borderBottomColor: C.rule, marginVertical: 14 },
});

const cite = (keys: string[]) => (keys.length ? ` [${keys.join(", ")}]` : "");

function Footer({ label }: { label: string }) {
  return (
    <View style={s.footer} fixed>
      <Text>{label}</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

/** A section heading kept on the same page as its first block, so headings never end a page. */
function Section({ k, blocks }: { k: keyof typeof SECTION_META; blocks: React.ReactNode[] }) {
  const [first, ...rest] = blocks;
  return (
    <View style={{ marginTop: 18 }}>
      <View wrap={false}>
        <Text style={s.eyebrow}>{SECTION_META[k].eyebrow}</Text>
        <Text style={s.h2}>{SECTION_META[k].title}</Text>
        {first}
      </View>
      {rest}
    </View>
  );
}

function named(items: NamedItem[]) {
  return items.map((i) => (
    <View key={i.id} style={s.item} wrap={false}>
      <Text style={s.itemName}>{i.name}</Text>
      <Text>
        {i.detail}
        <Text style={s.cite}>{cite(i.sources)}</Text>
      </Text>
    </View>
  ));
}

/* eslint-disable jsx-a11y/alt-text -- react-pdf Image has no alt prop */
function BriefingPdf({ request: r, briefing: b, sources }: { request: BriefingRequest; briefing: Briefing; sources: BriefingSource[] }) {
  const professional = r.kind === "briefing";
  const sec = visibleSections(b.sections, professional ? "professional" : "guide");
  const used = new Set(citedKeys(sec));
  const listed = sources.filter((x) => used.has(x.key));
  const label = `Culturin · ${r.place} ${professional ? "briefing" : "guide"}`;
  const reviewed = b.reviewedAt ? new Date(b.reviewedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <Document title={`${r.place}: a Culturin ${professional ? "briefing" : "guide"}`} author="Culturin" creator="Culturin" producer="Culturin">
      <Page size="A4" style={[s.page, { backgroundColor: C.head, color: C.onDark, justifyContent: "space-between", paddingTop: PAD, paddingBottom: PAD }]}>
        <Image src={LOGO_WHITE} style={{ width: 110, height: 17 }} />
        <View>
          <View style={{ width: 40, height: 3, backgroundColor: C.accentOnDark, marginBottom: 18 }} />
          <Text style={[s.eyebrow, { color: C.accentOnDark }]}>{professional ? "Culturin briefing" : "Culturin guide"}</Text>
          <Text style={{ fontFamily: "NewSpirit", fontWeight: 600, fontSize: 44, lineHeight: 1.05, marginTop: 10 }}>
            {r.place}, {r.country}
          </Text>
          {b.summary ? <Text style={{ fontSize: 12, lineHeight: 1.55, marginTop: 14, color: C.onDark, maxWidth: 420 }}>{b.summary}</Text> : null}
        </View>
        <View style={{ borderTopWidth: 1, borderTopColor: "#3f372d", paddingTop: 14, fontSize: 8.5, color: C.onDarkMuted, lineHeight: 1.6 }}>
          {professional && r.audience ? <Text>Audience: {r.audience}</Text> : null}
          {professional && r.objective ? <Text>Objective: {r.objective}</Text> : null}
          <Text>Timeframe: {formatDateRange(r.timeframeStart, r.timeframeEnd)}</Text>
          {r.buyerCompany ? <Text>Prepared for {r.buyerCompany}</Text> : null}
          {reviewed ? <Text>Reviewed by Culturin on {reviewed}</Text> : null}
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <Section
          k="snapshot"
          blocks={[
            <Text key="text" style={{ fontSize: 11, lineHeight: 1.6 }}>
              {sec.snapshot.text}
              <Text style={s.cite}>{cite(sec.snapshot.sources)}</Text>
            </Text>,
            <View key="numbers" style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 14, marginHorizontal: -5 }}>
              {sec.snapshot.numbers.map((n) => (
                <View key={n.id} style={{ width: "33.33%", padding: 5 }} wrap={false}>
                  <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.rule, borderRadius: 8, padding: 10, minHeight: 64 }}>
                    <Text style={{ fontFamily: "NewSpirit", fontWeight: 600, fontSize: 15, lineHeight: 1.2, color: C.accent }}>{n.value}</Text>
                    <Text style={{ fontSize: 8, lineHeight: 1.4, color: C.muted, marginTop: 5 }}>
                      {n.label}
                      {cite(n.sources)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>,
          ]}
        />
        {sec.food.length ? <Section k="food" blocks={named(sec.food)} /> : null}
        {sec.history.length ? <Section k="history" blocks={named(sec.history)} /> : null}
        {sec.musicArt.length ? <Section k="musicArt" blocks={named(sec.musicArt)} /> : null}
        {sec.neighbourhoods.length ? <Section k="neighbourhoods" blocks={named(sec.neighbourhoods)} /> : null}
        {sec.influencers.length ? (
          <Section
            k="influencers"
            blocks={sec.influencers.map((p) => (
              <View key={p.id} style={s.item} wrap={false}>
                <Text style={s.itemName}>
                  {p.name}
                  {p.handle ? <Text style={{ fontFamily: "Maison", fontSize: 9, color: C.muted }}>{`  @${p.handle} · ${p.platform}`}</Text> : null}
                </Text>
                {p.reach ? <Text style={{ fontSize: 8.5, color: C.accent }}>{p.reach}</Text> : null}
                <Text>
                  {p.why}
                  <Text style={s.cite}>{cite(p.sources)}</Text>
                </Text>
              </View>
            ))}
          />
        ) : null}
        {sec.calendar.length ? (
          <Section
            k="calendar"
            blocks={sec.calendar.map((m) => (
              <View key={m.id} style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: C.rule, paddingVertical: 6 }} wrap={false}>
                <Text style={{ width: "26%", fontSize: 8.5, color: C.accent }}>{formatDateRange(m.start, m.end)}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 600 }}>
                    {m.name}
                    <Text style={{ fontWeight: 400, color: C.muted }}>{`  ${m.category}${m.location ? ` · ${m.location}` : ""}`}</Text>
                  </Text>
                  <Text style={{ fontSize: 8.5 }}>
                    {m.detail}
                    <Text style={s.cite}>{cite(m.sources)}</Text>
                  </Text>
                </View>
              </View>
            ))}
          />
        ) : null}
        {sec.sensitivities.length ? (
          <Section
            k="sensitivities"
            blocks={sec.sensitivities.map((x) => (
              <View key={x.id} style={s.item} wrap={false}>
                <Text style={s.itemName}>{x.title}</Text>
                <Text>
                  {x.detail}
                  <Text style={s.cite}>{cite(x.sources)}</Text>
                </Text>
              </View>
            ))}
          />
        ) : null}
        {sec.opportunities.length ? (
          <Section
            k="opportunities"
            blocks={sec.opportunities.map((o, i) => (
              <View key={o.id} style={[s.item, { backgroundColor: C.card, borderWidth: 1, borderColor: C.rule, borderRadius: 8, padding: 12 }]} wrap={false}>
                <Text style={[s.eyebrow, { fontSize: 7 }]}>Idea {i + 1}</Text>
                <Text style={[s.itemName, { marginTop: 4 }]}>{o.title}</Text>
                <Text style={{ marginTop: 3 }}>{o.idea}</Text>
                <Text style={{ marginTop: 4, color: C.muted }}>
                  {o.why}
                  <Text style={s.cite}>{cite(o.sources)}</Text>
                </Text>
              </View>
            ))}
          />
        ) : null}
        {b.localNotes ? (
          <View style={{ marginTop: 18 }} wrap={false}>
            <Text style={s.eyebrow}>From our curators</Text>
            <Text style={{ marginTop: 6, fontSize: 10.5, lineHeight: 1.6 }}>{b.localNotes}</Text>
          </View>
        ) : null}
        <Footer label={label} />
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Sources</Text>
        <Text style={s.h2}>Where every claim comes from</Text>
        {listed.map((x) => (
          <View key={x.key} style={{ flexDirection: "row", marginBottom: 5 }} wrap={false}>
            <Text style={{ width: 30, fontSize: 8, color: C.accent }}>{x.key}</Text>
            <View style={{ flex: 1, fontSize: 8 }}>
              <Text>{[x.title, x.publisher, x.publishedDate].filter(Boolean).join(" · ")}</Text>
              {x.url ? (
                <Link src={x.url} style={{ color: C.muted, textDecoration: "none" }}>
                  {x.url}
                </Link>
              ) : null}
            </View>
          </View>
        ))}
        <Footer label={label} />
      </Page>
    </Document>
  );
}
/* eslint-enable jsx-a11y/alt-text */

export function renderBriefingPdf(input: { request: BriefingRequest; briefing: Briefing; sources: BriefingSource[] }): Promise<Buffer> {
  return renderToBuffer(<BriefingPdf {...input} />);
}
