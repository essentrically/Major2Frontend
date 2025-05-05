// src/components/ContestQuestions.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionsForContest, getContestDetailsById } from "../api/api";
import ContestQuestionView from "./ContestQuestionView";
import { routes } from "../routes/routes";

const ContestQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null); // in seconds

  const handleSubmitContest = () => {
    if (!id) return;
    const key = "submittedContestsByauth_user";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");

    if (!existing.includes(id)) {
      localStorage.setItem(key, JSON.stringify([...existing, id]));
    }

    navigate(routes.HOME || "/");
  };

  const calculateSecondsRemaining = (endTimeUTC) => {
    const end = new Date(endTimeUTC);
    const now = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST
    const secondsLeft = Math.floor((end.getTime() - now.getTime()) / 1000);
    return secondsLeft > 0 ? secondsLeft : 0;
  };

  useEffect(() => {
    let timerId;
    if (timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            handleSubmitContest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    const fetchData = async () => {
      const contest = await getContestDetailsById(id);
      const result = await getQuestionsForContest(id);

      if (result && contest?.endTime) {
        const withContestId = result.map((q) => ({
          ...q,
          contestId: id,
        }));
        setQuestions(withContestId);
        const seconds = calculateSecondsRemaining(contest.endTime);
        setTimeLeft(seconds);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)] mb-4"></div>
          <p className="text-lg text-zinc-400">Loading Contest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {timeLeft !== null && (
        <div className="fixed top-4 right-6 bg-red-700 text-white px-4 py-2 rounded-full font-bold z-50 shadow-lg">
          Time Left: {formatTime(timeLeft)}
        </div>
      )}
      <ContestQuestionView
        questions={questions}
        onSubmitContest={handleSubmitContest}
        contestId={id}
      />
    </div>
  );
};

export default ContestQuestions;
