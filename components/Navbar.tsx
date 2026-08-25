"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SectionBadge from "./SectionBadge";

const navLinks = [
  { name: "About", path: "/about" },
  { name: "Portfolio", path: "/" },
  { name: "Service", path: "/service" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex justify-between items-center px-4 py-8 md:px-8">
      {/* Left: Brand / Title */}
      <SectionBadge title="END Design" />

      {/* Right: Desktop Nav */}
      <nav className="hidden md:flex gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`font-sans text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity ${
              pathname === link.path ? "underline underline-offset-4" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden flex flex-col justify-center items-center gap-1.5 z-50 p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-24 left-4 right-4 bg-white shadow-xl border border-gray-100 rounded-lg p-6 flex flex-col gap-6 md:hidden z-40">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`font-sans text-sm uppercase tracking-widest font-semibold ${
                pathname === link.path ? "underline underline-offset-4" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
