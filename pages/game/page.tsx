"use client";

import { useEffect, useRef } from "react";
import { startGame } from "@/game/main";
import HUD from "@/components/HUD";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      startGame(canvasRef.current);
    }
  }, []);

  return (
    <>
      <canvas ref={canvasRef} />
      <HUD />
    </>
  );
}
