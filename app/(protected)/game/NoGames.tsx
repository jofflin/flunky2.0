import Card from "@/components/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/app/login/submit-button";
import { generateMatches } from "@/utils/api/random";

export default async function NoGamesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const generateGames = async () => {
    "use server";

    const supabase = createClient();

    console.log("Generating Games");
    // Generate All Group Games
    await generateMatches();

    return redirect("/game");
  };

  if (user.email !== "jonas@hoefflin.io") {
    return (
      <Card gradientOnBorder={true}>
        <p className="text-center">
          Hier siehst du alle Spiele sobald sie generiert sind
        </p>
      </Card>
    );
  }

  return (
    <Card gradientOnBorder={true}>
      <form>
        <SubmitButton className="w-full py-2" formAction={generateGames}>
          Gruppenspiele Generieren
        </SubmitButton>
      </form>
    </Card>
  );
}
