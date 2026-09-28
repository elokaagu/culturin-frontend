import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBroadcast, getSendProgress } from "@/lib/email/broadcasts";

import { BroadcastEditor } from "./BroadcastEditor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit email" };

export default async function StudioEmailPage({ params }: { params: { id: string } }) {
  const [broadcast, progress] = await Promise.all([getBroadcast(params.id), getSendProgress(params.id)]);
  if (!broadcast) notFound();
  return (
    <div className="p-4 sm:p-6 md:p-10">
      <BroadcastEditor broadcast={broadcast} progress={progress} />
    </div>
  );
}
