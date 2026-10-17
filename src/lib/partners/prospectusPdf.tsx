import "server-only";

import { Document, Image, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

import { LOGO_WHITE, PDF_COLORS as C, registerBrandFonts } from "@/lib/pdf/brand";
import {
  AUDIENCE_STATS,
  CALENDAR,
  COMPANIES,
  INDUSTRIES,
  PHOTOS,
  PRESS,
  PROGRAMME,
  REPORT_CONTENTS,
  STEPS,
  TIERS,
  TRACK_RECORD,
} from "@/lib/partners/programme";

registerBrandFonts();

const TOTAL_PAGES = 7;
const PAD = 48;
// A hair under the true A4 size so absolutely positioned full-bleed layers never spill onto a new page.
const A4_LANDSCAPE = { width: 841, height: 594 };

const s = StyleSheet.create({
  page: { backgroundColor: C.bg, fontFamily: "Maison", fontSize: 10, color: C.ink, paddingHorizontal: PAD, paddingTop: 40, paddingBottom: 56 },
  darkPage: { backgroundColor: C.head, color: C.onDark },
  eyebrow: { fontSize: 7.5, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: C.accent },
  h1: { fontFamily: "NewSpirit", fontWeight: 600, fontSize: 34, lineHeight: 1.08, marginTop: 10 },
  lede: { fontSize: 10.5, lineHeight: 1.6, color: C.muted, marginTop: 10, maxWidth: 520 },
  footer: { position: "absolute", left: PAD, right: PAD, bottom: 24, flexDirection: "row", justifyContent: "space-between", fontSize: 7, letterSpacing: 1.4, textTransform: "uppercase", color: C.muted },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.rule, borderRadius: 10 },
  display: { fontFamily: "NewSpirit", fontWeight: 600 },
  bullet: { width: 4, height: 4, backgroundColor: C.accent, marginTop: 4.5, marginRight: 8, borderRadius: 1 },
});

function Footer({ n, onDark }: { n: number; onDark?: boolean }) {
  return (
    <View style={[s.footer, onDark ? { color: C.onDarkMuted } : {}]} fixed>
      <Text>
        {PROGRAMME.name} · {PROGRAMME.edition}
      </Text>
      <Text>
        {String(n).padStart(2, "0")} / {String(TOTAL_PAGES).padStart(2, "0")}
      </Text>
    </View>
  );
}

function Heading({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <View>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={s.h1}>{title}</Text>
      {lede ? <Text style={s.lede}>{lede}</Text> : null}
    </View>
  );
}

function Bullet({ children, color }: { children: string; color?: string }) {
  return (
    <View style={{ flexDirection: "row", marginTop: 6 }}>
      <View style={[s.bullet, color ? { backgroundColor: color } : {}]} />
      <Text style={{ flex: 1, fontSize: 9, lineHeight: 1.3 }}>{children}</Text>
    </View>
  );
}

/* eslint-disable jsx-a11y/alt-text -- react-pdf Image has no alt prop */
function Prospectus() {
  const industryMax = Math.max(...INDUSTRIES.map((i) => i.people));
  const [cannes, mipcom] = TRACK_RECORD;

  return (
    <Document title={`${PROGRAMME.name} ${PROGRAMME.edition}`} author="Culturin" creator="Culturin" producer="Culturin">
      {/* 1. Cover */}
      <Page size="A4" orientation="landscape" style={[s.page, s.darkPage, { paddingTop: 0, paddingBottom: 0, paddingHorizontal: 0 }]}>
        <View style={{ position: "absolute", top: 0, left: 0, width: A4_LANDSCAPE.width, height: A4_LANDSCAPE.height }}>
          <Image src={PHOTOS.hero.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </View>
        <View style={{ position: "absolute", top: 0, left: 0, width: A4_LANDSCAPE.width, height: A4_LANDSCAPE.height, backgroundColor: C.head, opacity: 0.58 }} />
        <View style={{ position: "absolute", top: 0, left: 0, width: A4_LANDSCAPE.width, height: A4_LANDSCAPE.height, padding: PAD, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Image src={LOGO_WHITE} style={{ width: 120, height: 18 }} />
            <Text style={{ fontSize: 7.5, letterSpacing: 2, textTransform: "uppercase", color: C.onDarkMuted }}>{PROGRAMME.eyebrow}</Text>
          </View>
          <View>
            <View style={{ width: 40, height: 3, backgroundColor: C.accentOnDark, marginBottom: 18 }} />
            <Text style={[s.display, { fontSize: 60, lineHeight: 1.02 }]}>{PROGRAMME.title}</Text>
            <Text style={{ fontSize: 12, lineHeight: 1.6, color: C.onDark, marginTop: 14, maxWidth: 520, opacity: 0.9 }}>{PROGRAMME.lede}</Text>
            <Text style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: C.onDarkMuted, marginTop: 28 }}>culturin.com/partners</Text>
          </View>
        </View>
      </Page>

      {/* 2. Track record */}
      <Page size="A4" orientation="landscape" style={s.page}>
        <Heading
          eyebrow="The track record"
          title="Rooms people remember."
          lede="Every Culturin room is curated. The guest list is the product: the people who make, fund and influence culture, in one place for one night."
        />
        <View style={{ flexDirection: "row", gap: 14, marginTop: 22, flex: 1 }}>
          <View style={[s.card, { flex: 1.15, overflow: "hidden", flexDirection: "row" }]}>
            {cannes.photo ? <Image src={cannes.photo.src} style={{ width: "46%", objectFit: "cover" }} /> : null}
            <View style={{ flex: 1, padding: 18, justifyContent: "space-between" }}>
              <View>
                <Text style={s.eyebrow}>{cannes.event}</Text>
                <Text style={[s.display, { fontSize: 15, lineHeight: 1.35, marginTop: 8 }]}>{cannes.line}</Text>
              </View>
              <View>
                {cannes.stats.map((st) => (
                  <View key={st.label} style={{ marginTop: 12 }}>
                    <Text style={[s.display, { fontSize: 32, color: C.accent }]}>{st.value}</Text>
                    <Text style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{st.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={{ flex: 1, backgroundColor: C.dark, borderRadius: 10, padding: 20, justifyContent: "space-between", color: C.onDark }}>
            <View>
              <Text style={[s.eyebrow, { color: C.accentOnDark }]}>{mipcom.event}</Text>
              <Text style={[s.display, { fontSize: 14, lineHeight: 1.4, marginTop: 8 }]}>{mipcom.line}</Text>
            </View>
            <View>
              {mipcom.stats.map((st) => (
                <View key={st.label} style={{ marginTop: 12 }}>
                  <Text style={[s.display, { fontSize: 32, color: C.accentOnDark }]}>{st.value}</Text>
                  <Text style={{ fontSize: 9, color: C.onDarkMuted, marginTop: 2 }}>{st.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text style={{ marginTop: 14, fontSize: 7.5, letterSpacing: 1.6, textTransform: "uppercase", color: C.muted }}>
          In the press: <Text style={{ color: C.ink }}>{PRESS.join("  ·  ")}</Text>
        </Text>
        <Footer n={2} />
      </Page>

      {/* 3. Audience */}
      <Page size="A4" orientation="landscape" style={s.page}>
        <Heading eyebrow="Who’s in the room" title="Senior, international, and in the business of culture." />
        <View style={{ flexDirection: "row", marginTop: 22, borderTopWidth: 1, borderTopColor: C.rule }}>
          {AUDIENCE_STATS.map((st) => (
            <View key={st.label} style={{ flex: 1, paddingTop: 14, paddingRight: 18 }}>
              <Text style={[s.display, { fontSize: 38, color: C.accent }]}>{st.value}</Text>
              <Text style={{ fontSize: 9, lineHeight: 1.45, marginTop: 6 }}>{st.label}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 36, marginTop: 26 }}>
          <View style={{ flex: 1.2 }}>
            <Text style={[s.display, { fontSize: 14 }]}>Where they work</Text>
            {INDUSTRIES.map((ind) => (
              <View key={ind.name} style={{ marginTop: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", fontSize: 9 }}>
                  <Text>{ind.name}</Text>
                  <Text style={{ color: C.muted }}>~{ind.people}</Text>
                </View>
                <View style={{ height: 4, backgroundColor: C.rule, borderRadius: 2, marginTop: 4 }}>
                  <View style={{ height: 4, width: `${(ind.people / industryMax) * 100}%`, backgroundColor: C.accent, borderRadius: 2 }} />
                </View>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.display, { fontSize: 14 }]}>Guests and subscribers include people from</Text>
            <Text style={[s.display, { fontSize: 17, lineHeight: 1.45, marginTop: 10 }]}>{COMPANIES.join(", ")}.</Text>
            <Text style={{ fontSize: 7.5, lineHeight: 1.5, color: C.muted, marginTop: 16 }}>
              Figures as of {PROGRAMME.figuresAsOf}, from Culturin’s own guest and subscriber data. Industry sizes are estimates from guests’ roles and
              companies. Company names show where guests work, not endorsements.
            </Text>
          </View>
        </View>
        <Footer n={3} />
      </Page>

      {/* 4. Calendar */}
      <Page size="A4" orientation="landscape" style={s.page}>
        <Heading
          eyebrow={`The ${PROGRAMME.edition} calendar`}
          title="Seven moments, one programme."
          lede="Partner on a single night or across the season. Cannes After Dark, at Cannes Lions and MIPCOM, is our flagship series."
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 18, marginHorizontal: -5 }}>
          {CALENDAR.map((m) => (
            <View key={m.name} style={{ width: "25%", padding: 5 }}>
              <View
                style={[
                  { borderRadius: 10, padding: 14, height: 138 },
                  m.flagship ? { backgroundColor: C.dark, color: C.onDark } : { backgroundColor: C.card, borderWidth: 1, borderColor: C.rule },
                ]}
              >
                <Text style={[s.eyebrow, m.flagship ? { color: C.accentOnDark } : {}]}>{m.month}</Text>
                <Text style={[s.display, { fontSize: 15, marginTop: 8 }]}>{m.name}</Text>
                <Text style={{ fontSize: 7, letterSpacing: 1.2, textTransform: "uppercase", marginTop: 4, color: m.flagship ? C.onDarkMuted : C.muted }}>
                  {m.city} · {m.theme}
                </Text>
                <Text style={{ fontSize: 8.5, lineHeight: 1.45, marginTop: 8, color: m.flagship ? C.onDarkMuted : C.muted }}>{m.line}</Text>
              </View>
            </View>
          ))}
          <View style={{ width: "25%", padding: 5 }}>
            <View style={{ borderRadius: 10, padding: 14, height: 138, borderWidth: 1, borderColor: C.accent, borderStyle: "dashed", justifyContent: "center" }}>
              <Text style={[s.display, { fontSize: 14, color: C.accent }]}>Your moment</Text>
              <Text style={{ fontSize: 8.5, lineHeight: 1.45, marginTop: 6, color: C.muted }}>
                Have a market or a city in mind? We build bespoke rooms with partners too.
              </Text>
            </View>
          </View>
        </View>
        <Text style={{ fontSize: 7.5, color: C.muted, marginTop: 8 }}>Dates are confirmed with partners as each moment is scheduled.</Text>
        <Footer n={4} />
      </Page>

      {/* 5. Tiers */}
      <Page size="A4" orientation="landscape" style={s.page}>
        <Heading eyebrow="Partnerships" title="Three ways in." lede={PROGRAMME.pricing} />
        <View style={{ flexDirection: "row", gap: 12, marginTop: 18 }}>
          {TIERS.map((t) => (
            <View
              key={t.name}
              style={[
                { flex: 1, borderRadius: 10, padding: 18 },
                t.featured ? { backgroundColor: C.dark, color: C.onDark } : { backgroundColor: C.card, borderWidth: 1, borderColor: C.rule },
              ]}
            >
              <Text style={[s.eyebrow, t.featured ? { color: C.accentOnDark } : {}]}>{t.availability}</Text>
              <Text style={[s.display, { fontSize: 22, marginTop: 8 }]}>{t.name}</Text>
              <Text style={{ fontSize: 9.5, marginTop: 4, color: t.featured ? C.onDarkMuted : C.muted }}>{t.summary}</Text>
              <View style={{ borderTopWidth: 1, borderTopColor: t.featured ? "#3f372d" : C.rule, marginTop: 12, paddingTop: 6 }}>
                {t.includes.map((line) => (
                  <Bullet key={line} color={t.featured ? C.accentOnDark : undefined}>
                    {line}
                  </Bullet>
                ))}
              </View>
            </View>
          ))}
        </View>
        <Footer n={5} />
      </Page>

      {/* 6. Report + how it works */}
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={{ flexDirection: "row", gap: 28 }}>
          <View style={{ flex: 1.1 }}>
            <Heading
              eyebrow="Proof after every room"
              title="Know exactly who you met."
              lede="Most sponsorships end when the lights come up. Ours end with a Culturin report, built from the guest list and the night itself."
            />
            <View style={{ marginTop: 10 }}>
              {REPORT_CONTENTS.map((r) => (
                <View key={r.title} style={{ marginTop: 10 }}>
                  <Text style={[s.display, { fontSize: 12.5 }]}>{r.title}</Text>
                  <Text style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{r.line}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "row", gap: 8 }}>
            <Image src={PHOTOS.cannesCrowd.src} style={{ flex: 1, height: 250, objectFit: "cover", borderRadius: 10 }} />
            <Image src={PHOTOS.cannesGuests.src} style={{ flex: 1, height: 250, objectFit: "cover", borderRadius: 10 }} />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 18, marginTop: 24, borderTopWidth: 1, borderTopColor: C.rule, paddingTop: 14 }}>
          {STEPS.map((st, i) => (
            <View key={st.title} style={{ flex: 1 }}>
              <Text style={[s.display, { fontSize: 22, color: C.accent }]}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={[s.display, { fontSize: 11.5, marginTop: 4 }]}>{st.title}</Text>
              <Text style={{ fontSize: 8.5, color: C.muted, marginTop: 2, lineHeight: 1.4 }}>{st.line}</Text>
            </View>
          ))}
        </View>
        <Footer n={6} />
      </Page>

      {/* 7. Contact */}
      <Page size="A4" orientation="landscape" style={[s.page, s.darkPage, { justifyContent: "center" }]}>
        <Image src={LOGO_WHITE} style={{ width: 120, height: 18, position: "absolute", top: 40, left: PAD }} />
        <Text style={[s.eyebrow, { color: C.accentOnDark }]}>Partner with Culturin</Text>
        <Text style={[s.display, { fontSize: 48, lineHeight: 1.05, marginTop: 12, maxWidth: 600 }]}>Let’s build the room together.</Text>
        <Text style={{ fontSize: 11, lineHeight: 1.6, color: C.onDarkMuted, marginTop: 16, maxWidth: 520 }}>{PROGRAMME.pricing}</Text>
        <View style={{ marginTop: 28 }}>
          <Text style={{ fontSize: 13, color: C.onDark }}>{PROGRAMME.contactEmail}</Text>
          <Text style={{ fontSize: 13, color: C.onDark, marginTop: 6 }}>culturin.com/partners</Text>
          <Text style={{ fontSize: 9, color: C.onDarkMuted, marginTop: 10 }}>@culturinworld on Instagram · Culturin on LinkedIn</Text>
        </View>
        <Footer n={7} onDark />
      </Page>
    </Document>
  );
}
/* eslint-enable jsx-a11y/alt-text */

export const PROSPECTUS_FILENAME = `Culturin-Partner-Programme-${PROGRAMME.edition}.pdf`;

export function renderProspectus(): Promise<Buffer> {
  return renderToBuffer(<Prospectus />);
}