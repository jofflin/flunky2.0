
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {BiBell, BiCog, BiLogOut, BiNotification} from "react-icons/bi";
import HeaderTitle from './header-title.component'

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

  const setupPush = async () => {
    "use server";
    console.log('setup push')
  }

  const settings = async () => {
    "use server";
    console.log('settings')
  }

  return (
    <header
      className="fixed top-0 z-50 flex items-center justify-between w-full px-4 py-4 text-gray-100 bg-yellow-500 ">
      <HeaderTitle/>
      <div className="flex gap-3">
      <form action={setupPush}>
        <button className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-100 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-200 hover:text-yellow-200 focus:border-yellow-200 focus:text-yellow-200 focus:outline-none">
          <BiBell className="w-8 h-8 text-white" />
        </button>
      </form>
      <form action={settings}>
        <button
          className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-100 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-200 hover:text-yellow-200 focus:border-yellow-200 focus:text-yellow-200 focus:outline-none">
          <BiCog className="w-8 h-8 text-white"/>
        </button>
      </form>
        <form action={signOut}>
          <button
            className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-100 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-200 hover:text-yellow-200 focus:border-yellow-200 focus:text-yellow-200 focus:outline-none">
            <BiLogOut className="w-8 h-8 text-white"/>
          </button>
        </form>
      </div>
    </header>
  )
}
