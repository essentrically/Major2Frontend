import React, { useEffect, useState } from "react";
import FeatureCard from "./FeatureCard";
import ContestsShow from "./ContestsShow";
import {
  FaShieldAlt,
  FaUserLock,
  FaDesktop,
  FaCode,
  FaBolt,
  FaEyeSlash,
  FaEye,
  FaUikit,
} from "react-icons/fa";
import { getContestForUserByEmail } from "../api/api";

const features = [
  { icon: <FaShieldAlt />, title: "Plagiarism Detection", description: "Advanced algorithms to detect and prevent code plagiarism.", isHover: true },
  { icon: <FaUserLock />, title: "Strict Integrity Checks", description: "No external copy-paste, ensuring authentic problem-solving skills.", isHover: true },
  { icon: <FaDesktop />, title: "Focused Environment", description: "No tab switching, keeping candidates focused on the task at hand.", isHover: true },
  { icon: <FaCode />, title: "Multi-Language Support", description: "Submissions in C, C++, Java, Python, JavaScript and more.", isHover: true },
  { icon: <FaBolt />, title: "Instant Execution", description: "Run your code instantly any number of times!", isHover: true },
  { icon: <FaEyeSlash />, title: "Hidden Test Cases", description: "Hidden test cases to prevent pre-emptive optimization.", isHover: true },
  { icon: <FaEye />, title: "Sample Test Cases", description: "Test your solution with sample cases before submitting.", isHover: true },
  { icon: <FaUikit />, title: "User Friendly UI", description: "Intuitive interface for easy navigation and code submission.", isHover: true },
];

const FeatureSection = ({ user }) => {
  const [contests, setContests] = useState(null); // null means "not loaded yet"

  useEffect(() => {
    const fetchContests = async () => {
      if (!user?.email) return;
    
      try {
        const contestsFromAPI = await getContestForUserByEmail(user.email);
        const attemptedContestIds = JSON.parse(
          localStorage.getItem("submittedContestsByauth_user") || "[]"
        );
    
        const filteredContests = contestsFromAPI.filter(
          (contest) => !attemptedContestIds.includes(contest.ixd)
        );
    
        setContests(filteredContests);
      } catch (error) {
        console.error("Failed to fetch contests:", error);
        setContests([]);
      }
    };

    fetchContests();
  }, [user]);

  return (
    <div>
      {user && (
        contests === null ? (
          <section className="bg-[var(--color-bg)] py-20 px-6 text-white text-center">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
                Your Contests
              </h2>
              <p className="text-zinc-400 animate-pulse">Loading your contests...</p>
            </div>
          </section>
        ) : (
          <ContestsShow contests={contests} />
        )
      )}

      <section className="bg-[var(--color-bg)] py-20 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <FeatureCard key={i} {...feat} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureSection;
