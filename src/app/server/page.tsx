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
  return redirect("http://localhost:3000/api/auth/callback/google");
}
