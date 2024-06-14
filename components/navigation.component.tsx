// Create Navigation component that is located at the bottom of the page like an mobile app

// Path: components/navigation.tsx

import { createClient } from "@/utils/supabase/server";
import {
  BiHomeAlt,
  BiSolidGroup,
  BiSolidTrophy,
  BiListOl,
} from "react-icons/bi";
import { MdScoreboard } from "react-icons/md";
import NavigationLink from "./navigation-item.component";

export default async function Navigation() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nav: Money Icon for creating fine and paying own fines
  return (
    <div className="fixed bottom-0 w-full pb-2 border-t border-gray-200 bg-gradient-to-t from-lime-500 to-lime-700 ">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <div className="flex justify-between h-16">
          <NavigationLink
            href="/home"
            icon={<BiHomeAlt className="w-8 h-8" />}
          />
          <NavigationLink
            href="/standings"
            icon={<BiListOl className="w-8 h-8" />}
          />
          <NavigationLink
            href="/game"
            icon={<MdScoreboard className="w-8 h-8" />}
          />
          <NavigationLink
            href="/teams"
            icon={<BiSolidGroup className="w-8 h-8" />}
          />
          <NavigationLink
            href="/voting"
            icon={<BiSolidTrophy className="w-8 h-8" />}
          />
        </div>
      </div>
    </div>
  );
}
