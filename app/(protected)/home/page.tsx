import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Card from "@/components/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GameBox from "@/components/gamebox";
import Image from "next/image";

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // get profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    return <div>Error loading profile</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("*");

  if (teamsError) {
    console.error(teamsError);
    return <div>Error loading teams</div>;
  }

  if (!teams) {
    return <div>Loading...</div>;
  }

  if (teams.length === 0) {
    return <div>No teams found</div>;
  }

  const myTeam = teams.find(
    (team) => team.player1 === user.id || team.player2 === user.id
  );

  if (!myTeam) {
    return (
      <Card gradientOnBorder={false}>
        <h1 className="mb-4 text-lg">Trete einem Team bei!</h1>
        <p>
          Du bist noch keinem Team beigetreten. Bitte trete einem Team bei, um
          an Spielen teilzunehmen.
        </p>
        <Link href="/teams">
          <Button className="w-full mt-2" variant={"secondary"}>
            Zur Teamseite
          </Button>
        </Link>
      </Card>
    );
  }

  const { data: player1, error: player1Error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", myTeam.player1)
    .single();

  if (player1Error) {
    console.error(player1Error);
    return <div>Error loading players</div>;
  }

  if (!player1) {
    return <div>Loading...</div>;
  }

  let player2 = null;
  if (myTeam.player2) {
    const { data, error: player2Error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", myTeam.player2!)
      .single();

    if (player2Error) {
      console.error(player2Error);
      return <div>Error loading players</div>;
    }

    if (!player2) {
      return <div>Loading...</div>;
    }
    player2 = data;
  }

  // get all games where myTeam is involved

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .or(`team1.eq.${myTeam.id},team1.eq.${myTeam.id}`);

  if (gamesError) {
    console.error(gamesError);
    return <div>Error loading games</div>;
  }

  if (!games) {
    return <div>Loading...</div>;
  }

  // get started games
  const { data: startedGames, error: startedGamesError } = await supabase
    .from("games")
    .select("*")
    .eq("status", "STARTED");

  if (startedGamesError) {
    console.error(startedGamesError);
    return <div>Error loading started games</div>;
  }

  if (!startedGames) {
    return <div>Loading...</div>;
  }

  if (startedGames.length === 0) {
    return <div>No started games found</div>;
  }

  const currentGameTeam1 = teams.find(
    (team) => team.id === startedGames[0].team1
  );
  const currentGameTeam2 = teams.find(
    (team) => team.id === startedGames[0].team2
  );

  if (!currentGameTeam1 || !currentGameTeam2) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card key={myTeam.id} gradientOnBorder={true}>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center gap-2">
            <Image
              src={`${myTeam.image_url}`}
              alt={myTeam.name}
              className="object-cover w-16 h-16 rounded-lg "
              width={60}
              height={60}
            />
            <h2 className="text-lg text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text ">
              {myTeam.name}
            </h2>
          </div>
          <div className="flex justify-around w-full mt-4">
            <div className="flex flex-row items-center gap-2">
              {player1.avatar_url ? (
                <Image
                  className="object-cover w-10 h-10 rounded-full "
                  src={`${player1.avatar_url}`}
                  alt={player1.full_name ?? "Spieler 1"}
                  width={32}
                  height={32}
                />
              ) : (
                <Image
                  className="object-cover w-10 h-10 rounded-full "
                  src={`MainAfter_1280x720.webp`}
                  alt={player1.full_name ?? "Spieler 1"}
                  width={32}
                  height={32}
                />
              )}
              <p>{player1.full_name}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              {player2 && player2.avatar_url ? (
                <Image
                  className="object-cover w-10 h-10 rounded-full "
                  src={`${player2.avatar_url}`}
                  alt={player2.full_name ?? "Spieler 2"}
                  width={32}
                  height={32}
                />
              ) : (
                <Image
                  className="object-cover w-10 h-10 rounded-full "
                  src={`MainAfter_1280x720.webp`}
                  alt={"Spieler 2"}
                  width={32}
                  height={32}
                />
              )}
              <p>{player2 ? player2.full_name : "Spieler 2"}</p>
            </div>
          </div>
        </div>
      </Card>
      <h2>Aktuelles Spiel</h2>
      <GameBox
        admin={false}
        gameId={startedGames[0].id}
        team1={{
          id: currentGameTeam1.id,
          name: currentGameTeam1.name,
          profile: currentGameTeam1.image_url,
        }}
        team2={{
          id: currentGameTeam2.id,
          name: currentGameTeam2.name,
          profile: currentGameTeam2.image_url,
        }}
        status={startedGames[0].status}
        gameName={startedGames[0].name}
      />
      <h2>Deine Spiele</h2>
      {games.map((game) => {
        const team1 = teams.find((team) => team.id === game.team1);
        const team2 = teams.find((team) => team.id === game.team2);

        if (!team1 || !team2) {
          return <div>Loading...</div>;
        }

        return (
          <GameBox
            key={game.id}
            admin={false}
            gameId={game.id}
            team1={{
              id: team1.id,
              name: team1.name,
              profile: team1.image_url,
            }}
            team2={{
              id: team2.id,
              name: team2.name,
              profile: team2.image_url,
            }}
            winner={game.winner && game.winner === team1.id ? "team1" : "team2"}
            status={game.status}
            gameName={game.name}
          />
        );
      })}
    </>
  );
}
