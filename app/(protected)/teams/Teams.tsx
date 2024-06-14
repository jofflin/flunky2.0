import Card from "@/components/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export type TeamOverviewPageProps = {
  teams: {
    created_at: string;
    id: number;
    image_url: string;
    name: string;
    player1: string;
    player2: string | null;
  }[];
  user: {
    id: string;
  };
  players: {
    avatar_url: string | null;
    full_name: string | null;
    id: string;
    updated_at: string | null;
    username: string | null;
    website: string | null;
  }[];
};

export default async function TeamOverviewPage({
  teams,
  players,
  user,
}: TeamOverviewPageProps) {
  const supabase = createClient();
  const playerTeam = teams.find(
    (team) => team.player1 === user.id || team.player2 === user.id
  );

  const teamsList = teams.map((team) => {
    const player1 = players.find((player) => player.id === team.player1);
    const player2 = players.find(
      (player) => team.player2 && player.id === team.player2
    );

    return {
      ...team,
      player1: {
        name: player1?.full_name || "??",
        avatar: player1?.avatar_url,
      },
      player2: {
        name: player2?.full_name || "??",
        avatar: player2?.avatar_url,
      },
    };
  });

  return (
    <>
      <Link href="/team">
        <Button className="w-full">
          Team Bearbeiten (ID: {playerTeam?.id})
        </Button>
      </Link>
      <div className="flex flex-col gap-2">
        {teamsList.map((team) => (
          <Card key={team.id} gradientOnBorder={true}>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={`${team.image_url}`}
                  alt={team.name}
                  className="object-cover w-16 h-16 rounded-lg "
                  width={60}
                  height={60}
                />
                <h2 className="text-lg text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text ">
                  {team.name}
                </h2>
              </div>
              <div className="flex justify-around w-full mt-4">
                <div className="flex flex-row items-center gap-2">
                  {team.player1.avatar ? (
                    <Image
                      className="object-cover w-10 h-10 rounded-full "
                      src={`${team.player1.avatar}`}
                      alt={team.player1.name}
                      width={32}
                      height={32}
                    />
                  ) : (
                    <Image
                      className="object-cover w-10 h-10 rounded-full "
                      src={`MainAfter_1280x720.webp`}
                      alt={team.player1.name}
                      width={32}
                      height={32}
                    />
                  )}
                  <p>{team.player1.name}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  {team.player2.avatar ? (
                    <Image
                      className="object-cover w-10 h-10 rounded-full "
                      src={`${team.player2.avatar}`}
                      alt={team.player2.name}
                      width={32}
                      height={32}
                    />
                  ) : (
                    <Image
                      className="object-cover w-10 h-10 rounded-full "
                      src={`MainAfter_1280x720.webp`}
                      alt={team.player2.name}
                      width={32}
                      height={32}
                    />
                  )}
                  <p>{team.player2.name}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
