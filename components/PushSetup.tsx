"use client";
import { createClient } from "@/utils/supabase/client";
import { BiBell } from "react-icons/bi";

export default function PushSetup({ userId }: { userId: string }) {
  // // return header with text on the left and icon on the right
  const supabase = createClient();

  const setupPush = async () => {
    // const swRegistration = await navigator.serviceWorker.getRegistration();
    const permission = await window.Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Permission not granted for Notification");
    }
    // console.log(swRegistration);
    if ("serviceWorker" in navigator) {
      const handleServiceWorker = async () => {
        const register = await navigator.serviceWorker.register("/sw.js");

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            "BNXmJgyP8kPwoeIBL-prfsIYfddKz_r15IT9cnO5vohJ8PaB1nagZ6UkbX-ghGw-zbnpPgu50iH1kXNKxYXj4hk",
        });

        const res = await fetch("/api/subscribe", {
          method: "POST",
          body: JSON.stringify({ subscription, userId }),
          headers: {
            "content-type": "application/json",
          },
        });

        const data = await res.json();
        console.log(data);
      };
      handleServiceWorker();
    }
  };

  return (
    <button
      onClick={setupPush}
      className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-100 transition duration-150 ease-in-out border-b-2 border-transparent "
    >
      <BiBell className="w-8 h-8 text-white" />
    </button>
  );
}
