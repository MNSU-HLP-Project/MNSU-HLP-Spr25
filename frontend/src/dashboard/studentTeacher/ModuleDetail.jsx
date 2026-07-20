import { useState } from "react";
import { FaArrowLeft, FaBars, FaHome } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import MainMenuDropdown from "./StudentMainMenuDropdown";

const moduleData = {
  overview: {
    title: "Overview",
    steps: [
      { name: "Pre-assessment", content: "Pre-assessment content goes here." },
      { name: "Implementation guide", content: "Implementation guide content goes here." },
      {
        name: "Instructional materials",
        tabs: [
          { label: "Video", content: "Video content goes here." },
          { label: "Script", content: "Script content goes here." },
          { label: "Slides", content: "Slides content goes here." },
        ],
      },
      { name: "Application activity", content: "Application activity content goes here." },
      { name: "Post-assessment", content: "Post-assessment content goes here." },
    ],
  },
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

  // Marks the current step complete, then advances to the next step
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

          {/* Progress Bar */}
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
        <div className="flex-grow bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            {module.steps[activeStep].name}
          </h2>
          {module.steps[activeStep].tabs ? (
            <>
                {/*Tab buttons*/}
                <div className="flex gap-2 border-b border-gray-200 mb-4">
                    {module.steps[activeStep].tabs.map((tab, tabIndex) => (
                        <button
                            key={tabIndex}
                            onClick={() => setActiveTab(tabIndex)}
                            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === tabIndex
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </>
          ) : (
            <p className="text-gray-700">{module.steps[activeStep].content}</p>
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