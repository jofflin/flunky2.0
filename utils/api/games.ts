import { createClient } from "../supabase/server";

export const getDeciders = async () => {
  const supabase = createClient();

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*");
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("*");

  if (gamesError || teamsError) {
    console.error("Error loading games");
  }

  if (!games || !teams) {
    return;
  }

  // check if all games are finished
  const allGamesFinished = games.every(
    (game) =>
      game.status === "FINISHED" &&
      game.decider === false &&
      game.ko_game === false
  );

  if (!allGamesFinished) {
    return;
  }

  const teamRanking = teams
    .map((team) => {
      const teamGames = games.filter(
        (game) => game.team1 === team.id || game.team2 === team.id
      );
      const teamWins = teamGames.filter((game) => game.winner === team.id);
      return {
        teamId: team.id,
        wins: teamWins.length,
      };
    })
    .sort((a, b) => b.wins - a.wins);

  // check if 7 and 6 have the same amount of wins
  if (teamRanking[6].wins === teamRanking[5].wins && games.length === 28) {
    // create decider games for top 6
    await createDeciderGames(
      teamRanking.filter((team) => team.wins === teamRanking[6].wins)
    );
  }
  // check if 5 and 4 have the same amount of wins
  if (teamRanking[4].wins === teamRanking[3].wins && games.length === 28) {
    // create decider games for top 4
    await createDeciderGames(
      teamRanking.filter((team) => team.wins === teamRanking[4].wins)
    );
  }

  // getLowestIdGame
  const { data: lowestIdGame, error: lowestIdGameError } = await supabase
    .from("games")
    .select("*")
    .order("id", { ascending: true })
    .eq("status", "PENDING");

  if (lowestIdGameError) {
    console.error(lowestIdGameError);
  }

  if (!lowestIdGame || lowestIdGame.length === 0) {
    return;
  }

  // set lowest id game to started
  await supabase
    .from("games")
    .update({
      status: "STARTED",
    })
    .eq("id", lowestIdGame[0].id);

  // get ranking
};

export const getFinalGames = async () => {
  const supabase = createClient();

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*");
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("*");

  if (gamesError || teamsError) {
    console.error("Error loading games");
  }

  if (!games || !teams) {
    return;
  }

  // check if all games are finished
  const allGamesFinished = games.every(
    (game) => game.status === "FINISHED" && game.ko_game === false
  );

  if (!allGamesFinished) {
    return;
  }

  const groupGames = games.filter((game) => game.decider === false);
  const deciderGames = games.filter((game) => game.decider === true);

  const teamRanking = teams
    .map((team) => {
      const teamGames = groupGames.filter(
        (game) => game.team1 === team.id || game.team2 === team.id
      );
      const teamWins = teamGames.filter((game) => game.winner === team.id);
      return {
        teamId: team.id,
        wins: teamWins.length,
      };
    })
    .sort((a, b) => b.wins - a.wins);

  const deciderRanking = teams
    .map((team) => {
      const teamGames = deciderGames.filter(
        (game) => game.team1 === team.id || game.team2 === team.id
      );
      const teamWins = teamGames.filter((game) => game.winner === team.id);
      return {
        teamId: team.id,
        wins: teamWins.length,
      };
    })
    .sort((a, b) => b.wins - a.wins);

  console.log(1, teamRanking);
  console.log(2, deciderRanking);

  if (deciderGames.length !== 0) {
    // check if 7 and 6 have the same amount of wins
    if (teamRanking[6].wins === teamRanking[5].wins) {
      const wrongOrderTeams = teamRanking.filter(
        (team) => team.wins === teamRanking[6].wins
      );
      let correctOrderTeams = deciderRanking.filter((team) =>
        wrongOrderTeams.find(
          (wrongOrderTeam) => wrongOrderTeam.teamId === team.teamId
        )
          ? true
          : false
      );

      console.log(3, correctOrderTeams);
      console.log(4, wrongOrderTeams);

      while (correctOrderTeams.length > 0) {
        const el = correctOrderTeams.shift();
        const index = teamRanking.findIndex(
          (team) => team.wins === teamRanking[6].wins
        );
        if (index === -1) {
          break;
        }
        if (!el) {
          break;
        }
        teamRanking[index] = el;
      }

      // create decider games for top 6
    }
    // check if 5 and 4 have the same amount of wins
    if (teamRanking[4].wins === teamRanking[3].wins) {
      const wrongOrderTeams = teamRanking.filter(
        (team) => team.wins === teamRanking[4].wins
      );
      let correctOrderTeams = deciderRanking.filter((team) =>
        wrongOrderTeams.find(
          (wrongOrderTeam) => wrongOrderTeam.teamId === team.teamId
        )
          ? true
          : false
      );

      while (correctOrderTeams.length > 0) {
        const el = correctOrderTeams.shift();
        const index = teamRanking.findIndex(
          (team) => team.wins === teamRanking[4].wins
        );
        if (index === -1) {
          break;
        }
        if (!el) {
          break;
        }
        teamRanking[index] = el;
      }
    }
  }

  await supabase.from("games").insert([
    {
      team1: teamRanking[6].teamId,
      team2: teamRanking[7].teamId,
      status: "STARTED",
      ko_game: true,
      name: "Platz 7",
    },
    {
      team1: teamRanking[4].teamId,
      team2: teamRanking[5].teamId,
      status: "PENDING",
      ko_game: true,
      name: "Platz 5",
    },
    {
      team1: teamRanking[0].teamId,
      team2: teamRanking[3].teamId,
      status: "PENDING",
      ko_game: true,
      name: "Halbfinale 1",
    },
    {
      team1: teamRanking[1].teamId,
      team2: teamRanking[2].teamId,
      status: "PENDING",
      ko_game: true,
      name: "Halbfinae 2",
    },
  ]);
};

export const getFinal = async () => {
  const supabase = createClient();

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*");

  if (gamesError) {
    console.error("Error loading games");
  }

  if (!games) {
    return;
  }

  // check if all games are finished
  const allGamesFinished = games.every((game) => game.status === "FINISHED");

  if (!allGamesFinished) {
    return;
  }

  const finalGames = games
    .filter((game) => game.ko_game === true)
    .sort((a, b) => a.id - b.id);

  if (finalGames.length !== 4) {
    return;
  }

  await supabase.from("games").insert([
    {
      team1:
        finalGames[3].winner === finalGames[3].team1
          ? finalGames[3].team2
          : finalGames[3].team1,
      team2:
        finalGames[2].winner === finalGames[2].team1
          ? finalGames[2].team2
          : finalGames[2].team1,
      status: "STARTED",
      ko_game: true,
      name: "Platz 3",
    },
    {
      team1: finalGames[3].winner,
      team2: finalGames[2].winner,
      status: "PENDING",
      ko_game: true,
      name: "Finale",
    },
  ]);
};

const createDeciderGames = async (
  teams: { teamId: number; wins: number }[]
) => {
  console.log("Creating decider games");
  console.log(teams);
  // each team plays against each other
  const supabase = createClient();

  const deciderGames = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      deciderGames.push({
        team1: teams[i].teamId,
        team2: teams[j].teamId,
        status: "PENDING" as "PENDING" | "STARTED" | "FINISHED",
        decider: true,
        name: "Decider Game",
      });
    }
  }

  console.log(deciderGames);

  const { error } = await supabase.from("games").insert(deciderGames);
  console.log(error);
};

export const swapWinner = async (gameId: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (error) {
    console.error(error);
  }

  const winner = data?.winner === data?.team1 ? data?.team2 : data?.team1;

  const { data: updatedData, error: updatedError } = await supabase
    .from("games")
    .update({
      winner,
    })
    .eq("id", gameId);
};

export const updateGame = async (gameId: number, winner: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("games")
    .update({
      winner,
      status: "FINISHED",
    })
    .eq("id", gameId);

  if (error) {
    console.error(error);
  }

  // set next game status to STARTED

  const { data: nextGame, error: nextGameError } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId + 1)
    .single();

  if (nextGameError) {
    console.error(nextGameError);
  }

  if (nextGame) {
    const { data, error } = await supabase
      .from("games")
      .update({
        status: "STARTED",
      })
      .eq("id", nextGame.id);

    if (error) {
      console.error(error);
    }
  }
};

export const getRanking = async (
  games: {
    created_at: string;
    id: number;
    status: "PENDING" | "STARTED" | "FINISHED";
    team1: number | null;
    team2: number | null;
    winner: number | null;
  }[],
  teams: {
    created_at: string;
    id: number;
    image_url: string;
    name: string;
    player1: string;
    player2: string | null;
  }[]
): Promise<
  {
    teamName: string;
    teamLogo: string;
    games: number;
    wins: number;
    losses: number;
  }[]
> => {
  let tableData: {
    teamName: string;
    teamLogo: string;
    games: number;
    wins: number;
    losses: number;
  }[] = [];

  if (teams && games) {
    tableData = teams
      .map((team) => {
        const teamGames = games.filter(
          (game) => game.team1 === team.id || game.team2 === team.id
        );
        const teamWins = teamGames.filter((game) => game.winner === team.id);
        const teamLosses = teamGames.filter((game) => game.winner !== team.id);

        return {
          teamName: team.name,
          teamLogo: team.image_url,
          games: teamGames.length,
          wins: teamWins.length,
          losses: teamLosses.length,
        };
      })
      .sort((a, b) => b.wins - a.wins);
  }
  return tableData;
};
