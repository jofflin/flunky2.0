import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NoTeamPage from "./NoTeam";
import TeamPage from "./Teams";
import TeamOverviewPage from "./Teams";

export default async function TeamsPage() {
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
    return <NoTeamPage />;
  }

  const { data: players, error: playersError } = await supabase
    .from("profiles")
    .select("*");

  if (playersError) {
    console.error(playersError);
    return <div>Error loading data</div>;
  }

  if (!players) {
    return <div>Loading...</div>;
  }

  return <TeamOverviewPage teams={teams} user={user} players={players} />;
}
