import React from "react";

const FeatureCard = ({ icon, title, description, isHover, link }) => {
  if (isHover) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2 shadow-md hover:shadow-amber-200 hover:-m-0.5 transition duration-300 ease-in-out">
        <div className="text-[var(--color-primary)] text-2xl">{icon}</div>
        <h3 className="text-white font-semibold text-l">{title}</h3>
        <p className="text-zinc-400 text-sm">{description}</p>
      </div>
    );
  } else {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2 shadow-md"
           onClick={() => window.open(link, "_blank")}
           style={{ cursor: "pointer" }}>
        <div className="text-[var(--color-primary)] text-2xl">{icon}</div>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="text-zinc-400 text-sm">{description}</p>
      </div>
    );
  }
};

export default FeatureCard;
