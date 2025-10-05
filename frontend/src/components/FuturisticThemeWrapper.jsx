import React, { useEffect, useRef } from "react";

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export default function FuturisticThemeWrapper({ children }) {
  const canvasRef = useRef();
  const startTime = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    resize();
    window.addEventListener("resize", resize);

    const nodeCount = 60;
    const nodes = new Array(nodeCount).fill(null).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 2.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: i % 2 === 0 ? "#38bdf8" : "#fa5c5c",
      orbitRadius: 3 + Math.random() * 8,
      orbitAngle: Math.random() * 2 * Math.PI,
      orbitSpeed: (Math.random() - 0.5) * 0.04,
    }));

    const flickers = new Array(30).fill(null).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.8 + Math.random() * 0.7,
      flickerSpeed: (Math.random() + 0.5) * 0.03,
      flickerPhase: Math.random() * 2 * Math.PI,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Original theme background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, "#0f172a");
      bgGradient.addColorStop(1, "#000");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Faint glowing grid lines
      ctx.save();
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.05 + 0.02 * Math.sin(Date.now() / 1500);
      for (let y = 0; y < height; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 0; x < width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      // Connect nearby nodes with glowing red/blue lines
      nodes.forEach((nodeA, i) => {
        for (let j = i + 1; j < nodeCount; j++) {
          const nodeB = nodes[j];
          const dist = distance(nodeA, nodeB);
          if (dist < 110) {
            ctx.beginPath();
            let baseRGB = i % 2 === 0 ? "56,221,248" : "250,92,92";
            const alpha = 1 - dist / 110;
            ctx.strokeStyle = `rgba(${baseRGB},${alpha * 0.7})`;
            ctx.lineWidth = 1 - dist / 110;
            ctx.shadowColor = `rgba(${baseRGB},${alpha * 0.3})`;
            ctx.shadowBlur = 10;
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      });

      // Update nodes orbits around their position for subtle liveliness
      nodes.forEach((node, i) => {
        node.orbitAngle += node.orbitSpeed;
        const orbitX = node.r * 0.5 * Math.cos(node.orbitAngle);
        const orbitY = node.r * 0.5 * Math.sin(node.orbitAngle);

        ctx.beginPath();
        ctx.shadowBlur = 18;
        ctx.shadowColor = node.color;
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.75 + 0.25 * Math.sin((Date.now() / 650) + i);
        ctx.arc(node.x + orbitX, node.y + orbitY, node.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Move main node position smoothly with bouncing
        node.x += node.dx;
        node.y += node.dy;
        if (node.x < 0) node.x = width;
        else if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        else if (node.y > height) node.y = 0;
      });

      // Draw pulsing greenish flickers randomly scattered in background
      flickers.forEach((flick, i) => {
        const flickerOpacity = 0.3 + 0.7 * Math.abs(Math.sin(Date.now() / 500 + flick.flickerPhase));
        ctx.beginPath();
        ctx.shadowBlur = 14 * flickerOpacity;
        ctx.shadowColor = "rgba(20,255,138," + flickerOpacity + ")";
        ctx.fillStyle = "rgba(20,255,138," + flickerOpacity + ")";
        ctx.globalAlpha = flickerOpacity;
        ctx.arc(flick.x, flick.y, flick.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Sprites move slowly
        flick.x += Math.cos(i) * 0.15;
        flick.y += Math.sin(i) * 0.15;
        if (flick.x < 0) flick.x = width;
        else if (flick.x > width) flick.x = 0;
        if (flick.y < 0) flick.y = height;
        else if (flick.y > height) flick.y = 0;
      });

      requestAnimationFrame(draw);
    }

    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -2,
          pointerEvents: "none",
          background: "transparent",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.35)", // lighter overlay for better content visibility
          zIndex: -1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
      <style>{`
        html, body {
          margin: 0; padding: 0; height: 100%; font-family: 'Montserrat', sans-serif;
          color:#e0e7ff; scroll-behavior: smooth; overflow-x: hidden;
          background: transparent;
          scroll-snap-type: y mandatory;
        }
        ::-webkit-scrollbar {
          width: 10px; height: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        ::-webkit-scrollbar-thumb {
          background: #7c37eb; border-radius: 5px; border: 2px solid #0f172a;
        }
        .input-field {
          width: 100%; padding: .5rem .75rem; border: 2px solid #5f3ebd; border-radius: .375rem;
          background: #1a2030; color: #e0e7ff; font-size: 1rem; transition: border-color 0.3s ease;
        }
        .input-field:focus {
          outline:none; border-color:#7c38eb; box-shadow:0 0 10px rgba(124,56,235,.66); background:#2c3450;
        }
        .input-field.border-red-600 {
          border-color:#f87171 !important;
        }
        .btn-primary {
          padding: 14px 32px; background: #7c38eb; font-weight: 700; font-size: 1.125rem; border-radius: .5rem;
          color: #fff; cursor:pointer; border:none; user-select:none; transition: background-color 0.3s ease;
        }
        .btn-primary:hover {
          background: #5825c0;
        }
        .flicker-highlight {
          animation: flickerAnimation 3.5s linear infinite alternate;
          color: #fc6f6f;
          font-weight: 900;
          text-shadow: 0 0 10px #ff7a7a, 0 0 30px #ff5050, 0 0 60px #ff1f1f;
        }
        @keyframes flickerAnimation {
          0%,20%,40%,60%,80%,100% {opacity:1; filter: brightness(1.3);}
          10%,30%,50%,70%,90% {opacity:0.7; filter: brightness(0.9);}
        }
        section {
          scroll-snap-align: start;
          min-height: 100vh;
          padding: 4rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 768px) {
          section {
            padding: 4rem 6rem;
          }
        }
        .heading-unmasking {
          color: white;
          font-weight: 900;
          font-size: 4rem;
          line-height: 1;
          display: inline;
          user-select: none;
          margin-right: 5px;
          user-select:none;
        }
        .heading-deepfakes {
          color: #fc1b1b;
          font-weight: 900;
          font-size: 6rem;
          line-height: 1;
          display: inline-block;
          margin-left: -8px;
          user-select: none;
          text-shadow: 0 0 12px #ff0000, 0 0 30px #cc0000, 0 0 110px #ff2020;
          animation: emergencyTextLight 1.2s linear infinite;
        }
        @keyframes emergencyTextLight {
          0%, 100% { opacity: 1; }
          10%, 50%, 90% { opacity: 0.5; }
          30%, 70% { opacity: 1; }
        }
        .typewriter-text {
          font-family: inherit;
          font-size: 1rem;
          color: #cbd5e1;
        }
        .cursor {
          display: inline-block;
          width: 1ch;
          background-color: #fc6f6f;
          animation: blink 1s steps(1) infinite;
          margin-left: 2px;
          height: 1em;
          vertical-align: bottom;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
