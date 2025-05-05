// src/components/ContestQuestionView.jsx
import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { go } from "@codemirror/lang-go";
import { java } from "@codemirror/lang-java";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import {
  checkPlagiarism,
  executeCode,
  getAllSubmissionsForContestAndQuestion,
  submitCode,
  upadtePlagiarismDetails,
  updateSubmissionStatus,
} from "../api/api";

const languageExtensions = {
  cpp: cpp(),
  javascript: javascript(),
  python: python(),
  go: go(),
  java: java(),
};

const supportedLanguages = [
  { name: "C++", value: "cpp" },
  { name: "JavaScript", value: "javascript" },
  { name: "Python", value: "python" },
  { name: "Go", value: "go" },
  { name: "Java", value: "java" },
];

const ContestQuestionView = ({
  questions = [],
  onSubmitContest,
  contestId,
}) => {
  const [selectedQIndex, setSelectedQIndex] = useState(0);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here");
  const [running, setRunning] = useState(false);
  const [sampleResults, setSampleResults] = useState([]);
  const [questionStatuses, setQuestionStatuses] = useState(
    questions.map(() => "unattempted")
  );
  const [submissionResults, setSubmissionResults] = useState(
    questions.map(() => "")
  );
  const [showPlagModal, setShowPlagModal] = useState(false);

  const currentQ = questions[selectedQIndex];

  const updateStatus = (index, status, message = "") => {
    const updatedStatuses = [...questionStatuses];
    updatedStatuses[index] = status;
    setQuestionStatuses(updatedStatuses);

    const updatedResults = [...submissionResults];
    updatedResults[index] = message;
    setSubmissionResults(updatedResults);
  };

  const runSampleTests = async () => {
    setRunning(true);
    setSampleResults([]);
    const results = [];

    for (const [input, expected] of Object.entries(
      currentQ.sampleTests || {}
    )) {
      const [success, output] = await executeCode(
        code,
        language,
        input,
        currentQ.timeLimit || 1
      );
      results.push({
        input,
        expected,
        output,
        success,
        pass: success && output.trim() === expected.trim(),
      });
    }

    setSampleResults(results);
    setRunning(false);
  };

  const submitSolution = async () => {
    setRunning(true);
    let allPassed = true;
    let detailedOutput = "";
  
    for (const [input, expected] of Object.entries(currentQ.testCases || {})) {
      const [success, output] = await executeCode(
        code,
        language,
        input,
        currentQ.timeLimit || 1
      );
  
      if (!success || output.trim() !== expected.trim()) {
        allPassed = false;
        detailedOutput = success
          ? `❌ Wrong Answer\nExpected: ${expected}\nGot: ${output}`
          : `💥 Runtime Error\n${output}`;
        break;
      }
    }
  
    if (allPassed) {
      updateStatus(selectedQIndex, "accepted", "✅ All test cases passed!");
    } else {
      updateStatus(selectedQIndex, "rejected", detailedOutput);
    }

    setRunning(false);
  
    try {
      const subs = await getAllSubmissionsForContestAndQuestion(
        contestId,
        currentQ.id
      );
      console.log("Submissions fetched:", subs);
  
      let plagDetected = false;
      let details = "";
  
      if (subs && typeof subs === "object" && Object.keys(subs).length > 0) {
        for (const [key, value] of Object.entries(subs)) {
          for (const subOfUser of value) {
            const plagCheck = await checkPlagiarism(
              code,
              language,
              subOfUser.code,
              subOfUser.language,
              0.8,
              true
            );
  
            const [isSuccess, isPlag, _, message] = plagCheck;
            if (isSuccess && isPlag) {
              await updateSubmissionStatus(subOfUser.id, "PLAG");
              await upadtePlagiarismDetails(subOfUser.id, message);
  
              plagDetected = true;
              details += `\n${message}`;
              console.log("Plagiarism detected:", message);
            }
          }
        }
      }
  
      const authUser = JSON.parse(
        localStorage.getItem("auth_user_deltacode") || "{}"
      );
  
      await submitCode(
        currentQ.id,
        authUser?.email,
        contestId,
        code,
        language,
        allPassed,
        true,
        plagDetected,
        details
      );
  
      if (plagDetected) {
        console.log("Check Plag Is True");
        setShowPlagModal(true);
        return;
      }
    } catch (err) {
      console.error("Error during plagiarism check:", err);
  
      const authUser = JSON.parse(
        localStorage.getItem("auth_user_deltacode") || "{}"
      );
  
      await submitCode(
        currentQ.id,
        authUser?.email,
        contestId,
        code,
        language,
        allPassed,
        false,
        false,
        ""
      );
    }
  };

  useEffect(() => {
    if (showPlagModal) {
      console.log("Plagiarism modal shown. Auto-submitting in 2 seconds.");
      const timeout = setTimeout(() => {
        console.log("Auto-submitting contest due to plagiarism detection.");
        onSubmitContest?.();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [showPlagModal]);

  if (!questions.length) {
    return (
      <div className="text-white text-center py-20">
        No questions available.
      </div>
    );
  }

  return (
    <div className="text-white bg-[var(--color-bg)] min-h-screen px-4 py-6 pb-24 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex gap-3 mb-4 overflow-x-auto">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => {
                setSelectedQIndex(i);
                setSampleResults([]);
              }}
              className={`relative px-4 py-2 rounded font-semibold border transition whitespace-nowrap ${
                selectedQIndex === i
                  ? "bg-[var(--color-primary)] text-black"
                  : "border-zinc-700 text-zinc-400 hover:border-[var(--color-primary)]"
              }`}
            >
              Q{i + 1}
              {questionStatuses[i] === "accepted" && (
                <span className="absolute top-0 right-0 bg-green-500 text-xs px-1 py-0.5 rounded-bl font-bold text-black">
                  ✓
                </span>
              )}
              {questionStatuses[i] === "rejected" && (
                <span className="absolute top-0 right-0 bg-red-500 text-xs px-1 py-0.5 rounded-bl font-bold text-black">
                  ✗
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
            {currentQ.title}
          </h2>
          <p className="text-sm text-zinc-300 whitespace-pre-wrap mb-4">
            {currentQ.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {Object.entries(currentQ.sampleTests || {}).map(
              ([input, expected], idx) => {
                const result = sampleResults[idx];
                return (
                  <div
                    key={idx}
                    className={`border p-3 rounded ${
                      result
                        ? result.pass
                          ? "border-green-600"
                          : "border-red-600"
                        : "border-zinc-700"
                    }`}
                  >
                    <p className="text-zinc-400">Input:</p>
                    <pre className="bg-zinc-800 p-2 rounded text-white">
                      {input}
                    </pre>
                    <p className="text-zinc-400 mt-2">Expected Output:</p>
                    <pre className="bg-zinc-800 p-2 rounded text-green-400">
                      {expected}
                    </pre>
                    {result && (
                      <>
                        <p className="text-zinc-400 mt-2">Your Output:</p>
                        <pre
                          className={`bg-zinc-800 p-2 rounded ${
                            result.pass ? "text-green-500" : "text-red-400"
                          }`}
                        >
                          {result.output}
                        </pre>
                        <p
                          className={`mt-2 font-semibold ${
                            result.pass ? "text-green-400" : "text-red-500"
                          }`}
                        >
                          {result.pass ? "✅ Passed" : "❌ Failed"}
                        </p>
                      </>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-400">
            Language:
            <select
              className="ml-3 px-3 py-1 bg-zinc-800 text-white border border-zinc-600 rounded"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-3">
            <button
              onClick={runSampleTests}
              disabled={running}
              className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition disabled:opacity-60"
            >
              {running ? "Running..." : "Run"}
            </button>
            <button
              onClick={submitSolution}
              disabled={running}
              className="bg-green-500 text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition disabled:opacity-60"
            >
              {running ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <CodeMirror
          value={code}
          height="400px"
          extensions={[languageExtensions[language]]}
          theme={vscodeDark}
          onChange={(value) => setCode(value)}
          className="rounded-lg border border-zinc-700"
        />

        {submissionResults[selectedQIndex] && (
          <div className="mt-6 bg-zinc-800 border border-zinc-700 p-4 rounded">
            <pre className="text-sm text-white whitespace-pre-wrap">
              {submissionResults[selectedQIndex]}
            </pre>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 py-4 px-6 flex justify-center">
        <button
          onClick={() => onSubmitContest?.()}
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition"
        >
          🚀 Submit Contest
        </button>
      </div>

      {showPlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-zinc-800 max-w-md mx-auto rounded-lg p-6 border border-red-500 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-3">
              Plagiarism Detected
            </h2>
            <p className="text-white mb-4">
              You have been disqualified from this contest due to plagiarism.
            </p>
            <p className="text-zinc-400 text-sm">
              If you believe this is a mistake, please contact the developers
            </p>
            <p className="text-zinc-600 mt-4 text-sm italic">
              Auto-submitting...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestQuestionView;
