import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const { subscription, userId } = await request.json();

  console.log(subscription);
  console.log(userId);

  await supabase.from("profiles").upsert({
    id: userId,
    subscription,
  });

  return NextResponse.json({ success: true });
}
