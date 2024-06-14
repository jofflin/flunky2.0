import Image from "next/image";
import Card from "./card";
import { SubmitButton } from "@/app/login/submit-button";
import { swapWinner, updateGame } from "@/utils/api/games";
import { redirect } from "next/navigation";
import { MdCompareArrows } from "react-icons/md";

export type GameBoxProps = {
  children?: React.ReactNode;
  team1: {
    id: number;
    name: string;
    profile: string;
  };
  team2: {
    id: number;
    name: string;
    profile: string;
  };
  winner?: "team1" | "team2";
  status: "PENDING" | "STARTED" | "FINISHED";
  gameId: number;
  gameName: string;
  admin: boolean;
  nextGameId?: number;
};

export default function GameBox({
  children,
  team1,
  team2,
  admin,
  gameId,
  gameName,
  winner,
  status,
}: GameBoxProps) {
  const imageStyle = {
    borderRadius: "50%",
  };

  const winner1Selected = async (formData: FormData) => {
    "use server";
    console.log("winner1Selected");
    const game = await updateGame(gameId, team1.id);
    return redirect("/game");
  };
  const winner2Selected = async (formData: FormData) => {
    "use server";
    console.log("winner2Selected");
    // create 15 profiles
    const game = await updateGame(gameId, team2.id);
    return redirect("/game");
  };

  const changeWinner = async (formData: FormData) => {
    "use server";
    console.log("changeWinner");
    const game = await swapWinner(gameId);
    return redirect("/game");
  };

  return (
    <Card gradientOnBorder={status !== "STARTED"}>
      <h3 className="mb-2 font-semibold text-md">{gameName}</h3>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-lg text-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Image
              className={`w-12 h-12 rounded-full ${
                status !== "STARTED" && winner !== "team2"
                  ? "border-2 custom-card-border"
                  : ""
              } ${winner === "team2" ? "grayscale" : ""}`}
              src={`${team1.profile}`}
              alt="team1"
              style={imageStyle}
              width={60}
              height={60}
            />
            <p
              className={
                status === "FINISHED"
                  ? winner === "team1"
                    ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text animate-text"
                    : "text-gray-400"
                  : status === "PENDING"
                  ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text"
                  : ""
              }
            >
              {team1.name}
            </p>
          </div>
          <form className="mt-2">
            {status === "STARTED" && admin && (
              <SubmitButton
                className="px-2 py-1 text-white rounded-md bg-lime-700"
                formAction={winner1Selected}
                pendingText="Laden"
              >
                Sieg
              </SubmitButton>
            )}
          </form>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-gray-600">vs</div>
          {status === "FINISHED" && admin && (
            <form className="my-4">
              <SubmitButton
                className="px-2 py-1 text-white rounded-md bg-lime-700"
                formAction={changeWinner}
                pendingText="Laden"
              >
                <MdCompareArrows className="w-6 h-6" />
              </SubmitButton>
            </form>
          )}
        </div>

        <div className="flex flex-col ml-auto">
          <div className="flex items-center self-center gap-2">
            <p
              className={
                status === "FINISHED"
                  ? winner === "team2"
                    ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text animate-text"
                    : "text-gray-400"
                  : status === "PENDING"
                  ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text"
                  : ""
              }
            >
              {team2.name}
            </p>
            <Image
              className={`w-12 h-12 rounded-full ${
                status !== "STARTED" && winner !== "team1"
                  ? "border-2 custom-card-border"
                  : ""
              } ${winner === "team1" ? "grayscale" : ""}`}
              src={`${team2.profile}`}
              alt="team1"
              style={imageStyle}
              width={60}
              height={60}
            />
          </div>
          <form className="mt-2 ml-auto w-min">
            {status === "STARTED" && admin && (
              <SubmitButton
                className="px-2 py-1 text-white rounded-md bg-lime-700"
                formAction={winner2Selected}
                pendingText="Laden"
              >
                Sieg
              </SubmitButton>
            )}
          </form>
        </div>
      </div>
      {children}
    </Card>
  );
}

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}
