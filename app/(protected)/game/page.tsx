import GameBox from "@/components/gamebox";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NoGamesPage from "./NoGames";
import { idText } from "typescript";
import { SubmitButton } from "@/app/login/submit-button";
import { getFinalGames, getDeciders, getFinal } from "@/utils/api/games";
import Card from "@/components/card";

export default async function GamePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .order("id", { ascending: true });

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("*");

  if (gamesError || teamsError) {
    console.error(gamesError);
    return <div>Error loading games</div>;
  }

  if (!games || !teams) {
    return <div>Loading...</div>;
  }

  if (games.length === 0) {
    return <NoGamesPage />;
  }

  const gameList: {
    id: number;
    name: string;
    winner: "team1" | "team2" | undefined;
    status: "PENDING" | "STARTED" | "FINISHED";
    team1: {
      id: number;
      name: string;
      profile: string;
    };
    team2: {
      id: number;
      name: string;
      profile: string;
    };
  }[] = games.map((game) => {
    const team1 = teams.find((team) => team.id === game.team1);
    const team2 = teams.find((team) => team.id === game.team2);
    if (!team1 || !team2) {
      throw new Error("Team not found");
    }
    return {
      id: game.id,
      name: game.name,
      winner: game.winner
        ? game.winner === game.team1
          ? "team1"
          : "team2"
        : undefined,
      status: game.status,
      team1: {
        id: team1.id,
        name: team1.name,
        profile: team1.image_url,
      },
      team2: {
        id: team2.id,
        name: team2.name,
        profile: team2.image_url,
      },
    };
  });

  const generateKo = async (formData: FormData) => {
    "use server";

    await getFinalGames();
    return redirect("/game");
  };

  const generateDecider = async (formData: FormData) => {
    "use server";
    await getDeciders();
    console.log("generateDecider");
    return redirect("/game");
  };

  const generateFinal = async (formData: FormData) => {
    "use server";
    await getFinal();
    console.log("generateFinal");
    return redirect("/game");
  };

  if (teams.length !== 8) {
    return (
      <Card gradientOnBorder={true}>
        Es haben sich noch nicht alle Teams registriert!
      </Card>
    );
  }

  return (
    <>
      {gameList.map((game) => (
        <GameBox
          gameId={game.id}
          gameName={game.name}
          admin={user.email === "jonas@hoefflin.io" || user.email === "aa"}
          key={game.id}
          team1={game.team1}
          team2={game.team2}
          status={game.status}
          winner={game.winner}
        ></GameBox>
      ))}
      <form className="w-full">
        <SubmitButton
          disabled={
            !gameList.every((game) => game.status === "FINISHED") ||
            games.length !== 28
          }
          className="w-full px-2 py-1 my-1 text-white rounded-md bg-lime-700 disabled:bg-gray-400"
          formAction={generateDecider}
          pendingText="Laden"
        >
          Decider erstellen
        </SubmitButton>
        <SubmitButton
          disabled={
            !gameList.every((game) => game.status === "FINISHED") ||
            games.length < 28
          }
          className="w-full px-2 py-1 my-1 text-white rounded-md bg-lime-700 disabled:bg-gray-400"
          formAction={generateKo}
          pendingText="Laden"
        >
          KO-Spiele erstellen
        </SubmitButton>
        <SubmitButton
          disabled={
            !gameList.every((game) => game.status === "FINISHED") ||
            games.length < 32
          }
          className="w-full px-2 py-1 my-1 text-white rounded-md bg-lime-700 disabled:bg-gray-400"
          formAction={generateFinal}
          pendingText="Laden"
        >
          Finale erstellen
        </SubmitButton>
      </form>
    </>
  );

  // return (
  //   <>
  //     <GameBox
  //       team1={{ name: "test", profile: "tt" }}
  //       team2={{ name: "test2", profile: "tt" }}
  //       status={GameStatus.PENDING}
  //     ></GameBox>

  //     <GameBox
  //       team1={{ name: "test", profile: "tt" }}
  //       team2={{ name: "test2", profile: "tt" }}
  //       status={GameStatus.STARTED}
  //     ></GameBox>
  //     <GameBox
  //       team1={{ name: "test", profile: "tt" }}
  //       team2={{ name: "Langer Name", profile: "tt" }}
  //       status={GameStatus.FINISHED}
  //       winner="team1"
  //     ></GameBox>
  //     <GameBox
  //       team1={{ name: "LangerName, Sogar sehr lange", profile: "tt" }}
  //       team2={{ name: "Langer Name", profile: "tt" }}
  //       status={GameStatus.FINISHED}
  //       winner="team2"
  //     ></GameBox>
  //   </>
  // );
}
