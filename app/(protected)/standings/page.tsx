import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import Card from "@/components/card";
import GameBox from "@/components/gamebox";
import { getFinalGames, getRanking } from "@/utils/api/games";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function StandingsPage() {
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
  // only games that are finished
  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .eq("status", "FINISHED")
    .eq("ko_game", false)
    .eq("decider", false)
    .order("id", { ascending: true });

  const { data: koGames, error: koGamesError } = await supabase
    .from("games")
    .select("*")
    .eq("ko_game", true)
    .order("id", { ascending: true });
  const { data: deciderGames, error: deciderGamesError } = await supabase
    .from("games")
    .select("*")
    .eq("decider", true)
    .order("id", { ascending: true });
  // const { data: games, error: gamesError } = await supabase.from("games").select("*");

  if (teamsError || gamesError || koGamesError || deciderGamesError) {
    console.error(teamsError || gamesError || deciderGamesError);
    return <div>Error loading data</div>;
  }

  const tableData: {
    teamName: string;
    teamLogo: string;
    games: number;
    wins: number;
    losses: number;
  }[] = await getRanking(games, teams);

  const koBracket = koGames.map((game) => {
    const team1 = teams.find((team) => team.id === game.team1);
    const team2 = teams.find((team) => team.id === game.team2);

    if (!team1 || !team2) {
      throw new Error("Team not found");
    }

    return {
      id: game.id,
      name: game.name,
      team1,
      team2,
      winner: game.winner
        ? game.winner === game.team1
          ? "team1"
          : "team2"
        : (undefined as "team1" | "team2" | undefined),
      status: game.status as "PENDING" | "STARTED" | "FINISHED",
    };
  });

  const deciderBracket = deciderGames.map((game) => {
    const team1 = teams.find((team) => team.id === game.team1);
    const team2 = teams.find((team) => team.id === game.team2);

    if (!team1 || !team2) {
      throw new Error("Team not found");
    }

    return {
      id: game.id,
      name: game.name,
      team1,
      team2,
      winner: game.winner
        ? game.winner === game.team1
          ? "team1"
          : "team2"
        : (undefined as "team1" | "team2" | undefined),
      status: game.status as "PENDING" | "STARTED" | "FINISHED",
    };
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead>Spiele</TableHead>
            <TableHead>W</TableHead>
            <TableHead>L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((team) => (
            <TableRow key={team.teamName}>
              <TableCell className="flex flex-row items-center font-medium">
                <Image
                  src={`${team.teamLogo}`}
                  alt={team.teamName}
                  className="object-cover w-6 h-6 mr-2 rounded-full "
                  width={60}
                  height={60}
                />
                <p>{team.teamName}</p>
              </TableCell>
              <TableCell>{team.games}</TableCell>
              <TableCell>{team.wins}</TableCell>
              <TableCell>{team.losses}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {deciderGames && deciderGames.length > 0 && (
        <div className="flex flex-col gap-2 mt-8">
          <h2 className="text-xl font-bold">Decider Runden</h2>
          {deciderBracket.map((game) => (
            <GameBox
              gameId={game.id}
              gameName={game.name}
              admin={user.email === "jonas@hoefflin.io" || user.email === "aa"}
              key={game.id}
              team1={{
                name: game.team1.name,
                profile: game.team1.image_url,
                id: game.team1.id,
              }}
              team2={{
                name: game.team2.name,
                profile: game.team2.image_url,
                id: game.team2.id,
              }}
              winner={game.winner}
              status={game.status}
            ></GameBox>
          ))}
        </div>
      )}
      {koGames && koGames.length === 0 && (
        <Card gradientOnBorder={true}>
          <h2 className="text-lg font-bold ">KO Runden folgen</h2>
        </Card>
      )}
      {koGames && koGames.length > 0 && (
        <div className="flex flex-col gap-2 mt-8">
          <h2 className="text-xl font-bold">KO Runden</h2>
          {koBracket.map((game) => (
            <GameBox
              gameId={game.id}
              gameName={game.name}
              admin={user.email === "jonas@hoefflin.io" || user.email === "aa"}
              key={game.id}
              team1={{
                name: game.team1.name,
                profile: game.team1.image_url,
                id: game.team1.id,
              }}
              team2={{
                name: game.team2.name,
                profile: game.team2.image_url,
                id: game.team2.id,
              }}
              winner={game.winner}
              status={game.status}
            ></GameBox>
          ))}
        </div>
      )}
    </>
  );
}
