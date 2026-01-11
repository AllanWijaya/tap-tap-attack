"use client";

import { useRouter } from "next/navigation";
import { userAgent } from "next/server";

export default function Page() {
  const router = useRouter();
  return (
    <div id="ui">
      <button id="play" onClick={() => router.push("/game")}>
        PLAY
      </button>
      <button id="quit">QUIT</button>
    </div>
  );
}
