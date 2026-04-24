import API from "../../../utils/axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../Components/ConfirmDialog";

const DEFAULT_PROMPTS = [
  "How did you implement this HLP in your teaching?",
  "What challenges did you face?",
  "What would you do differently next time?",
];

// Build checklist from saved prompts.
// If no prompts saved yet, all defaults are checked.
// If prompts were saved, a default is checked only if it was in the saved list.
// Custom (non-default) saved prompts are always checked.
const buildChecklist = (savedPrompts) => {
  const defaults = DEFAULT_PROMPTS.map((text) => ({ text, included: true, isDefault: true }));
  const customs = savedPrompts
    .filter((t) => !DEFAULT_PROMPTS.includes(t))
    .map((text) => ({ text, included: true, isDefault: false }));
  return [...defaults, ...customs];
};

const ClassEditor = () => {
  const [className, setClassName] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);

  useEffect(() => {
    const class_name = searchParams.get("class");
    setClassName(class_name);
  }, [searchParams]);

  const [classDetails, setClassDetails] = useState({ prompt_override: false });
  const [checklist, setChecklist] = useState(buildChecklist([]));
  const [promptText, setPromptText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [confirmRemoveIndex, setConfirmRemoveIndex] = useState(null);

  const getClassDetails = async () => {
    const response = await API.get(
      `/user_auth/get-class-details?class_name=${className}`
    );
    setClassDetails(response.data);
    const saved = response.data.prompt_list.map((item) => item.prompt);
    setChecklist(buildChecklist(saved));
  };

  const updateClass = async () => {
    const included = checklist.filter((p) => p.included).map((p) => p.text);
    if (included.length === 0) {
      setValidationError("At least one prompt must be selected.");
      return;
    }
    setValidationError("");
    await API.post("/user_auth/edit-class/", {
      class_name: classDetails.name,
      prompts: included,
      prompt_override: true,
    });
  };

  useEffect(() => {
    getClassDetails();
  }, [className]);

  const addPrompt = () => {
    const text = promptText.trim();
    if (!text) return;
    if (checklist.some((p) => p.text === text)) return;
    setChecklist((prev) => [...prev, { text, included: true, isDefault: false }]);
    setPromptText("");
    setValidationError("");
  };

  const toggleIncluded = (index) => {
    const includedCount = checklist.filter((p) => p.included).length;
    if (checklist[index].included && includedCount === 1) {
      setValidationError("At least one prompt must be selected.");
      return;
    }
    setValidationError("");
    setChecklist((prev) =>
      prev.map((p, i) => (i === index ? { ...p, included: !p.included } : p))
    );
  };

  const removeCustomPrompt = () => {
    const updated = checklist.filter((_, i) => i !== confirmRemoveIndex);
    const stillHasIncluded = updated.some((p) => p.included);
    if (!stillHasIncluded) {
      setValidationError("At least one prompt must be selected.");
      setConfirmRemoveIndex(null);
      return;
    }
    setValidationError("");
    setChecklist(updated);
    setConfirmRemoveIndex(null);
  };

  const includedCount = checklist.filter((p) => p.included).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 flex flex-col">
      <ConfirmDialog
        open={confirmRemoveIndex !== null}
        title="Remove prompt?"
        message={
          confirmRemoveIndex !== null
            ? `"${checklist[confirmRemoveIndex]?.text}" will be permanently removed.`
            : ""
        }
        confirmLabel="Remove"
        onConfirm={removeCustomPrompt}
        onCancel={() => setConfirmRemoveIndex(null)}
      />

      <div className="relative pt-6 pb-2 flex items-center justify-center">
        <div className="absolute left-4 top-6 flex items-center gap-3">
          <button
            onClick={handleBackClick}
            className="text-2xl cursor-pointer text-gray-700 hover:text-gray-900 transition"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => navigate("/mainmenu/")}
            className="text-2xl cursor-pointer text-blue-600 hover:scale-110 transition-transform"
          >
            <FaHome />
          </button>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-wide drop-shadow-lg">
          MyHLPTracker
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-gradient-to-b sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl rounded-2xl shadow-xl p-6 ring-1 ring-gray-300 space-y-6">
          <h2 className="text-2xl font-bold text-center text-indigo-800">
            {classDetails.name}
          </h2>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow p-4 space-y-4">
            <h3 className="text-lg font-semibold text-indigo-700">
              Reflection Prompts for {classDetails.name}
            </h3>
            <p className="text-sm text-gray-600">
              Check the prompts you want students to answer. Default prompts are pre-selected.
              At least one prompt must be included.
            </p>

            {/* Checklist */}
            <div className="space-y-2">
              {checklist.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 bg-white border rounded-md px-4 py-3 ${
                    item.included ? "border-indigo-300" : "border-gray-200 opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`prompt-${index}`}
                    checked={item.included}
                    onChange={() => toggleIncluded(index)}
                    className="mt-1 h-4 w-4 accent-indigo-600 cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor={`prompt-${index}`}
                    className="flex-1 text-sm md:text-base text-gray-800 cursor-pointer"
                  >
                    {item.text}
                    {item.isDefault && (
                      <span className="ml-2 text-xs text-indigo-500 font-medium">(default)</span>
                    )}
                  </label>
                  {!item.isDefault && (
                    <button
                      onClick={() => setConfirmRemoveIndex(index)}
                      className="text-red-400 hover:text-red-600 text-xs shrink-0 mt-0.5"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500">
              {includedCount} of {checklist.length} prompt{checklist.length !== 1 ? "s" : ""} selected
            </p>

            {/* Add custom prompt */}
            <div className="flex flex-col md:flex-row gap-2 pt-2 border-t border-indigo-100">
              <input
                type="text"
                className="flex-1 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
                onChange={(e) => setPromptText(e.target.value)}
                value={promptText}
                placeholder="Add a custom prompt…"
                onKeyDown={(e) => e.key === "Enter" && addPrompt()}
              />
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                onClick={addPrompt}
              >
                Add Prompt
              </button>
            </div>

          </div>

          {validationError && (
            <p className="text-red-600 font-medium text-sm text-center">{validationError}</p>
          )}
          {successMessage && (
            <div className="text-green-600 font-semibold text-center">{successMessage}</div>
          )}

          <button
            className="w-full mt-4 p-3 bg-blue-500 text-white text-sm md:text-lg lg:text-xl rounded-lg hover:bg-blue-600 transition"
            onClick={async () => {
              const included = checklist.filter((p) => p.included);
              if (included.length === 0) {
                setValidationError("At least one prompt must be selected.");
                return;
              }
              await updateClass();
              setSuccessMessage("Changes saved successfully!");
              setTimeout(() => setSuccessMessage(""), 3000);
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassEditor;
