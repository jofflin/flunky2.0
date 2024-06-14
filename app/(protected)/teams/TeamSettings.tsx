import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TeamSettingsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("*");

  if (teamsError) {
    console.error(teamsError);
    return <div>Error loading data</div>;
  }

  const playerTeams = teams.find(
    (team) => team.player1 === user.id || team.player2 === user.id
  );

  if (!playerTeams) {
    return <div>You are not part of any team</div>;
  }

  return <h1>Teams</h1>;
}
