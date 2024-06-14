"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Avatar from "../account/avatar";
import { useRouter } from "next/navigation";

export default function EditTeamForm({ user }: { user: User }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("teams")
        .select("*")
        .or(`player1.eq.${user.id},player2.eq.${user.id}`);

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }
      console.log(data);

      if (data) {
        setFullname(data[0].name);
        setTeamId(data[0].id);
        setAvatarUrl(data[0].image_url);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    fullname,
    avatar_url,
  }: {
    fullname: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      if (!teamId) return;
      if (!fullname) {
        alert("Name ist gefordert!");
        return;
      }
      if (!avatar_url) {
        alert("Avatar ist gefordert!");
        return;
      }

      const { error } = await supabase
        .from("teams")
        .update({
          name: fullname,
          image_url: avatar_url,
        })
        .eq("id", teamId);
      if (error) throw error;
      alert("Team geupdated!");
      router.push("/teams");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center ">
      <Avatar
        uid={user?.id ?? null}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ fullname, avatar_url: url });
        }}
      />
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="fullName">Name</label>
        <input
          className="px-4 py-2 mb-6 text-gray-500 border rounded-md bg-inherit"
          id="fullName"
          type="text"
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>

      <Button
        className="w-full py-2"
        variant="default"
        onClick={() => updateProfile({ fullname, avatar_url })}
        disabled={loading}
      >
        {loading ? "Laden ..." : "Update"}
      </Button>
    </div>
  );
}
