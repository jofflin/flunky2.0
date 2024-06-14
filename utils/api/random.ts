import { createClient } from "../supabase/server";

export const generateMatches = async () => {
  const supabase = createClient();

  const { data: teams } = await supabase.from("teams").select("*");

  if (!teams) {
    return [];
  }

  // Shuffle the teams
  const shuffledTeams = teams.sort(() => Math.random() - 0.5);

  const matches = schedule(shuffledTeams.length);

  console.log(matches);
  let id = 1;

  const teamObjects: {
    id: number;
    team1: number;
    team2: number;
    name: string;
    status: "PENDING" | "STARTED" | "FINISHED";
  }[] = [];
  matches.forEach((matchDay) => {
    matchDay.forEach((match) => {
      teamObjects.push({
        id,
        team1: shuffledTeams[match[0]].id,
        team2: shuffledTeams[match[1]].id,
        status: id === 1 ? "STARTED" : "PENDING",
        name: "Spiel " + id,
      });
      id++;
    });
  });

  console.log(teamObjects);
  // Write matches to the database
  const { error } = await supabase.from("games").insert(teamObjects);
  console.log(error);
};

const getMatches = (data) => {
  let matches = [];
  let i = 0;

  while (data.length) {
    for (const [index, entry] of data.entries()) {
      if (data.length === 1) {
        matches[i - 1].push(entry);
        data.splice(index, 1);
        break;
      }

      if (index === 0) {
        matches.push([entry]);

        data.splice(index, 1);
        continue;
      }

      const [team1, team2] = entry;
      const idx = matches[i].findIndex(
        (value) => value.includes(team1) || value.includes(team2)
      );

      if (idx !== -1) {
        continue;
      }

      matches[i].push(entry);
      data.splice(index, 1);
    }

    i++;
  }

  return matches;
};

const schedule = (n) => {
  const teams = [...Array(n).keys()];
  const games = teams.flatMap((t1, i) =>
    teams.slice(i + 1).map((t2) => [t1, t2])
  );
  const meetings = Array.from(Array(n + (n % 2) - 1), () => []);

  if (solve(games, meetings, 0, 0)) {
    return meetings;
  }

  throw new Error("No solution found");
};

const solve = (games, meetings, gi, mi) => {
  if (gi === games.length) {
    return true;
  }

  if (satisfies(games[gi], meetings[mi])) {
    meetings[mi].push(games[gi]);

    for (let i = 0; i < meetings.length; i++) {
      if (solve(games, meetings, gi + 1, i)) {
        return true;
      }
    }

    meetings[mi].pop();
  }

  return false;
};

const satisfies = (game, meeting) => {
  const [t1, t2] = game;
  const played = new Set(meeting.flat());

  return !played.has(t1) && !played.has(t2);
};
