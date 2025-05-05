import "../styles/theme.css";
import logo from "../assets/logo.png";
import React, { useState } from "react";
import { routes } from "../routes/routes";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[var(--color-bg)] text-white border-b border-[var(--color-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="DeltaCode"
            className="h-8 w-auto object-cover"
            style={{ height: "32px", objectFit: "cover" }}
          />
          <span className="text-xl font-bold text-[var(--color-primary)] hidden sm:inline">
            DELTACODE
          </span>
        </div>

        {/* Right-side Auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <img
                src={`data:image/jpeg;base64,${user.base64image}`}
                alt="User Avatar"
                className="h-8 w-8 rounded-full object-cover border-2 border-[var(--color-primary)]"
              />
              <span className="text-sm">{user.name}</span>
            </div>
          ) : (
            <Link
              to={routes?.SIGNIN || "/signin"}
              className="bg-[var(--color-primary)] text-black px-4 py-1.5 rounded font-semibold hover:opacity-70 hover:bg-[var(--color-primary-light)] transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-2">
          <a
            href="#"
            className="block text-sm hover:text-[var(--color-primary)]"
          >
            Home
          </a>
          <a
            href="#"
            className="block text-sm hover:text-[var(--color-primary)]"
          >
            Problems
          </a>
          <a
            href="#"
            className="block text-sm hover:text-[var(--color-primary)]"
          >
            Contests
          </a>
          <a
            href="#"
            className="block text-sm hover:text-[var(--color-primary)]"
          >
            About
          </a>
          {user ? (
            <div className="flex items-center gap-3 mt-2">
              <img
                src={`data:image/jpeg;base64,${user.base64image}`}
                alt="User Avatar"
                className="h-8 w-8 rounded-full object-cover border-2 border-[var(--color-primary)]"
              />
              <span className="text-sm">{user.name}</span>
            </div>
          ) : (
            <Link
              to={routes?.SIGNIN || "/signin"}
              className="bg-[var(--color-primary)] text-black px-4 py-1.5 rounded font-semibold hover:opacity-70 hover:bg-[var(--color-primary-light)] transition"
            >
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
