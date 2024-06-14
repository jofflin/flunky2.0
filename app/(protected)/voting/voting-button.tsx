"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
  sendInfo: (id: number, user: string) => void;
  teamId: number;
  user: string;
};

export function VotingButton({ children, user, teamId, sendInfo }: Props) {
  return (
    <div className="p-2">
      <Button
        onClick={() => sendInfo(teamId, user)}
        variant={"secondary"}
        type="submit"
        className="w-full"
      >
        {children}
      </Button>
    </div>
  );
}
