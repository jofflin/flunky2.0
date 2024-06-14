import Image from "next/image";
import Card from "./card";

export type TeamBoxProps = {
  children?: React.ReactNode;
  team1: {
    name: string;
    profile: string;
  };
  team2: {
    name: string;
    profile: string;
  };
  winner?: "team1" | "team2";
};

export default function TeamBox({
  children,
  team1,
  team2,
  winner,
  status,
}: GameBoxProps) {
  const imageStyle = {
    borderRadius: "50%",
  };

  return (
    <Card gradientOnBorder={status !== GameStatus.STARTED}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-semibold ">
            <Image
              className={`w-12 h-12 rounded-full ${
                status !== GameStatus.STARTED && winner !== "team2"
                  ? "border-2 custom-card-border"
                  : ""
              } ${winner === "team2" ? "grayscale" : ""}`}
              src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
              alt="team1"
              style={imageStyle}
              width={60}
              height={60}
            />
            <p
              className={
                status === GameStatus.FINISHED
                  ? winner === "team1"
                    ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text animate-text"
                    : "text-gray-400"
                  : status === GameStatus.PENDING
                  ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 bg-clip-text"
                  : ""
              }
            >
              {team1.name}
            </p>
          </div>
        </div>
        <div className="text-gray-600">vs</div>
        <div className="flex items-center justify-end gap-2 font-semibold ">
          <p
            className={
              status === GameStatus.FINISHED
                ? winner === "team2"
                  ? "text-transparent bg-gradient-to-r from-lime-700 via-lime-200 to-lime-400 bg-clip-text animate-text"
                  : "text-gray-400"
                : ""
            }
          >
            {team2.name}
          </p>
          <Image
            className={`w-12 h-12 rounded-full ${
              status !== GameStatus.STARTED && winner !== "team1"
                ? "border-2 custom-card-border"
                : ""
            } ${winner === "team1" ? "grayscale" : ""}`}
            src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
            alt="team1"
            style={imageStyle}
            width={60}
            height={60}
          />
        </div>
      </div>
      {children}
    </Card>
  );
}
