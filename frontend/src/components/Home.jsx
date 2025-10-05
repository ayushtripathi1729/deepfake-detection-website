import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import FuturisticThemeWrapper from './FuturisticThemeWrapper';
import parta from "../assets/logos/parta1.jpg";
import partb from "../assets/logos/partb.jpg";
import partc from "../assets/logos/partc1.jpg";

// DATA ARRAYS
const NEWS = [
  { id: 1, title: "AI Scam Rise in 2025", date: "Oct 2025", link: "/news1" },
  { id: 2, title: "₹26 Lakh Lost Scam", date: "Sept 2025", link: "/news2" },
  { id: 3, title: "TikTok Influencer Attacked", date: "Aug 2025", link: "/news3" },
  { id: 4, title: "NSW Enacts Deepfake Law", date: "Jul 2025", link: "/news4" },
  { id: 5, title: "US Elections Threatened", date: "Jun 2025", link: "/news5" },
  { id: 6, title: "AI Combatting Media", date: "May 2025", link: "/news6" },
];
const SECTIONS = [
  {
    id: "home",
    title: "What are Deepfakes?",
    subtitle: "- The Rise of Synthetic Media",
    image: parta,
    paragraphs: [
      "Deepfakes are hyper-realistic but artificially generated videos, images, or audio created using advanced artificial intelligence techniques, particularly deep learning. By swapping faces, mimicking voices, or altering movements, deepfakes can make people appear to say or do things they never actually did. While this technology can be used for creative purposes such as filmmaking, education, or entertainment, it also poses serious risks when misused—spreading misinformation, harming reputations, or manipulating public opinion. Understanding how deepfakes work is the first step toward recognizing and combating them.",
    ],
  },
  {
    id: "about",
    title: "Why Are Deepfakes Dangerous?",
    subtitle: "- The Threat Behind the Illusion",
    image: partb,
    paragraphs: [
      "While deepfakes can be entertaining, their darker side is far more concerning. Misused deepfake technology can spread false news, fuel scams, damage reputations, and even influence elections. The ability to create convincing but fake content raises questions about truth, trust, and security in the digital world. Knowing the risks helps highlight the importance of deepfake detection.",
    ],
  },
  {
    id: "discover",
    title: "How Deepfake Detection Works",
    subtitle: "- Uncovering the Truth with AI",
    image: partc,
    paragraphs: [
      "Detecting deepfakes relies on advanced artificial intelligence that can spot subtle clues invisible to the human eye. While deepfake creators use deep learning to generate realistic faces, voices, and movements, detection systems analyze inconsistencies—such as unnatural blinking, mismatched lighting, irregular lip-syncing, or digital noise in the pixels. Modern algorithms also study biometric patterns like facial micro-expressions and voice tone variations to separate real from fake. By combining these techniques, deepfake detection tools can reveal the truth hidden beneath the illusion.",
    ],
  },
];
const CHECK_OPTIONS = [
  { label: "Images", link: "/Images" },
  { label: "Videos", link: "/Videos" },
  { label: "Files", link: "/Files" },
  { label: "Text", link: "/Text" },
  { label: "Audio", link: "/Audio" },
];
const DOWNLOAD_OPTIONS = [
  { label: "Mobile App", link: "/MobileApp" },
  { label: "Web Extension", link: "/WebExtension" },
];
const TESTIMONIALS = [
  {
    id: 1,
    author: "Dr. Evelyn Harper",
    role: "AI Ethicist",
    content: "This platform is an essential resource to fight misinformation.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 2,
    author: "Jared Collins",
    role: "Cybersecurity Analyst",
    content: "Clear insights and practical tools for cybersecurity.",
    avatar: "https://randomuser.me/api/portraits/men/72.jpg",
  },
  {
    id: 3,
    author: "Priya Kapoor",
    role: "Digital Rights Advocate",
    content: "A beacon of hope in today's digital media.",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
  },
];
const FAQ_DATA = [
  {
    q: "What is a deepfake?",
    a: "A synthetic media created by AI algorithms that can alter images and videos realistically.",
  },
  {
    q: "Why are deepfakes dangerous?",
    a: "They can be used to mislead, commit fraud, and damage reputations.",
  },
  {
    q: "Are deepfakes regulated?",
    a: "Regulations are being developed globally to combat malicious use.",
  },
  {
    q: "How can I protect yourself?",
    a: "Be skeptical, verify sources, and use detection tools.",
  },
];

// Flicker effect
const FlickerHighlight = ({ children }) => (
  <>
    <span className="flicker-highlight">{children}</span>
    <style>{`
      @keyframes flickerAnimation {
        0%,20%,40%,60%,80%,100% {opacity:1; filter: brightness(1.3);}
        10%,30%,50%,70%,90% {opacity:0.7; filter: brightness(0.9);}
      }
      .flicker-highlight {
        animation: flickerAnimation 3.5s linear infinite alternate;
        color: #fc6f6f;
        font-weight: 900;
        text-shadow: 0 0 10px #ff7a7a, 0 0 30px #ff5050, 0 0 60px #ff1f1f;
      }
    `}</style>
  </>
);

// Glitch heading effect with permanent glitch option and smaller size option
const GlitchHeading = ({ children, className = "", small = false, permanent = false }) => {
  const [glitchActive, setGlitchActive] = useState(true);
  useEffect(() => {
    if (!permanent) {
      const id = setTimeout(() => setGlitchActive(false), 3000);
      return () => clearTimeout(id);
    } else {
      setGlitchActive(true);
    }
  }, [permanent]);
  return (
    <>
      <h1
        className={clsx(
          "glitch-heading font-extrabold leading-tight select-none",
          glitchActive ? "glitch-active" : "",
          className,
          small ? "glitch-small" : ""
        )}
        aria-label={children}
      >
        {children}
      </h1>
      <style>{`
        .glitch-heading {
          font-size: 4rem;
          color: #fc6f6f;
          position: relative;
          user-select: none;
        }
        .glitch-small {
          font-size: 1.75rem;
        }
        .glitch-heading.glitch-active {
          animation: glitch 1s infinite;
        }
        @keyframes glitch {
          0% {
            text-shadow: 2px 0 red, -2px 0 cyan;
          }
          20% {
            text-shadow: -2px 0 red, 2px 0 cyan;
          }
          40% {
            text-shadow: 2px 0 red, -2px 0 cyan;
          }
          60% {
            text-shadow: -2px 0 red, 2px 0 cyan;
          }
          80% {
            text-shadow: 2px 0 red, -2px 0 cyan;
          }
          100% {
            text-shadow: none;
          }
        }
      `}</style>
    </>
  );
};

// Typewriter effect for entire paragraph with single cursor at the end
// cursorVisible will control if the blinking cursor shows (true only at last paragraph in last section)
// startTyping: boolean to trigger typing start (defaults to true for immediate on mount)
// speed: typing speed in ms per char
// typedOnce: to keep text after typed and not reset on rerender

const TypewriterParagraph = ({
  paragraphs,
  cursorVisible = true,
  startTyping = true,
  speed = 15,
}) => {
  const fullText = paragraphs.join(" ") + " "; // ensure spacing
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTyping) {
      setDisplayed("");
      setDone(false);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [fullText, startTyping, speed]);

  return (
    <p
      className="typewriter-text text-indigo-200 max-w-3xl leading-relaxed"
      aria-live="polite"
      style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "1rem" }}
    >
      {displayed}
      {cursorVisible && !done && (
        <span
          className="cursor"
          style={{
            display: "inline-block",
            width: "2px",
            backgroundColor: "#fc6f6f",
            animation: "blink 1s steps(1) infinite",
            marginLeft: "2px",
            height: "1em",
            verticalAlign: "bottom",
            borderRadius: "1px",
          }}
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </p>
  );
};
// Input components
function InputField({ label, name, type = "text", value, onChange, placeholder, error, className }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block mb-1 text-indigo-300">
        {label} {placeholder && <span className="ml-1 text-gray-500">({placeholder})</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? "border-red-600" : ""}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        autoComplete="off"
      />
      {error && <p id={`${name}-error`} className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
}
function SelectField({ label, name, value, onChange, options, error, className }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block mb-1 text-indigo-300">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? "border-red-600" : ""}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        required
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt || "Select an option"}</option>
        ))}
      </select>
      {error && <p id={`${name}-error`} className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
}
function TextareaField({ label, name, value, onChange, maxLength, error, className }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block mb-1 text-indigo-300">{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows="6"
        className={`input-field resize-none ${error ? "border-red-600" : ""}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      <div className="text-right text-indigo-400 text-xs">{value.length}/{maxLength}</div>
      {error && <p id={`${name}-error`} className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
}

// Flexible Header with hamburger on scroll and expand on click, close on mouseleave of dropdown menu
function Header({ setSection }) {
  const [activeDrop, setActiveDrop] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    { label: "HOME", section: 0 },
    { label: "ABOUT US", section: 1 },
    { label: "DISCOVER", section: 2 },
  ];
  const checkItems = CHECK_OPTIONS.map(({ label, link }) => ({ label, href: link.toLowerCase() }));
  const downloadItems = DOWNLOAD_OPTIONS.map(({ label, link }) => ({ label, href: link.toLowerCase().replace(" ", "-") }));

  const handleNavigate = (sectionIdx) => {
    setSection(sectionIdx);
    setActiveDrop(null);
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.pageYOffset > 70);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown and menu if user hovers away from entire header
  const onHeaderMouseLeave = () => {
    setActiveDrop(null);
    setMenuOpen(false);
  };

  return (
    <header
      onMouseLeave={onHeaderMouseLeave}
      className={clsx(
        "fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-md z-50 transition-all duration-300",
        scrolled ? "h-12" : "h-16"
      )}
    >
      <nav className="max-w-7xl flex items-center justify-between mx-auto h-full px-4 text-indigo-400 select-none text-sm md:text-base">
        {!scrolled ? (
          <>
            <div className="text-xl font-black cursor-default select-none whitespace-nowrap mr-8">
              <GlitchHeading className="text-base m-0" small permanent>
                The Deep Busters
              </GlitchHeading>
            </div>
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 whitespace-nowrap">
              {menuItems.map(({ label, section }) => (
                <button key={label} onClick={() => handleNavigate(section)} className="hover:text-indigo-300 py-2 px-2">
                  {label}
                </button>
              ))}
              {/* CHECK Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDrop("check")}
                onMouseLeave={() => setActiveDrop(null)}
              >
                <button className="hover:text-indigo-300 inline-flex items-center space-x-1 py-2 px-2">
                  <span>CHECK</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${activeDrop === "check" ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {activeDrop === "check" && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bg-white text-black rounded-md mt-2 w-36 shadow-lg z-50"
                    >
                      {checkItems.map(({ label, href }) => (
                        <li key={label}>
                          <a href={href} className="block px-4 py-2 hover:bg-indigo-600 hover:text-white">
                            {label}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              {/* DOWNLOADS Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDrop("download")}
                onMouseLeave={() => setActiveDrop(null)}
              >
                <button className="hover:text-indigo-300 inline-flex items-center space-x-1 py-2 px-2">
                  <span>DOWNLOADS</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${activeDrop === "download" ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {activeDrop === "download" && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bg-white text-black rounded-md mt-2 w-44 shadow-lg z-50"
                    >
                      {downloadItems.map(({ label, href }) => (
                        <li key={label}>
                          <a href={href} className="block px-4 py-2 hover:bg-indigo-600 hover:text-white">
                            {label}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <button className="hover:text-indigo-300 py-2 px-2" onClick={() => handleNavigate(3)}>
                CONTACT US
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 hover:text-indigo-300"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  id="mobile-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full w-full bg-black bg-opacity-95 text-indigo-400 shadow-lg z-50"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <nav className="flex flex-col items-start p-4 space-y-4">
                    {menuItems.map(({ label, section }) => (
                      <button
                        key={label}
                        onClick={() => handleNavigate(section)}
                        className="w-full text-left hover:text-indigo-300"
                      >
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-indigo-600 w-full" />
                    {/* CHECK Dropdown */}
                    <div className="w-full">
                      <p className="font-semibold mb-2">CHECK</p>
                      <ul className="pl-4 space-y-1">
                        {checkItems.map(({ label, href }) => (
                          <li key={label}>
                            <a
                              href={href}
                              className="block px-4 py-2 hover:bg-indigo-600 hover:text-white rounded"
                              onClick={() => setMenuOpen(false)}
                            >
                              {label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-indigo-600 w-full" />
                    {/* DOWNLOADS Dropdown */}
                    <div className="w-full">
                      <p className="font-semibold mb-2">DOWNLOADS</p>
                      <ul className="pl-4 space-y-1">
                        {downloadItems.map(({ label, href }) => (
                          <li key={label}>
                            <a
                              href={href}
                              className="block px-4 py-2 hover:bg-indigo-600 hover:text-white rounded"
                              onClick={() => setMenuOpen(false)}
                            >
                              {label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-indigo-600 w-full" />
                    <button
                      className="w-full text-left hover:text-indigo-300 mt-2"
                      onClick={() => {
                        handleNavigate(3);
                        setMenuOpen(false);
                      }}
                    >
                      CONTACT US
                    </button>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </nav>
    </header>
  );
}

// AnimatedCounter Component
function AnimatedCounter({ label, end, suffix }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let val = 0;
    const step = () => {
      val += Math.ceil(end / 50);
      if (val > end) val = end;
      setCount(val);
      if (val < end) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end]);
  return (
    <div className="bg-indigo-800 bg-opacity-70 rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
      <span className="text-5xl font-extrabold text-indigo-300">{count}{suffix}</span>
      <p className="mt-2 text-indigo-100 font-semibold">{label}</p>
    </div>
  );
}

// Testimonials Component (now smaller and in left column)
function Testimonials() {
  const items = TESTIMONIALS;
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearTimeout(timeout);
  }, [index, items.length]);
  return (
    <div className="relative max-w-xl mx-auto rounded-lg shadow-lg bg-indigo-900 p-8 text-indigo-200 min-h-[180px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {items.map((item, i) =>
          i === index ? (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex flex-col justify-center px-6 text-center"
            >
              <p className="italic text-lg mb-6 leading-relaxed">“{item.content}”</p>
              <footer className="flex items-center gap-4 justify-center">
                <img
                  src={item.avatar}
                  alt={`${item.author} avatar`}
                  className="w-10 h-10 rounded-full object-cover shadow-md"
                />
                <div>
                  <p className="font-bold">{item.author}</p>
                  <p className="text-indigo-300 text-sm">{item.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
}

// FAQ Accordion
function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);
  return (
    <div className="max-w-xl mx-auto space-y-2 w-full">
      {FAQ_DATA.map(({ q, a }, i) => (
        <div key={i} className="border border-indigo-600 rounded-md">
          <button
            className="w-full flex justify-between items-center px-4 py-3 text-indigo-300 font-semibold focus:outline-none"
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-panel-${i}`}
          >
            <span>{q}</span>
            <svg
              className={clsx("w-5 h-5 transition-transform", openIndex === i && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                id={`faq-panel-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-2 text-indigo-400"
              >
                {a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// NewsScroller Component aligned right with margin correctly from header and minimal side margin
function NewsScroller() {
  const containerRef = useRef();
  const [isPaused, setIsPaused] = useState(false);
  const doubledNews = [...NEWS, ...NEWS];
  const scrollSpeed = 0.6;
  useEffect(() => {
    let scrollAmount = 0;
    let animationFrameId;
    function step() {
      if (containerRef.current && !isPaused) {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= containerRef.current.scrollHeight / 2) {
          scrollAmount = 0;
        }
        containerRef.current.scrollTop = scrollAmount;
      }
      animationFrameId = requestAnimationFrame(step);
    }
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);
  return (
    <div
      className="bg-black bg-opacity-75 rounded-lg shadow-lg text-gray-200 self-center"
      style={{ minWidth: "20rem", maxWidth: "20rem", height: "18rem", marginTop: "10px", marginLeft: "auto", marginRight: "1.25rem" }}
      aria-label="Latest News ticker, scrolls automatically"
    >
      <h2 className="text-lg font-bold text-indigo-300 px-5 pt-4 pb-1 mb-1 select-none">Recent News</h2>
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        tabIndex={0}
        className="rounded-lg px-4 pb-4 overflow-hidden w-full"
        style={{ minHeight: "14.5rem", height: "14.5rem" }}
      >
        <ul className="space-y-3 pr-2">
          {doubledNews.map(({ id, title, date, link }, idx) => (
            <li key={`${id}-${idx}`} className="select-text" style={{ lineHeight: 1.3 }}>
              <a href={link} target="_blank" rel="noopener noreferrer" className="block text-gray-200 hover:text-indigo-400 truncate" title={title}>
                <time className="block text-indigo-600 text-xs mb-1 select-none">{date}</time>
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Main Component with updated typing triggers, full flickering of Deepfakes text, and news box extreme right with small right margin and below header
export default function Home() {
  const [section, setSection] = useState(0);
  const [scrollLock, setScrollLock] = useState(false);
  const formRef = useRef();

  const [form, setForm] = useState({ name: "", email: "", phone: "", queryType: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Track which sections typed once to trigger delayed typing only on first scroll on section
  const typedSections = useRef(new Set());

  // Scroll Handling with wheel navigation of sections (same as before)
  useEffect(() => {
    let debounceTimer = null;
    const onWheel = (e) => {
      if (debounceTimer || scrollLock) return;
      if (e.deltaY > 30) navigateSection(1);
      else if (e.deltaY < -30) navigateSection(-1);
      debounceTimer = setTimeout(() => (debounceTimer = null), 1000);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [section, scrollLock]);

  // On scroll, detect new section in viewport for typing trigger
  useEffect(() => {
    const ids = ["heading", "home", "about", "discover", "faq-testimonials-contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = ids.indexOf(entry.target.id);
            if (idx !== -1) {
              setSection(idx);
              if (!typedSections.current.has(idx)) {
                typedSections.current.add(idx);
              }
            }
          }
        });
      },
      { threshold: 0.6 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const navigateSection = (dir) => {
    const next = section + dir;
    if (next < 0 || next > 4) return;
    scrollToSection(next);
  };

  const scrollToSection = (idx) => {
    const ids = ["heading", "home", "about", "discover", "faq-testimonials-contact"];
    const el = document.getElementById(ids[idx]);
    if (el) {
      setScrollLock(true);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setSection(idx);
      typedSections.current.add(idx);
      setTimeout(() => setScrollLock(false), 1100);
    }
  };

  // Form validation & handlers - same as before
  const validate = () => {
    let errs = {};
    if (!form.email.trim() && !form.phone.trim()) {
      errs.email = "Email or phone is required";
      errs.phone = "Email or phone is required";
    }
    if (!form.name.trim()) errs.name = "Name is required";
    else if (form.name.length > 40) errs.name = "Name must be under 40 characters";
    if (!form.queryType) errs.queryType = "Please select a query type";
    if (!form.message.trim()) errs.message = "Message is required";
    if (form.message.length > 500) errs.message = "Message must be under 500 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      alert("Thank you for your message!");
      setForm({ name: "", email: "", phone: "", queryType: "", message: "" });
      setErrors({});
      setSubmitting(false);
    }, 1400);
  };
  const onReset = (e) => {
    e.preventDefault();
    setForm({ name: "", email: "", phone: "", queryType: "", message: "" });
    setErrors({});
  };

  return (
    <>
      <FuturisticThemeWrapper>
      
  {/* <Header setSection={scrollToSection} /> removed as per request */}

      {/* 1. Heading Section with custom heading and news box centered right */}
      <section id="heading" className="flex flex-col md:flex-row items-center justify-between gap-10 relative">
        {/* Left Part: Custom heading and button */}
        <div className="flex-1 max-w-xl flex flex-col items-start relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div aria-label="Unmasking Deepfakes" style={{ userSelect: "none", whiteSpace: "nowrap", position: "relative" }}>
              <span className="heading-unmasking">Unmasking</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="heading-deepfakes">Deepfakes</span>
            </div>
          </motion.div>
          <h2 className="text-indigo-300 mb-4 text-2xl font-semibold mt-4">- The Future of Trust</h2>
          <TypewriterParagraph
            paragraphs={["Your comprehensive resource for detecting and understanding synthetic media."]}
            cursorVisible={true}
            startTyping={section === 0}
            speed={15}
          />
          <button onClick={() => scrollToSection(1)} className="btn-primary text-lg mt-6">
            Explore
          </button>
        </div>
        {/* Latest News on right side, horizontally centered in vertical space with margin below header and 5rem right margin */}
        <NewsScroller />
      </section>

      {/* 2. Home Section (Image Left, Content Right) */}
<section id="home" className="flex flex-col md:flex-row items-center justify-center gap-16">
  <div className="md:w-1/2 md:order-1 rounded-lg shadow-lg overflow-hidden max-w-xl">
    <img
      src={SECTIONS[0].image}
      alt={SECTIONS[0].title}
      className="w-full h-64 object-cover"
      loading="lazy"
    />
  </div>
  <div className="md:w-1/2 md:order-2 max-w-xl space-y-6">
    <h2 className="text-4xl font-bold text-indigo-400 mb-2">{SECTIONS[0].title}</h2>
    <h3 className="text-xl font-semibold text-indigo-300 mb-6">{SECTIONS[0].subtitle}</h3>
    <TypewriterParagraph
      paragraphs={SECTIONS[0].paragraphs}
      cursorVisible={true}
      startTyping={section === 1}
      speed={15}
    />
  </div>
</section>

{/* 3. About Us Section (Image Right, Content Left) */}
<section id="about" className="flex flex-col md:flex-row items-center gap-16 justify-center">
  <div className="md:w-1/2 md:order-2 rounded-lg shadow-lg overflow-hidden max-w-xl">
    <img
      src={SECTIONS[1].image}
      alt={SECTIONS[1].title}
      className="w-full h-64 object-cover"
      loading="lazy"
    />
  </div>
  <div className="md:w-1/2 md:order-1 max-w-xl space-y-6">
    <h2 className="text-4xl font-bold text-indigo-400">{SECTIONS[1].title}</h2>
    <h3 className="text-xl font-semibold text-indigo-300 mb-6">{SECTIONS[1].subtitle}</h3>
    <TypewriterParagraph
      paragraphs={SECTIONS[1].paragraphs}
      cursorVisible={true}
      startTyping={section === 2}
      speed={15}
    />
  </div>
</section>

{/* 4. Discover Section (Image Left, Content Right) */}
<section id="discover" className="flex flex-col md:flex-row items-center gap-16 justify-center">
  <div className="md:w-1/2 rounded-lg shadow-lg overflow-hidden max-w-xl">
    <img
      src={SECTIONS[2].image}
      alt={SECTIONS[2].title}
      className="w-full h-64 object-cover"
      loading="lazy"
    />
  </div>
  <div className="md:w-1/2 max-w-xl space-y-6">
    <h2 className="text-4xl font-bold text-indigo-400">{SECTIONS[2].title}</h2>
    <h3 className="text-xl font-semibold text-indigo-300 mb-6">{SECTIONS[2].subtitle}</h3>
    <TypewriterParagraph
      paragraphs={SECTIONS[2].paragraphs}
      cursorVisible={true}
      startTyping={section === 3}
      speed={15}
    />
  </div>
</section>

     {/* 5. FAQ + Testimonials left, Contact right */}
<section
  id="faq-testimonials-contact"
  className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 gap-10 justify-between pt-[2px] pb-12"
  style={{ paddingTop: "6rem" }}
>
  {/* Left side: FAQ and Testimonials */}
  <div className="md:w-1/2 space-y-12 max-w-xl">
    <div>
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center md:text-left">FAQ</h2>
      <FAQAccordion />
    </div>
    <div>
      <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center md:text-left">Testimonials</h2>
      <Testimonials />
    </div>
  </div>

  {/* Right side: Contact Form */}
  <div className="md:w-1/2 max-w-xl">
    <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center md:text-left">Contact Us</h2>
    <form onSubmit={onSubmit} className="space-y-6" ref={formRef} noValidate>
      <div className="flex flex-col sm:flex-row gap-6">
        <InputField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Required"
          error={errors.name}
          className="flex-1"
        />
        <InputField
          label="Phone (optional)"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          type="tel"
          placeholder="Optional"
          error={errors.phone}
          className="flex-1"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <InputField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Required if no phone"
          error={errors.email}
          className="flex-1"
        />
        <SelectField
          label="Query Type"
          name="queryType"
          value={form.queryType}
          onChange={handleChange}
          options={["", "General", "Technical", "Feedback"]}
          error={errors.queryType}
          className="flex-1"
        />
      </div>
      <TextareaField
        label="Message"
        name="message"
        value={form.message}
        onChange={handleChange}
        maxLength={500}
        error={errors.message}
      />
      <div className="flex flex-wrap gap-6 justify-center md:justify-start">
        <button
          type="reset"
          onClick={onReset}
          disabled={submitting}
          className="btn-primary bg-indigo-600 hover:bg-indigo-700 py-3 px-8 flex-grow md:flex-grow-0"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary py-3 px-8 flex-grow md:flex-grow-0"
        >
          {submitting ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  </div>
</section>
</FuturisticThemeWrapper>
    </>
  );
}
