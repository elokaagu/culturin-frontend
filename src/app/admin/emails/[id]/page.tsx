import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { countRecipients, getBroadcast } from "@/lib/email/broadcasts";

import { BroadcastEditor } from "./BroadcastEditor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit email" };

export default async function StudioEmailPage({ params }: { params: { id: string } }) {
  const [broadcast, recipients] = await Promise.all([getBroadcast(params.id), countRecipients()]);
  if (!broadcast) notFound();
  return (
    <div className="p-4 sm:p-6 md:p-10">
      <BroadcastEditor broadcast={broadcast} recipients={recipients ?? 0} />
    </div>
  );
}
