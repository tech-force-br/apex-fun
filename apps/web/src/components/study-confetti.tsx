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
