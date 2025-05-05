import React from "react";
import CodePreview from "./CodePreview"; // separate component
import { routes } from "../routes/routes.js"; // optional, if you have route constants

// 💬 TEXT & LINKS AS CONSTANTS
const HEADLINE_LINE1 = "Code The Challenge,";
const HEADLINE_LINE2 = "Conquer The Test";
const DESCRIPTION = "Test your skills with confidence on our cheat-proof platform. Assess, improve, and prove your coding abilities, securely and efficiently.";
const BTN_GO_TO_SRC = "Go to Source Code";
const BTN_CONTACT = "Contact Developers";

const HeroSection = () => {
  return (
    <section className="bg-[var(--color-bg)] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Text Section */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            <span>{HEADLINE_LINE1}</span><br />
            <span className="text-[var(--color-primary)]">{HEADLINE_LINE2}</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-300">
            {DESCRIPTION}
          </p>

          <div className="mt-6 flex gap-4">
            <a
              href={routes?.GOTOSRC || "#"}
              className="bg-[var(--color-primary)] text-black px-5 py-2 rounded-md font-semibold hover:opacity-80 transition"
            >
              {BTN_GO_TO_SRC}
            </a>
            <a
             href={routes?.MAIL_TO_DEV || "#"}
              className="bg-zinc-800 border border-zinc-600 px-5 py-2 rounded-md font-semibold text-white hover:bg-zinc-700 transition"
            >
              {BTN_CONTACT}
            </a>
          </div>
        </div>

        {/* Code Block */}
        <CodePreview />
      </div>
    </section>
  );
};

export default HeroSection;
