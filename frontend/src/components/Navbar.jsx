import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const checkDropdown = [
  { label: "Images", path: "/check/image" },
  { label: "Videos", path: "/check/video" },
  { label: "Text", path: "/check/text" },
  { label: "Audio", path: "/check/audio" },
  { label: "Files", path: "/check/file" },
];
const downloadDropdown = [
  { label: "Mobile App", path: "/mobileapp" },
  { label: "Browser Extension", path: "/browserextension" },
];

function DropdownPortal({ triggerRef, onClose, items = [], show, width = 190, menuKey }) {
  const dropdownRef = useRef();
  const [coords, setCoords] = useState({ top: 0, left: 0, width });

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, width),
      });
    }
  }, [show, triggerRef, width, menuKey]);

  useEffect(() => {
    if (!show) return;
    let hovering = false;
    let timeout = null;
    function onOver() {
      hovering = true;
      if (timeout) clearTimeout(timeout);
    }
    function onOut() {
      hovering = false;
      timeout = setTimeout(() => {
        if (!hovering) onClose();
      }, 100);
    }
    const menu = dropdownRef.current,
      trigger = triggerRef.current;
    if (menu && trigger) {
      menu.addEventListener("mouseenter", onOver);
      menu.addEventListener("mouseleave", onOut);
      trigger.addEventListener("mouseenter", onOver);
      trigger.addEventListener("mouseleave", onOut);
    }
    return () => {
      if (menu && trigger) {
        menu.removeEventListener("mouseenter", onOver);
        menu.removeEventListener("mouseleave", onOut);
        trigger.removeEventListener("mouseenter", onOver);
        trigger.removeEventListener("mouseleave", onOut);
      }
      if (timeout) clearTimeout(timeout);
    };
  }, [show, onClose, triggerRef, dropdownRef]);

  const dropdown = show ? (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        style={{
          position: "absolute",
          left: coords.left,
          top: coords.top,
          minWidth: coords.width,
          zIndex: 1000,
          pointerEvents: show ? "auto" : "none",
        }}
      >
        <div className="dropdown-amazon-card small">
          {items.map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              className={({ isActive }) =>
                "navbar-link" + (isActive ? " navbar-link-active" : "")
              }
              style={{ textDecoration: "none" }}
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  ) : null;
  return ReactDOM.createPortal(dropdown, document.body);
}

export default function Navbar() {
  const [dropdown, setDropdown] = useState(null);
  const checkButtonRef = useRef(),
    downloadButtonRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === "/" &&
      location.state &&
      location.state.scrollToContact
    ) {
      const el = document.getElementById("faq-testimonials-contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const handleNavScrollTop = () =>
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);

  return (
    <nav
      className="sticky top-0 z-50 bg-gradient-to-r from-[#1a1a2e80] via-[#20204090] to-[#090a2280] shadow-2xl backdrop-blur-md border-b border-[#24244899]"
      style={{ minHeight: "56px", boxShadow: "0 4px 32px 0 rgba(14,13,32,0.12)" }}
    >
      <style>{`
        .brand-glitch {
          font-weight: 900;
          font-size: 2.3rem;
          color: #ec4899;
          user-select: none;
          font-family: inherit;
          letter-spacing: 0.01em;
          text-shadow: 0 2px 20px #6d28d930, 0 0 5px #f43f5e9a;
          animation: glitch 1.2s infinite linear alternate;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        @keyframes glitch {
          0% {text-shadow: 2px 0 #9475e2, -2px 0 #14b8a6;}
          20% {text-shadow: -2px 0 #ec4899, 2px 0 #38bdf8;}
          40% {text-shadow: 2px 0 #ef4444, -2px 0 #38bdf8;}
          60% {text-shadow: -2px 0 #6366f1, 2px 0 #eab308;}
          80% {text-shadow: 2px 0 #ef4444, -2px 0 #38bdf8;}
          100% {text-shadow: none;}
        }
        .navbar-link, .navbar-link:visited {
          color: #e5e7ef;
          font-weight: 500;
          transition: color .18s;
          text-decoration: none !important;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .navbar-link-active, .navbar-link:active {
          color: #a86efd !important;
        }
        .dropdown-amazon-card.small {
          background: #222039;
          border: 1.2px solid #34255b;
          box-shadow: 0 14px 30px 0 rgba(50,40,110,0.16), 0 2px 9px 0 #30204838;
          padding: 0.5rem 0.22rem;
          border-radius: 0.72rem;
          min-width: 190px;
          max-width: 225px;
        }
        @media (max-width:560px) {
          .dropdown-amazon-card.small { min-width:0; max-width:95vw; padding: 0.35rem 0.1rem;}
        }
        .dropdown-amazon-card.small a {
          color: #e4e5ef;
          padding: 0.42rem 0.86rem;
          font-size: 0.97rem;
          border-radius: 0.34rem;
          display: block;
          margin: 0.09rem 0;
          transition: all .15s cubic-bezier(.31,.86,.4,1.3);
          text-decoration: none !important;
        }
        .dropdown-amazon-card.small a:hover, .dropdown-amazon-card.small .navbar-link-active {
          background: #a86efd26;
          color: #fff !important;
          font-weight: 600 !important;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
        <Link
          to="/"
          className="brand-glitch select-none tracking-tight"
          onClick={(e) => {
            if (location.pathname !== "/") {
              handleNavScrollTop();
            } else {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setDropdown(null);
            }
          }}
        >
          The Deep Busters
        </Link>
        <ul className="flex gap-6 px-2 overflow-x-auto py-2 items-center" role="menubar">
          <li role="none">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                "navbar-link" + (isActive ? " navbar-link-active" : "")
              }
              onClick={(e) => {
                if (location.pathname !== "/") {
                  handleNavScrollTop();
                } else {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setDropdown(null);
                }
              }}
              style={{ textDecoration: "none" }}
            >
              Home
            </NavLink>
          </li>
          <li role="none">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                "navbar-link" + (isActive ? " navbar-link-active" : "")
              }
              onClick={() => {
                handleNavScrollTop();
                setDropdown(null);
              }}
              style={{ textDecoration: "none" }}
            >
              About Us
            </NavLink>
          </li>
          <li role="none">
            <NavLink
              to="/discover"
              className={({ isActive }) =>
                "navbar-link" + (isActive ? " navbar-link-active" : "")
              }
              onClick={() => {
                handleNavScrollTop();
                setDropdown(null);
              }}
              style={{ textDecoration: "none" }}
            >
              Discover
            </NavLink>
          </li>
          {/* CHECK dropdown */}
          <li className="relative" role="none">
            <button
              className="navbar-link inline-flex items-center focus:outline-none select-none"
              ref={checkButtonRef}
              aria-haspopup="true"
              aria-expanded={dropdown === "check"}
              type="button"
              onMouseEnter={() => setDropdown("check")}
              onMouseDown={() => setDropdown("check")}
            >
              Check
              <svg
                className="ml-1 w-4 h-4 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  transform: dropdown === "check" ? "rotate(180deg)" : "none",
                  transition: "0.13s",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <DropdownPortal
              show={dropdown === "check"}
              triggerRef={checkButtonRef}
              items={checkDropdown}
              menuKey="check"
              onClose={() => setDropdown(null)}
              width={190}
            />
          </li>
          {/* DOWNLOAD dropdown */}
          <li className="relative" role="none">
            <button
              className="navbar-link inline-flex items-center focus:outline-none select-none"
              ref={downloadButtonRef}
              aria-haspopup="true"
              aria-expanded={dropdown === "download"}
              type="button"
              onMouseEnter={() => setDropdown("download")}
              onMouseDown={() => setDropdown("download")}
            >
              Download
              <svg
                className="ml-1 w-4 h-4 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  transform: dropdown === "download" ? "rotate(180deg)" : "none",
                  transition: "0.13s",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <DropdownPortal
              show={dropdown === "download"}
              triggerRef={downloadButtonRef}
              items={downloadDropdown}
              menuKey="download"
              onClose={() => setDropdown(null)}
              width={190}
            />
          </li>
          {/* CONTACT US scroll */}
          <li role="none">
            <a
              href="#faq-testimonials-contact"
              className="navbar-link cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname === "/") {
                  const el = document.getElementById("faq-testimonials-contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/", { state: { scrollToContact: true } });
                }
                setDropdown(null);
              }}
            >
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
