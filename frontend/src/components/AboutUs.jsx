import React, { useState, useEffect, useRef } from "react";
import FuturisticThemeWrapper from "./FuturisticThemeWrapper";

const teamMembers = [
  {
    name: "Srishti Kumari",
    role: "Team Leader",
    bio: "Skilled in project management and AI/ML, driving innovative solutions and seamless team collaboration.",
    photo: require("../assets/team/srishti.jpg"),
    bg: "linear-gradient(135deg,#4834d4 43%,#22a6b3 100%)",
    icon: "🧠",
    contactLink: "https://www.linkedin.com/in/srishti-kumari-30b8b9387/"
  },
  {
    name: "Aditya Chaurasiya",
    role: "Full Stack Developer",
    bio: "Proficient in end-to-end web development and scalable software solutions.",
    photo: require("../assets/team/aditya.jpg"),
    bg: "linear-gradient(135deg,#00b894 43%,#0984e3 100%)",
    icon: "💻",
    contactLink: "https://www.linkedin.com/in/aditya-chaurasiya-679b51374/"
  },
  {
    name: "Anubhav Kumar Yadav",
    role: "Full Stack Developer",
    bio: "Expert in integrating interfaces and backend services across platforms.",
    photo: require("../assets/team/anubhav.jpg"),
    bg: "linear-gradient(135deg,#fdcb6e 43%,#e17055 100%)",
    icon: "🧩",
    contactLink: "https://www.linkedin.com/in/anubhav-kumar-yadav-5815ba291/"
  },
  {
    name: "Priyanshu Singh",
    role: "UI/UX Designer",
    bio: "Creative in designing engaging, user-centered digital experiences.",
    photo: require("../assets/team/priyanshu.jpg"),
    bg: "linear-gradient(135deg,#fab1a0 30%,#e84393 90%)",
    icon: "🎨",
    contactLink: "https://www.instagram.com/iam_priyanshu.07/"
  },
  {
    name: "Rajak Ashish Rakesh",
    role: "DevOps Expert",
    bio: "Automation and cloud infrastructure specialist ensuring robust deployment pipelines.",
    photo: require("../assets/team/ashish.jpg"),
    bg: "linear-gradient(135deg,#636e72 24%,#00b894 99%)",
    icon: "⚙️",
    contactLink: "https://www.instagram.com/ashish_rajak_0903/"
  },
  {
    name: "Ayush Tripathi",
    role: "Cyber Security Specialist",
    bio: "Focused on securing applications and networks against evolving threats.",
    photo: require("../assets/team/ayush.jpg"),
    bg: "linear-gradient(135deg,#222f3e 34%,#12cbc4 82%)",
    icon: "🔒",
    contactLink: "https://linkedin.com/in/ayushtripathi1729"
  }
];

// Stylish animated heading with a futuristic theme animation
function FuturisticHeading() {
  const text = "THE DEEP BUSTERS";
  const [displayText, setDisplayText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayText("");
    indexRef.current = 0;

    function type() {
      if (indexRef.current < text.length) {
        setDisplayText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        setTimeout(type, 40);
      }
    }
    type();
  }, []);

  return (
    <div className="inline-block text-center mb-8">
      <h1 className="uppercase font-extrabold tracking-widest text-transparent leading-none gradient-text-shadow font-future" style={{
        fontSize: "5.8rem",
        maxWidth: "fit-content",
        letterSpacing: "0.24em",
        lineHeight: "1.1",
        margin: 0,
        userSelect: "none",
      }}>
        <span style={{
          position: "relative",
          display: "inline-block",
          background: "linear-gradient(45deg, #00ffe7, #8a3bff, #ff00f5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {displayText}
        </span>
      </h1>
      {/* Tagline with flicker */}
      <span className="tagline-flicker text-indigo-400 select-none w-full block font-semibold text-sm sm:text-base tracking-wide">
        We fight deepfakes, misinformation & scams with AI power
      </span>
      <style>{`
        @font-face {
          font-family: 'FutureTech';
          src: local('Orbitron'), url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap');
        }
        .font-future {
          font-family: 'FutureTech', 'Orbitron', monospace, 'Segoe UI', sans-serif;
        }
        .gradient-text-shadow {
          text-shadow:
            0 0 1px #00BFFF   ,
            0 0 14px #32CD32  ;
        }
        .tagline-flicker {
          animation: flickerTagline 3s ease-in-out infinite alternate;
          margin-top: 0.3rem;
          text-shadow:
            0 0 12px #ae7aff,
            0 0 30px #7ef3ff,
            0 0 24px #e486ff;
        }
        @keyframes flickerTagline {
          0%, 20%, 40%, 60%, 80%, 100% {opacity: 1;}
          10%, 30%, 50%, 70%, 90% {opacity: 0.4;}
        }
      `}</style>
    </div>
  );
}

function MissionTypeEffect({ text, speed = 22, onDone }) {
  const [displayText, setDisplayText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayText("");
    indexRef.current = 0;

    function type() {
      if (indexRef.current <= text.length) {
        setDisplayText(text.slice(0, indexRef.current));
        indexRef.current += 1;
        setTimeout(type, speed);
      } else if (onDone) onDone();
    }
    type();
  }, [text, speed, onDone]);

  return (
    <p className="text-center max-w-3xl mx-auto px-4 md:px-0 text-base sm:text-lg md:text-xl font-light text-indigo-300 leading-relaxed fadein-mission-text">
    {displayText}
      <span className="fadein-mission-caret">|</span>
      <style>{`
        .fadein-mission-caret {
          display:inline-block;
          animation: blinkMission 1s step-end infinite;
          color: #99d8ff;
          margin-left: 3px;
        }
        @keyframes blinkMission {
          0%, 70% {opacity: 1;}
          71%, 100% {opacity: 0;}
        }
        .fadein-mission-text {
          opacity: 0;
          animation: fadeInMissionText 1.2s forwards 0.1s;
        }
        @keyframes fadeInMissionText {
          to {opacity: 1;}
        }
      `}</style>
    </p>
  );
}

function TeamMemberCard({ member }) {
  return (
    <div className="flip-card group" style={{ background: member.bg, boxShadow: "0 3.5px 24px #60c3ff20" }}>
      <div className="flip-card-inner">
        <div className="flip-card-front" style={{ background: "rgba(20,22,30,0.92)" }}>
          <div className="text-4xl mb-1 pt-1">{member.icon}</div>
          <img
            src={member.photo}
            alt={`${member.name} photo`}
            className="rounded-full w-24 h-24 object-cover shadow-md mb-3 pointer-events-none border-2 border-white/80"
          />
          <h3 className="text-lg font-semibold text-indigo-100 truncate max-w-full">{member.name}</h3>
          <p className="mt-1 text-xs font-mono text-gray-300">{member.role}</p>
        </div>
        <div className="flip-card-back p-5 pb-6" style={{ background: "rgba(24,18,39,0.96)" }}>
          <h3 className="text-lg font-bold text-indigo-100 mb-2 truncate max-w-full">{member.name}</h3>
          <p className="text-pink-300 font-semibold mb-3">{member.role}</p>
          <p className="text-indigo-200 text-sm leading-relaxed">{member.bio}</p>
          <a
            href={member.contactLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 bg-white/5 px-3 py-1 rounded-lg hover:bg-fuchsia-900/60 hover:text-indigo-100 transition underline break-all"
            onClick={e => e.stopPropagation()}
          >
            Contact
          </a>
        </div>
      </div>
      <style>{`
        .flip-card { width: 100%; min-height: 300px; border-radius: 23px; perspective: 1100px; margin: 0 auto; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.7s cubic-bezier(0.23,0.8,0.42,1.01); transform-style: preserve-3d; border-radius: 23px; }
        .group:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back {
          position: absolute; width: 100%; height: 100%;
          border-radius: 21px; display: flex;
          flex-direction: column; align-items: center; justify-content: center;
          backface-visibility: hidden;
        }
        .flip-card-back { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

function TypingEffect({ text, speed = 70, onComplete }) {
  const [displayText, setDisplayText] = useState("");
  const indexRef = useRef(0);
  const timeoutRef = useRef();

  useEffect(() => {
    setDisplayText("");
    indexRef.current = 0;
    function type() {
      if (indexRef.current < text.length) {
        const prefix = "root@thedeepbusters:~$ ";
        setDisplayText(prefix + text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        timeoutRef.current = setTimeout(type, speed);
      } else {
        if (onComplete) onComplete();
      }
    }
    type();
    return () => clearTimeout(timeoutRef.current);
  }, [text, speed, onComplete]);

  return (
    <pre
      className="terminal-text-header font-mono text-lg md:text-3xl text-lime-400 whitespace-pre-wrap select-none transition-all duration-700"
      style={{ userSelect: "none" }}
      aria-live="polite"
      aria-atomic="true"
    >
      {displayText}
      <span className="blinking-caret">_</span>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blinking-caret {
          animation: blink 1s step-start 0s infinite;
          color: #84ff87;
          margin-left: 2px;
        }
      `}</style>
    </pre>
  );
}

function ContentTypingEffect({ text, speed = 18, onComplete }) {
  const [displayText, setDisplayText] = useState("");
  const lines = useRef(text.split("\n"));
  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef();

  useEffect(() => {
    setDisplayText("");
    lineIndexRef.current = 0;
    charIndexRef.current = 0;
    function type() {
      if (lineIndexRef.current < lines.current.length) {
        const line = lines.current[lineIndexRef.current];
        if (charIndexRef.current < line.length) {
          setDisplayText((prev) => prev + line.charAt(charIndexRef.current));
          charIndexRef.current++;
          timeoutRef.current = setTimeout(type, speed);
        } else {
          setDisplayText((prev) => prev + "\n");
          lineIndexRef.current++;
          charIndexRef.current = 0;
          timeoutRef.current = setTimeout(type, speed * 11);
        }
      } else {
        if (onComplete) onComplete();
      }
    }
    type();
    return () => clearTimeout(timeoutRef.current);
  }, [text, speed, onComplete]);

  return (
    <pre
      className="terminal-text-content font-mono text-base text-lime-300 whitespace-pre-wrap leading-relaxed max-w-3xl mx-auto select-text transition-all duration-700"
      aria-live="polite"
      aria-atomic="true"
    >
      {displayText}
      <span className="blinking-caret">_</span>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blinking-caret {
          animation: blink 1s step-start 0s infinite;
          color: #7fff7f;
          margin-left: 2px;
        }
      `}</style>
    </pre>
  );
}

function TerminalSlideshow({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phase, setPhase] = useState("typingTitle");
  const timerRef = useRef();

  useEffect(() => {
    if (phase === "staticSlide") {
      timerRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setPhase("typingTitle");
      }, 9500);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setPhase("typingTitle");
  };
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setPhase("typingTitle");
  };
  const handleTitleComplete = () => setTimeout(() => setPhase("typingContent"), 620);
  const handleContentComplete = () => setTimeout(() => setPhase("staticSlide"), 480);

  return (
    <section
      aria-label="Terminal styled slideshow"
      className="mx-auto rounded-lg p-6 max-w-4xl min-h-[400px] relative bg-black bg-opacity-85 text-lime-400 font-mono shadow-inner shadow-lime-600"
      style={{ overflowWrap: "anywhere", border: "2.5px solid #22c55e", boxShadow: "0 0 12px #22c55ebb" }}
    >
      <div className="flex items-center space-x-2 px-3 h-7 bg-gray-900 rounded-t-md select-none mb-2">
        <span className="w-3 h-3 rounded-full bg-red-600 shadow-lg animate-pulse" style={{ animationDelay: "0ms" }} />
        <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg animate-pulse" style={{ animationDelay: "200ms" }} />
        <span className="w-3 h-3 rounded-full bg-green-600 shadow-lg animate-pulse" style={{ animationDelay: "400ms" }} />
        <span className="text-lime-400 text-xs pl-2 font-mono select-none">bash ~ root@system</span>
      </div>
      <div className="px-3 pt-1 min-h-[320px] text-left transition-all duration-400 ease-in-out">
        {phase === "typingTitle" && (
          <TypingEffect
            key={`title-${currentSlide}-${phase}`}
            text={slides[currentSlide].title}
            speed={54}
            onComplete={handleTitleComplete}
          />
        )}
        {phase !== "typingTitle" && (
          <pre className="text-lime-400 text-xl font-semibold whitespace-pre-wrap select-none mb-2 transition-all duration-400">
            {slides[currentSlide].title}
          </pre>
        )}
        {phase === "typingContent" && (
          <ContentTypingEffect
            key={`content-${currentSlide}`}
            text={slides[currentSlide].contentText}
            speed={15}
            onComplete={handleContentComplete}
          />
        )}
        {phase === "staticSlide" && (
          <pre className="text-lime-300 whitespace-pre-wrap leading-relaxed mt-0 mb-12 transition-all duration-400">
            {slides[currentSlide].contentText}
          </pre>
        )}
      </div>
      <div className="absolute bottom-4 left-3 right-3 flex justify-center space-x-6">
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="bg-green-800 hover:bg-green-900 rounded px-4 py-2 text-white font-mono shadow-md transition-all duration-300"
          type="button"
        >
          &lt; Prev
        </button>
        <button
          onClick={handleNext}
          aria-label="Next"
          className="bg-green-800 hover:bg-green-900 rounded px-4 py-2 text-white font-mono shadow-md transition-all duration-300"
          type="button"
        >
          Next &gt;
        </button>
      </div>
    </section>
  );
}

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <FuturisticThemeWrapper>
      <div className="min-h-screen bg-transparent max-w-7xl mx-auto relative z-10 text-center px-3 md:px-6 overflow-x-hidden">
        <FuturisticHeading />
        <h2 className="text-4xl font-semibold mb-4 text-indigo-200 select-none tracking-wide">OUR MISSION</h2>
        <MissionTypeEffect text="Restoring trust in digital content by fighting misinformation, scams, and deepfakes using cutting-edge AI-powered detection and active defense." />
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-6 text-indigo-200 text-center animate-fadein-team-title">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-3">
            {teamMembers.map((member, idx) => (
              <TeamMemberCard key={idx} member={member} />
            ))}
          </div>
          <style>{`
            @keyframes fadein-team-title {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: none;
              }
            }
            .animate-fadein-team-title {
              animation: fadein-team-title 1.2s ease forwards;
            }
          `}</style>
        </section>
        <TerminalSlideshow
          slides={[
            {
              title: "MaayaBreaker: AI-Powered Deepfake & Misinformation Detection System",
              contentText:
                "- Multi-platform (Website, App, Browser Extension) for detection & protection\n" +
                "- Multi-modal analysis: Image, Video, Audio, Text, Links & Files\n" +
                "- Detects AI deepfakes, manual edits, phishing links, malicious files & fake messages\n" +
                "- Provides heatmaps, real-time alerts, and explainable results to build trust\n" +
                "- Active defense: blocks fake calls, OTP floods & phishing attempts instantly\n" +
                "- Hybrid AI + forensic approach with feedback learning → accuracy improves over time",
            },
            {
              title: "How It Addresses the Problem",
              contentText:
                "- Fights scams, misinformation, fake media\n" +
                "- Gives instant authenticity check\n" +
                "- Scam call alerts & fake voice detection\n" +
                "- Builds user awareness & trust",
            },
            {
              title: "Innovation & Uniqueness",
              contentText:
                "- Multi-Modal Detection (all media types)\n" +
                "- Real-Time Defense Across devices\n" +
                "- Scalable self-learning AI + Explainable AI Outputs\n" +
                "- Full Digital Immune Ecosystem (Web/App/Plugin)\n" +
                "- Self Learning, Adaptive system",
            },
            {
              title: "Potential Impact",
              contentText:
                "- Restores global trust in digital content\n" +
                "- Shields users from scams, frauds & fake news\n" +
                "- Establishes universal standard for authenticity\n" +
                "- Supports law enforcement, journalism & governance\n" +
                "- Lays foundation for global AI accountability",
            },
            {
              title: "Benefits",
              contentText:
                "- Social: Heatmaps + explainable AI help verify truth\n" +
                "- Economic: Fake call/link/file blocking reduces fraud\n" +
                "- Security: Real-time detection prevents crimes & cyberattacks\n" +
                "- Educational: Spread awareness & teach online safety\n" +
                "- Environmental: Unified platform saves resources\n" +
                "- Visionary: Multi-modal detection for all media",
            },
          ]}
        />
      </div>
    </FuturisticThemeWrapper>
  );
}
