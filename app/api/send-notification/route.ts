import { createClient } from "@/utils/supabase/server";
import webpush from "web-push";
import { NextResponse } from "next/server";

const vapidKeys = {
  publicKey:
    "BNXmJgyP8kPwoeIBL-prfsIYfddKz_r15IT9cnO5vohJ8PaB1nagZ6UkbX-ghGw-zbnpPgu50iH1kXNKxYXj4hk",
  privateKey: "uSnVfVYlF2BcS2ZUtERkFWYldRS6Foc4n2yaiG280Rg",
};
webpush.setVapidDetails(
  "mailto:myuserid@email.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(request: Request) {
  const supabase = createClient();

  const { data: users, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error(error);
    return NextResponse.error();
  }

  const subscriptions = users.map((user) => {
    return JSON.parse(user.subscription as string);
  });

  console.log(subscriptions);

  const notificationPayload = {
    title: "New Notification",
    body: "This is a new notification",
    icon: "https://some-image-url.jpg",
    data: {
      url: "https://example.com",
    },
  };

  Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        subscription,
        JSON.stringify(notificationPayload)
      )
    )
  )
    .then(() =>
      console.log("Successfully sent notification to all subscribers")
    )
    .catch((err) => {
      console.error("Error sending notification");
      // res.sendStatus(500);
    });
  return NextResponse.json({ success: true });
}
