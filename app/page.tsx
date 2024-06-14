import { redirect } from "next/navigation";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Card from "@/components/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Index() {
  // const canInitSupabaseClient = () => {
  //   // This function is just for the interactive tutorial.
  //   // Feel free to remove it once you have Supabase connected.
  //   try {
  //     createClient();
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // };

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <img
        src="/logo.jpg"
        className="rounded-2xl"
        alt="Logo"
        width={200}
        height={200}
      />
      <Card gradientOnBorder>
        <h1 className="text-3xl font-bold text-center mb-2">Willkommen!</h1>
        <p className="text-center">
          Das ist die Flunky Cup App. Hier siehst du Regeln, Tabelle und
          Ergebnisse.
        </p>
        <Link href="/login">
          <Button className="w-full  mt-4">Einloggen</Button>
        </Link>
      </Card>
      <Card gradientOnBorder>
        <h1 className="text-2xl font-bold text-center mb-2">Wichtig!</h1>
        <p>Füge die App zuerst zu deinem Home-Bildschirm hinzu.</p>
        <p>Bei Apple dafür auf das Teilen-Symbol klicken.</p>
        <p>Bei Android auf das Menü und dann auf "Zum Startbildschirm".</p>
        <p>So kannst du die App auch offline nutzen.</p>
      </Card>
    </div>
  );
}
