import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: true,
  });

const getStatus = (contest) => {
  const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const start = Date.parse(contest.startTime);
  const end = Date.parse(contest.endTime);

  console.log("Start Time String:", contest.startTime);
  console.log("Contest Start Time:", start);
  console.log("Contest End Time String:", contest.endTime);
  console.log("Contest End Time:", end);
  console.log("Current Time:", now);

  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "expired";
};

const getBadge = (status) => {
  switch (status) {
    case "live":
      return "bg-red-600 text-white animate-pulse";
    case "upcoming":
      return "bg-blue-700 text-white";
    case "expired":
      return "bg-zinc-600 text-white";
    default:
      return "";
  }
};

const getSortedContests = (contests) => {
  const statusOrder = { live: 0, upcoming: 1, expired: 2 };
  return contests.slice().sort((a, b) => {
    const sA = getStatus(a);
    const sB = getStatus(b);

    if (statusOrder[sA] !== statusOrder[sB]) {
      return statusOrder[sA] - statusOrder[sB];
    }

    return Date.parse(a.startTime) - Date.parse(b.startTime);
  });
};

const ContestsShow = ({ contests = [] }) => {
  const navigate = useNavigate();
  const sortedContests = getSortedContests(contests);

  const handleClick = (contest) => {
    const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const start = Date.parse(contest.startTime);
    const end = Date.parse(contest.endTime);

    if (now >= start && now <= end) {
      navigate(`/contests/${contest.id}`);
    } else if (now < start) {
      const minutes = Math.ceil((start - now) / (1000 * 60));
      const msg =
        minutes < 60
          ? `Contest starts in ${minutes} minutes`
          : `Contest starts in ${Math.floor(minutes / 60)}h ${minutes % 60}m`;
      toast.error(msg);
    } else {
      toast.error("This contest has already ended.");
    }
  };

  return (
    <section className="bg-[var(--color-bg)] py-16 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[var(--color-primary)]">
          Your Contests
        </h2>

        {sortedContests.length === 0 ? (
          <p className="text-zinc-400 text-center">No Upcoming Contests</p>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
            {sortedContests.map((contest) => {
              const status = getStatus(contest);

              return (
                <div
                  key={contest.id}
                  onClick={() => handleClick(contest)}
                  className="relative min-w-[300px] bg-zinc-800 border border-zinc-700 rounded-lg p-5 flex-shrink-0 shadow-lg transition-transform transform hover:my-0.5 hover:shadow-amber-200 cursor-pointer snap-start"
                >
                  {/* Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${getBadge(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[var(--color-primary)] mb-1">
                    {contest.name}
                  </h3>

                  {contest.organization && (
                    <p className="text-sm text-zinc-400">
                      Org:{" "}
                      <span className="text-white">{contest.organization}</span>
                    </p>
                  )}

                  {contest.usersCollege && (
                    <p className="text-sm text-zinc-400">
                      College:{" "}
                      <span className="text-white">{contest.usersCollege}</span>
                    </p>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-400">Start</p>
                      <p className="text-white">
                        {formatDate(contest.startTime)}
                      </p>
                      <p className="text-white">
                        {formatTime(contest.startTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-400">End</p>
                      <p className="text-white">
                        {formatDate(contest.endTime)}
                      </p>
                      <p className="text-white">
                        {formatTime(contest.endTime)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 mt-4 break-all">
                    ID: {contest.id}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContestsShow;
