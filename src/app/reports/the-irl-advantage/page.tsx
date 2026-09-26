import type { Metadata } from "next";

import { EDITORIAL_BG, EDITORIAL_INK, editorialScopeClass } from "@/lib/theme/culturinTokens";
import SiteHeader from "@/app/components/SiteHeader";
import HomeFooter from "@/app/components/HomeFooter";
import IrlReportClient from "./IrlReportClient";
import { REPORT_SUBTITLE, REPORT_TITLE } from "./reportContent";

export const metadata: Metadata = {
  title: `${REPORT_TITLE}: ${REPORT_SUBTITLE} | Culturin`,
  description:
    "Free Culturin Intelligence report. 51% of web traffic is bots, while 61% of consumers are more inclined to buy after a live brand experience. The data, and the playbook, for brands that stand out in person.",
  openGraph: {
    title: `${REPORT_TITLE} | Culturin Intelligence`,
    description: REPORT_SUBTITLE,
  },
};

export default function IrlReportPage() {
  return (
    <div style={{ background: EDITORIAL_BG, color: EDITORIAL_INK }} className={`${editorialScopeClass} font-sans antialiased`}>
      <div className="print:hidden">
        <SiteHeader />
      </div>
      <IrlReportClient />
      <div className="print:hidden">
        <HomeFooter />
      </div>
    </div>
  );
}
