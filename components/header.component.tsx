import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  BiBell,
  BiCog,
  BiLogOut,
  BiNotification,
  BiParagraph,
} from "react-icons/bi";
import HeaderTitle from "./header-title.component";
import Link from "next/link";
import PushSetup from "./PushSetup";

export default async function Header() {
  // // return header with text on the left and icon on the right
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }
  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <header className="fixed top-0 z-50 flex items-center justify-between w-full px-4 py-4 text-gray-100 bg-gradient-to-l from-lime-500 to-lime-700 ">
      <HeaderTitle />
      <div className="flex gap-3">
        {/* <PushSetup userId={user.id} /> */}
        <Link href="/rules">
          <button className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-100 transition duration-150 ease-in-out border-b-2 border-transparent ">
            <BiParagraph className="w-8 h-8 text-white" />
          </button>
        </Link>
        <Link href="/account">
          <button className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-100 transition duration-150 ease-in-out border-b-2 border-transparent ">
            <BiCog className="w-8 h-8 text-white" />
          </button>
        </Link>
        <form action={signOut}>
          <button className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-100 transition duration-150 ease-in-out border-b-2 border-transparent ">
            <BiLogOut className="w-8 h-8 text-white" />
          </button>
        </form>
      </div>
    </header>
  );
}
