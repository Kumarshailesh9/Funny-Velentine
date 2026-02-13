"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { FaInstagramSquare } from "react-icons/fa";

interface Heart {
  left: string;
  fontSize: string;
  animationDuration: string;
}

export default function ValentinePage() {
  const [herName, setHerName] = useState("My Love");
  const [accepted, setAccepted] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const happyRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get name from query parameter (client-side)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromQuery = params.get("name")?.trim();
    if (nameFromQuery) {
      setHerName(
        nameFromQuery.charAt(0).toUpperCase() +
          nameFromQuery.slice(1).toLowerCase()
      );
    }
  }, []);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Generate hearts
  useEffect(() => {
    const generated = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 25 + 10}px`,
      animationDuration: `${Math.random() * 5 + 5}s`,
    }));
    setHearts(generated);
  }, []);

  // Set initial No button position
  useEffect(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const buttonWidth = 110;
    const buttonHeight = 45;
    setNoPosition({
      x: card.clientWidth / 2 - buttonWidth / 2,
      y: card.clientHeight - buttonHeight - 20,
    });
  }, []);

  const startMusic = () => {
    if (!bgMusicRef.current || isMuted) return;
    bgMusicRef.current.volume = 0.5;
    bgMusicRef.current.play().catch(() => {});
  };

  const toggleMute = () => {
    if (!bgMusicRef.current) return;
    if (isMuted) {
      bgMusicRef.current.play().catch(() => {});
    } else {
      bgMusicRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  const playHappy = () => {
    if (!happyRef.current) return;
    happyRef.current.currentTime = 0;
    happyRef.current.play().catch(() => {});
  };

  const moveNoButton = () => {
    startMusic();
    if (!cardRef.current) return;

    const card = cardRef.current;
    const buttonWidth = 110;
    const buttonHeight = 45;
    const maxX = card.clientWidth - buttonWidth;
    const maxY = card.clientHeight - buttonHeight;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    setNoPosition({ x: newX, y: newY });

    setYesScale((prev) => (prev < 1.8 ? prev + 0.1 : 1.8));
  };

  const handleYes = () => {
    startMusic();
    setAccepted(true);

    confetti({
      particleCount: 300,
      spread: 160,
      origin: { y: 0.6 },
    });

    playHappy();
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-pink-400 via-red-300 to-pink-500 relative overflow-hidden px-4">

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 text-2xl bg-white/80 backdrop-blur-md rounded-full px-3 py-2 shadow-xl"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      <audio ref={bgMusicRef} src="/music/romantic.mp3" loop />
      <audio ref={happyRef} src="/music/happy1.mp4" />

      {/* Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart, i) => (
          <span
            key={i}
            style={heart}
            className="absolute text-pink-700 animate-float opacity-70"
          >
            ❤️
          </span>
        ))}
      </div>

      {accepted ? (
        <div className="text-center text-white z-10 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold glow-text mb-6">
            I Promise To Always Make You Smile, {herName} 💖
          </h1>
          <p className="text-xl md:text-2xl">
            This is the beginning of our beautiful story 😍✨, My heart beats for
            you, my soul smiles with you, and my world feels complete because of
            you. 💖
          </p>
        </div>
      ) : (
        <div
          ref={cardRef}
          className="relative bg-white/30 backdrop-blur-xl shadow-2xl rounded-3xl p-10 text-center z-10 max-w-2xl w-full border border-white/40 overflow-hidden"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-6 text-center z-10">
            {herName}, from the moment I met you... ❤️
          </h1>

          <p className="text-lg md:text-xl text-pink-700 text-center max-w-xl mb-8 z-10">
            You have been the most beautiful part of my days.
            Your smile makes everything better,
            your voice feels like my favorite song,
            and your presence feels like home.
            <br />
            I don’t just like you… I truly, deeply admire you.
            <br />
            So today, I want to ask you something special...
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-10 text-center z-10">
            {herName}, will you be mine forever? 💍💖
          </h2>

          {/* YES BUTTON */}
          <button
            onClick={handleYes}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xl transition-all duration-300 shadow-xl"
          >
            Yes 😍
          </button>

          {/* NO BUTTON */}
          <button
            onMouseEnter={!isMobile ? moveNoButton : undefined}
            onClick={moveNoButton}
            onTouchStart={moveNoButton}
            style={{
              position: "absolute",
              left: noPosition.x,
              top: noPosition.y,
            }}
            className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg text-lg shadow-lg transition-all duration-200"
          >
            No 😢
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="absolute bottom-2 w-full text-center text-white/80 text-sm z-20">
        Developed by Saurabh{" "}
        <a
          href="https://instagram.com/shailesh9.js"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-pink-300 hover:text-pink-500"
        >
          || Saurabh <FaInstagramSquare />
        </a>
      </footer>

      <style jsx>{`
        .animate-float {
          animation: float linear infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }

        .glow-text {
          text-shadow: 0 0 15px rgba(255, 0, 100, 0.8),
            0 0 30px rgba(255, 0, 150, 0.6);
        }

        @keyframes float {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-10vh);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
