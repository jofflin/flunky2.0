import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/home");
  }

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(
        "/login?message=" +
          encodeURIComponent("Fehlgeschlagen! Bitte erneut versuchen.")
      );
    }

    return redirect("/home");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect(
        "/login?message=" +
          encodeURIComponent("Fehlgeschlagen! Bitte erneut versuchen.")
      );
    }

    return redirect(
      "/login?message=" + encodeURIComponent("Bitte bestätige deine E-Mail.")
    );
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full gap-2 px-8 sm:max-w-md">
      <form className="flex flex-col justify-center flex-1 w-full gap-2 animate-in text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          name="email"
          placeholder="name@web.de"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="px-4 py-2 mb-6 border rounded-md bg-inherit"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="px-4 py-2 mb-2 rounded-md bg-lime-700 text-foreground"
          pendingText="Einloggen..."
        >
          Einloggen{" "}
        </SubmitButton>
        <SubmitButton
          formAction={signUp}
          className="px-4 py-2 mb-2 border rounded-md border-foreground/20 text-foreground"
          pendingText="Registrieren..."
        >
          Registrieren{" "}
        </SubmitButton>
        {searchParams?.message && (
          <p className="p-4 mt-4 text-center bg-foreground/10 text-foreground">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
