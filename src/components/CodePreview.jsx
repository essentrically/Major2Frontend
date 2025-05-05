import React, { useState } from "react";

const codeMap = {
  "welcome.cpp": {
    label: "welcome.cpp",
    jsx: (
      <pre className="pt-10 text-zinc-100">
        <span className="text-purple-400">#include</span>{" "}
        <span className="text-orange-300">&lt;iostream&gt;</span>
        <br />
        <span className="text-purple-400">using namespace</span>{" "}
        <span className="text-blue-400">std</span>;
        <br />
        <br />
        <span className="text-blue-400">int</span>{" "}
        <span className="text-green-400">main</span>() {"{"}
        <br />
        &nbsp;&nbsp;<span className="text-white">cout</span> &lt;&lt;{" "}
        <span className="text-yellow-300">"Welcome to DeltaCode!"</span> &lt;&lt;{" "}
        <span className="text-white">endl</span>;
        <br />
        &nbsp;&nbsp;<span className="text-white">cout</span> &lt;&lt;{" "}
        <span className="text-yellow-300">
          "Optimizing your code assessments!"
        </span>{" "}
        &lt;&lt; <span className="text-white">endl</span>;
        <br />
        &nbsp;&nbsp;<span className="text-purple-400">return</span> 0;
        <br />
        {"}"}
      </pre>
    ),
  },
  "welcome.py": {
    label: "welcome.py",
    jsx: (
      <pre className="pt-10 text-zinc-100">
        <span className="text-blue-400">print</span>(
        <span className="text-yellow-300">"Welcome to DeltaCode!"</span>)
        <br />
        <span className="text-blue-400">print</span>(
        <span className="text-yellow-300">
          "Optimizing your code assessments!"
        </span>
        )
      </pre>
    ),
  },
  "Welcome.java": {
    label: "Welcome.java",
    jsx: (
      <pre className="pt-10 text-zinc-100">
        <span className="text-purple-400">public class</span>{" "}
        <span className="text-green-400">Welcome</span> {"{"}
        <br />
        &nbsp;&nbsp;<span className="text-purple-400">public static void</span>{" "}
        <span className="text-green-400">main</span>(
        <span className="text-blue-400">String[]</span> args) {"{"}
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">System</span>.
        <span className="text-white">out</span>.
        <span className="text-blue-400">println</span>(
        <span className="text-yellow-300">"Welcome to DeltaCode!"</span>);
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">System</span>.
        <span className="text-white">out</span>.
        <span className="text-blue-400">println</span>(
        <span className="text-yellow-300">
          "Optimizing your code assessments!"
        </span>
        );
        <br />
        &nbsp;&nbsp;{"}"}
        <br />
        {"}"}
      </pre>
    ),
  },
  "welcome.js": {
    label: "welcome.js",
    jsx: (
      <pre className="pt-10 text-zinc-100">
        <span className="text-white">console</span>.
        <span className="text-blue-400">log</span>(
        <span className="text-yellow-300">"Welcome to DeltaCode!"</span>);
        <br />
        <span className="text-white">console</span>.
        <span className="text-blue-400">log</span>(
        <span className="text-yellow-300">
          "Optimizing your code assessments!"
        </span>
        );
      </pre>
    ),
  },
  "welcome.go": {
    label: "welcome.go",
    jsx: (
      <pre className="pt-10 text-zinc-100">
        <span className="text-purple-400">package</span>{" "}
        <span className="text-blue-400">main</span>
        <br />
        <span className="text-purple-400">import</span>{" "}
        <span className="text-orange-300">"fmt"</span>
        <br />
        <br />
        <span className="text-purple-400">func</span>{" "}
        <span className="text-green-400">main</span>() {"{"}
        <br />
        &nbsp;&nbsp;<span className="text-blue-400">fmt</span>.
        <span className="text-blue-400">Println</span>(
        <span className="text-yellow-300">"Welcome to DeltaCode!"</span>)
        <br />
        &nbsp;&nbsp;<span className="text-blue-400">fmt</span>.
        <span className="text-blue-400">Println</span>(
        <span className="text-yellow-300">
          "Optimizing your code assessments!"
        </span>
        )
        <br />
        {"}"}
      </pre>
    ),
  },
};

const CodePreview = () => {
  const [selected, setSelected] = useState("welcome.cpp");

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg text-sm font-mono leading-relaxed relative overflow-hidden">
      {/* Top terminal circles */}
      <div className="absolute top-3 left-4 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>

      {/* File Dropdown */}
      <div className="absolute top-3 right-4 text-xs text-zinc-300">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1 focus:outline-none"
        >
          {Object.keys(codeMap).map((key) => (
            <option key={key} value={key}>
              {codeMap[key].label}
            </option>
          ))}
        </select>
      </div>

      {/* Render code block */}
      <div>{codeMap[selected].jsx}</div>
    </div>
  );
};

export default CodePreview;
