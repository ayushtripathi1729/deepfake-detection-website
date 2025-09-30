import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Discover", path: "/discover" },
  { label: "Images", path: "/check/image" },
  { label: "Videos", path: "/check/video" },
  { label: "Text", path: "/check/text" },
  { label: "Audio", path: "/check/audio" },
  { label: "Files", path: "/check/file" }
];

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-md bg-opacity-90"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex gap-6 overflow-x-auto py-4 text-gray-700" role="menubar">
          {navItems.map(({ label, path }) => (
            <li key={path} className="whitespace-nowrap" role="none">
              <NavLink
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold underline"
                    : "hover:text-indigo-600 transition-colors"
                }
                role="menuitem"
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
