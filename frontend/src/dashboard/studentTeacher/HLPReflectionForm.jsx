import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../../utils/axios";
import HLP_LookFors from "../../assets/HLP_Lookfors";
import { getPrompts } from "../../utils/api";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateToMMDDYYYY } from "../../utils/utilFunc";

// Create default prompts outside component
const defaultPrompts = [
  { id: 1, prompt: "How did you implement this HLP in your teaching?" },
  { id: 2, prompt: "What challenges did you face?" },
  { id: 3, prompt: "What would you do differently next time?" },
];

const observationPromptOverrides = [
  "What did you observe about this HLP in teaching?",
  "What challenges did you observe?",
  "What would you suggest doing differently next time?",
];

const HLPReflectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prompts, setPrompts] = useState(defaultPrompts);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Get the HLP number from location state
  const hlpNumber = location.state?.hlp?.replace("HLP ", "") || "";
  const edit = location.state.edit
  const submitMsg = edit ? "Edit Reflection" : "Submit Reflection"
  const hlpData = hlpNumber ? HLP_LookFors[hlpNumber] : null;

  //Getting color form the group

  const groupName = hlpData?.group;
  const bgColorClass = HLP_LookFors.groups[groupName]?.color || "bg-gray-400";

  // Form state
  const [formData, setFormData] = useState({
    hlp: hlpNumber,
    lookfor_number: 0,
    week_number: 1,
    prompt_responses: defaultPrompts.map((prompt) => ({
      prompt: prompt.id,
      reflection: "",
    })),
    score:-1,
    date: Date(),
    entry_type: 'practice',
  });

  // Initialize with default prompts
  useEffect(() => {
    if (edit){
      setPrompts(location.state.detail.prompt_responses)
      setFormData({
        ...location.state.detail,
        date: new Date(location.state.detail.date+"T00:00:00"),
      })
    }
  }, []);

  // Fetch prompts from API
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await getPrompts();

        // Clear any previous error message
        setError("");

        // Only update prompts if we got a valid response with data
        if (response.data && response.data.length > 0) {
          setPrompts(response.data);
          let initialPromptResponses
          // Initialize prompt responses with API data
           initialPromptResponses = response.data.map((prompt) => ({
            prompt: prompt.id,
            reflection: "",
          }))

          setFormData((prev) => ({
            ...prev,
            prompt_responses: initialPromptResponses,
          }));
        } else {
          // If no prompts from API, use default prompts
          console.warn("No prompts received, using default prompts");
          setPrompts(defaultPrompts);
          const initialPromptResponses = defaultPrompts.map((prompt) => ({
            prompt: prompt.id,
            reflection: "",
          }));
          setFormData((prev) => ({
            ...prev,
            prompt_responses: initialPromptResponses,
          }));
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
        // Use default prompts if API call fails
        console.warn("Failed to fetch prompts from API, using default prompts");
        setPrompts(defaultPrompts);
        const initialPromptResponses = defaultPrompts.map((prompt) => ({
          prompt: prompt.id,
          reflection: "",
        }));
        setFormData((prev) => ({
          ...prev,
          prompt_responses: initialPromptResponses,
        }));
        setError("Could not load custom prompts. Using default prompts.");
      }
    };

    if (!edit){
      fetchPrompts();
    }
  }, []); // Empty dependency array to run only once on mount

  // Handle form input changes
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // Evidence for Mastery section removed

  // Handle prompt response changes
  const handlePromptResponseChange = (promptIndex, field, value) => {
    const updatedResponses = [...formData.prompt_responses];
    updatedResponses[promptIndex] = {
      ...updatedResponses[promptIndex],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      prompt_responses: updatedResponses,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Evidence for Mastery section removed

      // if (
      //   formData.prompt_responses.some(
      //     (item) => !item.reflection || !item.reflection.trim()
      //   )
      // ) {
      //   setError("All reflection responses are required.");
      //   setLoading(false);
      //   return;
      // }

      // Make sure lookfor_number is a number
      const dataToSubmit = {
        ...formData,
        id: formData.id,
        score: formData.score,
        entry_type: formData.entry_type || 'practice',
        lookfor_number: formData.entry_type === 'observation' ? 0 : (parseInt(formData.lookfor_number, 10) || 0),
        // Make sure prompt_responses have all required fields
        prompt_responses: formData.prompt_responses.map((pr) => ({
          id: pr.id,
          prompt: pr.prompt,
          reflection: pr.reflection || "",
        })),
        // Evidence for Mastery section removed
        // Add date if not present
        date: formatDateToMMDDYYYY(formData.date) || new Date().toISOString().split("T")[0],
      };

      try {
        try {
          let response
          if (!edit){
            response = await API.post(
              "/entries/create-entry/",
              dataToSubmit
            );
          } else {
            response = await API.post(
              "/entries/edit-entry/",
              dataToSubmit
            )
          }
          setSuccess(true);
          setSubmitted(true);

          // Ensure role is still set to Student Teacher
          const role = localStorage.getItem("role");
          if (role !== "Student Teacher") {
            console.error(
              `Unexpected role: ${role}, expected Student Teacher. Fixing...`
            );
            localStorage.setItem("role", "Student Teacher");
          }

          // Redirect after successful submission with a longer delay to avoid flickering
          setTimeout(() => {
            // Double-check role before navigation
            const finalRole = localStorage.getItem("role");
            if (finalRole !== "Student Teacher") {
              console.error(
                "Role changed unexpectedly, resetting to Student Teacher"
              );
              localStorage.setItem("role", "Student Teacher");
            }
            navigate("/reflections/");
          }, 2000);
        } catch (apiError) {
          console.error("API error in submission:", apiError);

          // Uncomment this line to throw the error instead of simulating success
          // throw apiError;
        }
      } catch (submitError) {
        console.error("Error in submission:", submitError);
        throw submitError; // Re-throw to be caught by the outer catch block
      }
    } catch (error) {
      console.error("Error submitting reflection:", error);

      // Extract error message from response if available
      let errorMessage = "Failed to submit reflection. Please try again.";
      if (error.response && error.response.data) {
        console.log("Error response data:", error.response.data);
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.details) {
          // Format validation errors nicely
          if (typeof error.response.data.details === "object") {
            const details = error.response.data.details;
            errorMessage = Object.keys(details)
              .map((key) => `${key}: ${details[key]}`)
              .join(", ");
          } else {
            errorMessage = JSON.stringify(error.response.data.details);
          }
        }
      }

      // Set a submission-specific error message
      setError("Submission Error: " + errorMessage);

      // Log the form data for debugging
      console.log("Form data that caused the error:", formData);
    } finally {
      setLoading(false);
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1, {
      state: { name: hlpData?.group || "" },
    });
  };

  if (!hlpData) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-red-200">
          <div className="flex items-center justify-center mb-6 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
            No HLP Selected
          </h2>
          <p className="text-gray-700 mb-6 text-center">
            Please go back and select a High-Leverage Practice to reflect on.
          </p>
          <button
            onClick={() => navigate("/hlpcategories/")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-md flex items-center justify-center font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-gray-100 to-gray-200 p-4 md:p-8">
      {/* Header */}
      <div
        className={`p-5 rounded-xl shadow-lg mb-6 flex items-center text-white ${bgColorClass}`}
      >
        <FaArrowLeft
          className="text-2xl cursor-pointer mr-4 hover:text-blue-200 transition-colors"
          onClick={handleBackClick}
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            HLP {hlpNumber}: {hlpData.title}
          </h1>
          <p className="text-blue-100 mt-1">
            Complete your reflection for this High-Leverage Practice
          </p>
        </div>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-6 rounded-lg mb-6 flex items-center shadow-lg animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mr-4 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-bold text-lg">Success!</p>
            <p className="text-green-800">
              Your reflection has been {edit ? 'edited': 'submitted'} successfully!
            </p>
            <p className="text-sm mt-2">
              You will be redirected to your reflections page in a moment...
            </p>
          </div>
        </div>
      )}

      {/* Error message with debug info */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
            <p className="text-xs mt-1 text-gray-600">
              Debug: Prompts loaded: {prompts.length}
            </p>
          </div>
          <button
            onClick={() => setError("")}
            className="ml-auto bg-red-200 hover:bg-red-300 text-red-800 px-2 py-1 rounded text-sm"
          >
            Clear
          </button>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200"
      >
        {/* Entry Type Toggle */}
        <div className="mb-6 bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">How are you engaging with this HLP?</h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, entry_type: 'practice', }))}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold border-2 transition-all ${
                formData.entry_type === 'practice'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
              }`}
            >
              I Practiced This HLP
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, entry_type: 'observation', lookfor_number: 0, score: -1, }))}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold border-2 transition-all ${
                formData.entry_type === 'observation'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
              }`}
            >
              I Observed This HLP
            </button>
          </div>
          {formData.entry_type === 'observation' && (
            <p className="mt-3 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-4 py-2">
              Observation mode: look-for and self-score are not required. Use the reflection prompts below to describe what you observed.
            </p>
          )}
        </div>

        {/* Look-fors Section */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Select Look-fors to Address
          </h2>

          {formData.entry_type === 'practice' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Choose Look-for:
            </label>
            <select
              className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lookfor_number: parseInt(e.target.value, 10),
                }))
              }
              value={formData.lookfor_number || 0}
            >
              <option value={0}>Select a Look-for</option>
              {hlpData &&
                Object.entries(hlpData.lookFors).map(
                  ([lookforNumber, lookforText]) => (
                    <option key={lookforNumber} value={lookforNumber}>
                      #{lookforNumber}:{" "}
                      {lookforText.length > 80
                        ? lookforText.substring(0, 80) + "..."
                        : lookforText}
                    </option>
                  )
                )}
            </select>
            <label className="block text-gray-700 mb-2 font-medium">
              Score Yourself:
            </label>
            <select
              className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  score: e.target.value,
                });
              }}
              value={formData.score}
            >
              <option value={-1}>Choose a Score</option>
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          )}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Date of Entry:
            </label>
            <div className="w-full p-3 border border-indigo-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <DatePicker
                selected={formData.date}

                onChange={(date) => {
                  setFormData({
                    ...formData,
                    date: date,
                  });
                }}
                className="w-full outline-none"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select a date"
              />
            </div>
          </div>
          {formData.entry_type === 'practice' && formData.lookfor_number > 0 &&
            hlpData?.lookFors[formData.lookfor_number] && (
              <div className="p-4 bg-white rounded-lg border border-indigo-200 shadow-sm">
                <h3 className="font-semibold mb-2 text-indigo-700">
                  Selected Look-for:
                </h3>
                <p className="text-gray-700">
                  {hlpData.lookFors[formData.lookfor_number]}
                </p>
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-sm text-indigo-800 italic">
                    Reflect on how you've implemented this look-for in your
                    teaching practice.
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Prompts Section */}
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-purple-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Reflection Prompts {edit ? "(Edit Your Previous Responses)" : ""}
          </h2>
          {edit && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                You are editing your previous reflection. Your previous responses are shown below.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {prompts.length > 0 ? (
              prompts.map((prompt, index) => (
                <div
                  key={prompt.id || index}
                  className="bg-white p-5 rounded-lg border border-purple-200 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <h3 className="font-semibold mb-3 text-purple-700 border-b border-purple-100 pb-2">
                    {formData.entry_type === 'observation'
                      ? (observationPromptOverrides[index] || prompt.prompt || prompt.text || "Reflection Prompt")
                      : (prompt.prompt || prompt.text || "Reflection Prompt")}
                  </h3>

                  {/* Display previous response if editing */}
                  {edit && prompt.reflection && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-1">Your Previous Response:</p>
                      <p className="text-gray-700">{prompt.reflection}</p>
                    </div>
                  )}

                  {/* Optional reflection with better styling */}
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      {edit ? "Edit Your Comments:" : "Comments:"}
                    </label>
                    <textarea
                      className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      rows="5"
                      value={formData.prompt_responses[index]?.reflection || ""}
                      onChange={(e) =>
                        handlePromptResponseChange(
                          index,
                          "reflection",
                          e.target.value
                        )
                      }
                      placeholder={edit ? "Edit your previous response here..." : "Add your reflection here..."}
                    ></textarea>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">
                  No reflection prompts available. Please refresh the page or contact your supervisor.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Evidence for Mastery Section removed */}

        {/* Weekly Goals Section */}

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className={`py-3 px-8 rounded-lg transition-all transform shadow-lg flex items-center font-bold text-lg ${
              submitted
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 hover:scale-105"
            }`}
            disabled={loading || submitted}
          >
            {loading && !submitted ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : submitted ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-green-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Submitted Successfully!
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {submitMsg}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HLPReflectionForm;