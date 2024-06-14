import Card from "@/components/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function NoTeamPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const createTeam = async (formData: FormData) => {
    "use server";

    const fullName = formData.get("fullName") as string;
    const supabase = createClient();

    const { data, error } = await supabase.from("teams").insert({
      image_url: "MainAfter_1280x720.webp",
      name: fullName,
      id: randomNumber(5),
      player1: user.id,
    });

    console.log(data);
    console.log(error);

    return redirect("/teams");
  };

  const joinTeam = async (formData: FormData) => {
    "use server";

    const code = formData.get("code") as string;
    const supabase = createClient();

    const { data: team, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", code)
      .single();

    if (error) {
      return redirect("/teams?error=team-not-found");
    }

    if (team.player2) {
      return redirect("/teams?error=team-full");
    }

    const { data, error: joinError } = await supabase
      .from("teams")
      .update({
        player2: user.id,
      })
      .eq("id", code);

    if (joinError) {
      return redirect("/teams?error=team-error");
    }

    return redirect("/teams");
  };

  return (
    <>
      <Card gradientOnBorder={true}>
        <form>
          <div className="flex flex-col w-full gap-2">
            <input
              className="px-4 py-2 mb-6 border rounded-md bg-inherit"
              type="text"
              name="fullName"
              placeholder="Teamname"
              required
            />
          </div>

          <Button
            className="w-full py-2"
            variant="default"
            formAction={createTeam}
          >
            Team erstellen
          </Button>
        </form>
      </Card>
      <p className="text-center">oder</p>
      <Card gradientOnBorder={true}>
        <form>
          <div className="flex flex-col w-full gap-2">
            <input
              className="px-4 py-2 mb-6 border rounded-md bg-inherit"
              type="text"
              name="code"
              placeholder="Teamcode"
              required
            />
          </div>

          <Button
            className="w-full py-2"
            variant="default"
            formAction={joinTeam}
          >
            Team beitreten
          </Button>
        </form>
      </Card>
    </>
  );
}

function randomNumber(length: number): number {
  const chars = "0123456789";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];

  return parseInt(result);
}

function randomString(length: number) {
  const chars = "0123456789";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
