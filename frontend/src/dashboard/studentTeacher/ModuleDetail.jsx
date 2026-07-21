import { useState } from "react";
import { FaArrowLeft, FaBars, FaHome } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import MainMenuDropdown from "./StudentMainMenuDropdown";
import overviewData from "./overviewData";

// Turns "[Label](url)" into a real clickable link. Any other text
// passes through unchanged.
function parseInline(text) {
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={key++}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// Turns simple text (with #, ###, -, |, and [label](url) markers)
// into formatted paragraphs, headings, bullet lists, links, and tables.
function FormattedText({ text }) {
  const lines = text.split("\n");
  const blocks = [];
  let currentList = null;
  let tableRows = null;

  const flushTable = (key) => {
    if (tableRows && tableRows.length > 0) {
      const [header, ...body] = tableRows;
      blocks.push(
        <table key={key} className="w-full border-collapse my-4 text-sm">
          <thead>
            <tr>
              {header.map((cell, ci) => (
                <th
                  key={ci}
                  className="border border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold"
                >
                  {parseInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-gray-300 px-3 py-2 align-top">
                    {parseInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
      tableRows = null;
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("|")) {
      currentList = null;
      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""));

      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));
      if (!isSeparator) {
        if (!tableRows) tableRows = [];
        tableRows.push(cells);
      }
      return;
    } else if (tableRows) {
      flushTable(`table-${i}`);
    }

    if (trimmed.startsWith("### ")) {
      currentList = null;
      blocks.push(
        <h4 key={i} className="font-semibold text-gray-900 mt-4 mb-1">
          {trimmed.replace("### ", "")}
        </h4>
      );
    } else if (trimmed.startsWith("# ")) {
      currentList = null;
      blocks.push(
        <h3 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-2">
          {trimmed.replace("# ", "")}
        </h3>
      );
    } else if (trimmed.startsWith("- ")) {
      if (!currentList) {
        currentList = [];
        blocks.push(
          <ul key={i} className="list-disc pl-6 space-y-1 my-2">
            {currentList}
          </ul>
        );
      }
      currentList.push(<li key={i}>{parseInline(trimmed.replace("- ", ""))}</li>);
    } else if (trimmed === "") {
      currentList = null;
    } else {
      currentList = null;
      blocks.push(
        <p key={i} className="text-gray-700 mb-3 leading-relaxed">
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  flushTable("table-end");

  return <div>{blocks}</div>;
}

// Renders whatever kind of content a step or tab has.
function StepContent({ item }) {
  if (item.type === "link") {
    return (
      <div>
        <p className="text-gray-700 mb-4">{item.intro}</p>
        <a
          href={item.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {item.linkLabel}
        </a>
      </div>
    );
  }

  if (item.type === "video") {
    return (
      <video controls className="w-full rounded-lg" src={item.videoSrc}>
        Your browser does not support video playback.
      </video>
    );
  }

  if (item.type === "download") {
    return (
      <div>
        <p className="text-gray-700 mb-4">{item.intro}</p>
        <a
          href={item.fileUrl}
          download
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {item.fileLabel}
        </a>
      </div>
    );
  }

  return <FormattedText text={item.content} />;
}

const moduleData = {
  overview: overviewData,
};

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const module = moduleData[moduleId];

  const handleNext = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    if (activeStep < module.steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  if (!module) {
    return <div className="p-6">Module not found.</div>;
  }

  const isLastStep = activeStep === module.steps.length - 1;
  const currentStep = module.steps[activeStep];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-gray-100 to-white p-6">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center mt-4 mb-4">
          <div className="flex items-center gap-3">
            <FaArrowLeft
              className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
              onClick={handleBackClick}
            />
            <FaHome
              className="text-2xl md:text-3xl cursor-pointer text-blue-600 hover:scale-110 transition-transform"
              onClick={() => navigate("/mainmenu/")}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold border-b-2 border-gray-300 pb-1">
            {module.title}
          </h1>
          <div className="relative">
            <FaBars
              className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <MainMenuDropdown onClose={() => setMenuOpen(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Side Rail + Main Content, side by side */}
      <div className="flex-grow flex gap-6 mt-4">
        {/* Side Rail */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2">
          {module.steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = completedSteps.includes(index);

            return (
              <div
                key={index}
                onClick={() => {
                  setActiveStep(index);
                  setActiveTab(0);
                }}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex-shrink-0 border-2 ${
                    isCompleted
                      ? "bg-green-500 border-green-500"
                      : isActive
                      ? "bg-white border-white"
                      : "border-gray-400"
                  }`}
                />
                <span className="font-medium">{step.name}</span>
              </div>
            );
          })}

          <div className="mt-4">
            <div className="text-sm font-medium text-gray-600 mb-1">
              {completedSteps.length} of {module.steps.length} steps completed
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(completedSteps.length / module.steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-white rounded-lg shadow p-6 overflow-y-auto max-h-[75vh]">
          <h2 className="text-2xl font-bold mb-4">{currentStep.name}</h2>

          {currentStep.tabs ? (
            <>
              <div className="flex gap-2 border-b border-gray-200 mb-4">
                {currentStep.tabs.map((tab, tabIndex) => (
                  <button
                    key={tabIndex}
                    onClick={() => setActiveTab(tabIndex)}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                      activeTab === tabIndex
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <StepContent item={currentStep.tabs[activeTab]} />
            </>
          ) : (
            <StepContent item={currentStep} />
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {isLastStep ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}