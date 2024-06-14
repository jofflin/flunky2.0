import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EditTeamForm from "./team-form";

export default async function Team() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <EditTeamForm user={user} />;
}
