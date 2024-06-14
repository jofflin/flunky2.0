import { SubmitButton } from "@/app/login/submit-button";
import Card from "@/components/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { VotingButton } from "./voting-button";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";

export default async function FinalsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("*");

  if (profileError) {
    console.error(profileError);
    return <div>Error loading profile</div>;
  }

  if (!profiles) {
    return <div>Loading...</div>;
  }

  const myProfile = profiles.find((p) => p.id === user.id);

  if (!myProfile) {
    return <div>No profile found</div>;
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

  const vote = async (id: number, user: string) => {
    "use server";

    const supabase = createClient();

    await supabase.from("profiles").upsert({
      id: user,
      vote: id,
    });
    // get id as number
  };

  if (profiles.length !== 17) {
    return (
      <Card gradientOnBorder={true}>
        Es haben sich noch nicht alle registriert!
      </Card>
    );
  }

  if (teams.length !== 8) {
    return (
      <Card gradientOnBorder={true}>
        Es haben sich noch nicht alle Teams registriert!
      </Card>
    );
  }

  // check if all profiles have voted
  if (profiles.findIndex((p) => !p.vote) === -1) {
    const teamRanking = teams.map((team) => {
      // count votes for team
      const votes = profiles.filter((p) => p.vote === team.id).length;
      return {
        ...team,
        votes,
      };
    });
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead>Votes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamRanking.map((team, index) => (
            <TableRow key={team.name}>
              <TableCell className="flex flex-row items-center font-medium">
                <Image
                  src={`${team.image_url}`}
                  alt={team.name}
                  className="object-cover w-6 h-6 mr-2 rounded-full "
                  width={60}
                  height={60}
                />
                <p>{team.name}</p>
              </TableCell>
              <TableCell>{team.votes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (myProfile.vote) {
    const team = teams.find((team) => team.id === myProfile.vote);

    if (!team) {
      return <div>Team not found</div>;
    }
    return (
      <>
        <Card gradientOnBorder={true}>
          <h1 className="mb-4 text-lg">Bestes Kostüm Voting</h1>
          <p className="mb-4">Du hast abgestimmt!</p>
        </Card>
        <div className="bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 animate-text overflow-hidden bg-white  rounded-md shadow-md">
          <h1 className="mt-4 mb-2 text-lg text-center text-xl">{team.name}</h1>
          <Image
            src={`${team.image_url}`}
            alt={team.name}
            className="object-cover aspect-square rounded-lg w-full overflow-hidden bg-white  rounded-md shadow-md custom-card-border border-2"
            width={800}
            height={600}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Card gradientOnBorder={true}>
        <h1 className="mb-4 text-lg">Bestes Kostüm Voting</h1>
        <p className="mb-4">Wähle das beste Kostüm aus!</p>
      </Card>
      {teams.map((team) => (
        <form className="bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 animate-text overflow-hidden bg-white  rounded-md shadow-md">
          <h1 className="mt-4 mb-2 text-lg text-center text-xl">{team.name}</h1>
          <Image
            src={`${team.image_url}`}
            alt={team.name}
            className="object-cover aspect-square rounded-lg w-full overflow-hidden bg-white  rounded-md shadow-md custom-card-border border-2 mb-2"
            width={800}
            height={600}
          />
          <VotingButton
            className="w-full"
            user={myProfile.id}
            teamId={team.id}
            sendInfo={vote}
          >
            Abstimmen
          </VotingButton>
        </form>
      ))}
    </>
  );
}
