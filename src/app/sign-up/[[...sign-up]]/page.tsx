import { redirect } from "next/navigation";

export default function LegacySignUpRoute() {
  redirect("/login?mode=signup");
}

