import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Home from "../page";

export default async function ServerPage() {
  const session = await getServerSession(options);
  if (!session) {
    <>
      <Home />
    </>;
  }
  return redirect("/api/auth/signin?callbackUrl=/server");
}
