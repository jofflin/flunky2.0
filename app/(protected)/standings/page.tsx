
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StandingsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <h1>Standings</h1>
  );
}
