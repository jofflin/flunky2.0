"use client";
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
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function TVScreen() {
  const supabase = createClient();
  const [tableData, setTableData] = useState<
    {
      teamName: string;
      teamLogo: string;
      games: number;
      wins: number;
      losses: number;
    }[]
  >([]);

  const [gameList, setGameList] = useState<
    {
      id: number;
      name: string;
      team1: { name: string; image_url: string; id: number };
      team2: { name: string; image_url: string; id: number };
      winner: "team1" | "team2" | undefined;
      status: "PENDING" | "STARTED" | "FINISHED";
    }[]
  >([]);
  const imageStyle = {
    borderRadius: "50%",
  };

  const fetchInformation = async () => {
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("*");
    // only games that are finished
    const { data: games, error: gamesError } = await supabase
      .from("games")
      .select("*")
      .order("id", { ascending: true });

    if (teamsError || gamesError) {
      console.error(teamsError || gamesError);
      return <div>Error loading data</div>;
    }

    setTableData(
      teams
        .map((team) => {
          const teamGames = games.filter(
            (game) =>
              (game.team1 === team.id || game.team2 === team.id) &&
              !game.decider &&
              !game.ko_game &&
              game.status === "FINISHED"
          );
          const teamWins = teamGames.filter((game) => game.winner === team.id);
          const teamLosses = teamGames.filter(
            (game) => game.winner !== team.id && game.status === "FINISHED"
          );

          return {
            teamName: team.name,
            teamLogo: team.image_url,
            games: teamGames.length,
            wins: teamWins.length,
            losses: teamLosses.length,
          };
        })
        .sort((a, b) => b.wins - a.wins)
    );

    setGameList(
      games.map((game) => {
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
      })
    );
  };

  // Listen to inserts
  supabase
    .channel("supabase_realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "games",
      },
      fetchInformation
    )
    .subscribe();

  useEffect(() => {
    fetchInformation();
  }, []);

  console.log(gameList);
  return (
    <div className="flex flex-row justify-start gap-12 p-4 w-full">
      <div>
        <h1>Tabelle</h1>
        <Table className="w-min">
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>G</TableHead>
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
      </div>
      <div className="w-full flex-grow ">
        <h1>Spiele</h1>
        {gameList && gameList.length > 0 && (
          <div className="flex flex-col">
            <div className="grid grid-cols-5 gap-2 mt-4">
              {gameList.map((game) => (
                <div className="" key={game.id}>
                  <Card gradientOnBorder={game.status !== "STARTED"}>
                    <h3 className="mb-2 font-semibold text-md">{game.name}</h3>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-lg text-sm">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Image
                            className={`w-12 h-12 rounded-full ${
                              game.status !== "STARTED" &&
                              game.winner !== "team2"
                                ? "border-2 custom-card-border"
                                : ""
                            } ${game.winner === "team2" ? "grayscale" : ""}`}
                            src={`${game.team1.image_url}`}
                            alt="team1"
                            style={imageStyle}
                            width={60}
                            height={60}
                          />
                          <p
                            className={
                              game.status === "FINISHED"
                                ? game.winner === "team1"
                                  ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text animate-text"
                                  : "text-gray-400"
                                : game.status === "PENDING"
                                ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text"
                                : ""
                            }
                          >
                            {game.team1.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-gray-600">vs</div>
                      </div>

                      <div className="flex flex-col ml-auto">
                        <div className="flex items-center self-center gap-2">
                          <p
                            className={
                              game.status === "FINISHED"
                                ? game.winner === "team2"
                                  ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text animate-text"
                                  : "text-gray-400"
                                : game.status === "PENDING"
                                ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text"
                                : ""
                            }
                          >
                            {game.team2.name}
                          </p>
                          <Image
                            className={`w-12 h-12 rounded-full ${
                              game.status !== "STARTED" &&
                              game.winner !== "team1"
                                ? "border-2 custom-card-border"
                                : ""
                            } ${game.winner === "team1" ? "grayscale" : ""}`}
                            src={`${game.team2.image_url}`}
                            alt="team1"
                            style={imageStyle}
                            width={60}
                            height={60}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                  {/* <GameBox
                    gameId={game.id}
                    gameName={game.name}
                    key={game.id}
                    admin={false}
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
                  ></GameBox> */}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* <div className="flex flex-col">
          <h2 className="text-xl font-bold">Aktuelles Spiel</h2>
          <div className="grid grid-cols-5 gap-2 mt-4">
            <GameBox
              gameId={currentGame.id}
              gameName={currentGame.name}
              key={currentGame.id}
              admin={false}
              team1={{
                name: currentGame.team1.name,
                profile: currentGame.team1.image_url,
                id: currentGame.team1.id,
              }}
              team2={{
                name: currentGame.team2.name,
                profile: currentGame.team2.image_url,
                id: currentGame.team2.id,
              }}
              winner={currentGame.winner}
              status={currentGame.status}
            ></GameBox>
          </div>
        </div>
        {nextGames && nextGames.length > 0 && (
          <div className="flex flex-col mt-12">
            <h2 className="text-xl font-bold">Die Nächsten Spiele</h2>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {nextGames.map((game) => (
                <div className="">
                  <GameBox
                    gameId={game.id}
                    gameName={game.name}
                    key={game.id}
                    admin={false}
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
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
