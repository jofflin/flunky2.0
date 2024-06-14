export type CardProps = {
  children: React.ReactNode;
  gradientOnBorder: boolean;
};

export default function Card({ children, gradientOnBorder }: CardProps) {
  return (
    <div
      className={`overflow-hidden bg-white  rounded-md shadow-md border-2 ${
        gradientOnBorder
          ? "custom-card-border "
          : " bg-gradient-to-r from-lime-700 via-lime-500 to-lime-400 animate-text"
      }`}
    >
      <div className="p-4">{children}</div>
    </div>
  );
}
