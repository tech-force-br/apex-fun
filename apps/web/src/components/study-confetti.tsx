"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type ConfettiOrigin = { x: number; y: number };

const COLORS = ["#0176d3", "#032d60", "#1b96ff", "#014486", "#fe9339", "#ffffff"];

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  rot: number;
  spin: number;
};

export function ConfettiBurst({ origin }: { origin: ConfettiOrigin }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const pieces: Piece[] = Array.from({ length: 110 }, (_, index) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
      const speed = 9 + Math.random() * 9;
      return {
        x: origin.x + (Math.random() - 0.5) * 28,
        y: origin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 6 + Math.random() * 5,
        h: 8 + Math.random() * 6,
        color: COLORS[index % COLORS.length] ?? COLORS[0],
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.28,
      };
    });

    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const piece of pieces) {
        piece.vy += 0.2;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vx *= 0.99;
        piece.rot += piece.spin;
        const life = Math.max(0, 1 - frame / 90);
        if (life <= 0) continue;
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rot);
        ctx.globalAlpha = life;
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
        ctx.restore();
      }
      if (frame < 90) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [origin]);

  return createPortal(
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50"
    />,
    document.body,
  );
}

type Drop = {
  x: number;
  y: number;
  vy: number;
  sway: number;
  phase: number;
  swaySpeed: number;
  w: number;
  h: number;
  color: string;
  rot: number;
  spin: number;
  kind: "rect" | "ribbon" | "circle";
};

export function ConfettiRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const width = canvas.width;
    const height = canvas.height;
    const pieces: Drop[] = Array.from({ length: 120 }, (_, index) => {
      const kind =
        index % 5 === 0 ? "circle" : index % 3 === 0 ? "ribbon" : "rect";
      return {
        x: Math.random() * width,
        y: -16 - Math.random() * height * 0.65,
        vy: 3.4 + Math.random() * 3.2,
        sway: 12 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 0.018 + Math.random() * 0.035,
        w: kind === "ribbon" ? 3 + Math.random() * 2 : 8 + Math.random() * 7,
        h: kind === "ribbon" ? 16 + Math.random() * 18 : 9 + Math.random() * 8,
        color: COLORS[index % COLORS.length] ?? COLORS[0],
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.1,
        kind,
      };
    });

    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillFalling = false;
      for (const piece of pieces) {
        piece.phase += piece.swaySpeed;
        piece.y += piece.vy;
        piece.vy += 0.012;
        piece.rot += piece.spin;
        if (piece.y < canvas.height + 40) stillFalling = true;
        if (piece.y < -40 || piece.y > canvas.height + 30) continue;
        const x = piece.x + Math.sin(piece.phase) * piece.sway;
        ctx.save();
        ctx.translate(x, piece.y);
        ctx.rotate(piece.rot);
        ctx.fillStyle = piece.color;
        if (piece.kind === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, piece.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
        }
        ctx.restore();
      }
      if (stillFalling && frame < 720) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return createPortal(
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
    />,
    document.body,
  );
}
