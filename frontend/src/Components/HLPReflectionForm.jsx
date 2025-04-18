import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import API from "../utils/axios";
import HLP_LookFors from "../assets/HLP_Lookfors";
import { getPrompts } from "../utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HLPReflectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editMode = location.state?.mode === "edit";
  const existingEntry = location.state?.existingEntry || null;

  const hlpNumber = location.state?.hlp?.replace("HLP ", "") || "";
  const hlpData = hlpNumber ? HLP_LookFors[hlpNumber] : null;
  const groupName = hlpData?.group;
  const bgColorClass = HLP_LookFors.groups[groupName]?.color || "bg-gray-400";

  const [formData, setFormData] = useState({
    hlp: hlpNumber,
    lookfor_number: 0,
    week_number: 1,
    prompt_responses: [],
    score: 0,
    date: new Date(),
  });

  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const defaultPrompts = [
    { id: 1, prompt: "How did you implement this HLP in your teaching?" },
    { id: 2, prompt: "What challenges did you face?" },
    { id: 3, prompt: "What would you do differently next time?" },
  ];

  useEffect(() => {
    const loadData = () => {
      const finalPrompts = defaultPrompts;
      setPrompts(finalPrompts);

      const promptResponses = finalPrompts.map((prompt) => {
        const existing = existingEntry?.prompt_responses?.find(
          (res) => res.prompt === prompt.id
        );
        return {
          prompt: prompt.id,
          reflection: existing?.reflection || "",
          indicator: existing?.indicator || "na",
        };
      });

      if (editMode && existingEntry) {
        setFormData({
          hlp: existingEntry.hlp,
          lookfor_number: existingEntry.lookfor_number,
          week_number: existingEntry.week_number || 1,
          score: existingEntry.score || 0,
          date: new Date(existingEntry.date),
          prompt_responses: promptResponses,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          prompt_responses: promptResponses,
        }));
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handlePromptResponseChange = (promptId, field, value) => {
    setFormData((prev) => {
      const updatedResponses = [...prev.prompt_responses];
      const index = updatedResponses.findIndex((r) => r.prompt === promptId);

      if (index !== -1) {
        updatedResponses[index] = {
          ...updatedResponses[index],
          [field]: value,
        };
      } else {
        // If for some reason prompt wasn't initialized
        updatedResponses.push({
          prompt: promptId,
          reflection: field === "reflection" ? value : "",
          indicator: field === "indicator" ? value : "na",
        });
      }

      return {
        ...prev,
        prompt_responses: updatedResponses,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const dataToSubmit = {
      ...formData,
      lookfor_number: parseInt(formData.lookfor_number, 10) || 0,
      prompt_responses: formData.prompt_responses.map((p) => ({
        prompt: p.prompt,
        reflection: p.reflection || "",
      })),
      date: new Date(formData.date).toISOString().split("T")[0],
    };

    try {
      let response;
      if (editMode && existingEntry?.id) {
        response = await API.put(`/entries/${existingEntry.id}/`, dataToSubmit);
      } else {
        response = await API.post("/entries/create-entry/", dataToSubmit);
      }

      console.log("Submission success:", response.data);
      setSuccess(true);
      setSubmitted(true);

      setTimeout(() => {
        localStorage.setItem("role", "Student Teacher");
        navigate("/reflections/");
      }, 5000);
    } catch (error) {
      console.error("Error:", error);
      setError(
        "Submission Error: " +
          (error.response?.data?.error || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!hlpData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
            No HLP Selected
          </h2>
          <p className="text-gray-700 mb-6 text-center">
            Please go back and select a High-Leverage Practice to reflect on.
          </p>
          <button
            onClick={() => navigate("/hlpcategories/")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-md"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 md:p-8">
      <div
        className={`p-5 rounded-xl shadow-lg mb-6 flex items-center text-white ${bgColorClass}`}
      >
        <FaArrowLeft
          className="text-2xl cursor-pointer mr-4 hover:text-blue-200"
          onClick={() => navigate(-1)}
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            HLP {hlpNumber}: {hlpData.title}
          </h1>
          <p className="text-blue-100 mt-1">
            {editMode ? "Edit your reflection" : "Complete your reflection"}
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-500 text-green-800 p-4 rounded mb-6">
          Reflection {editMode ? "updated" : "submitted"} successfully!
          Redirecting...
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-6 border"
      >
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Look-for
          </label>
          <select
            value={formData.lookfor_number}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                lookfor_number: parseInt(e.target.value, 10),
              }))
            }
            className="w-full p-3 border rounded"
          >
            <option value={0}>Select a Look-for</option>
            {hlpData &&
              Object.entries(hlpData.lookFors).map(([num, text]) => (
                <option key={num} value={num}>
                  #{num}:{" "}
                  {text.length > 60 ? text.substring(0, 60) + "..." : text}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Score Yourself
          </label>
          <select
            value={formData.score}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, score: e.target.value }))
            }
            className="w-full p-3 border rounded"
          >
            <option value={-1}>Choose a Score</option>
            {[0, 1, 2, 3].map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Date of Entry
          </label>
          <DatePicker
            selected={formData.date}
            onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Prompts */}
        <div className="space-y-6">
          {prompts.map((prompt) => {
            const responseIndex = formData.prompt_responses.findIndex(
              (r) => r.prompt === prompt.id
            );
            const response = formData.prompt_responses[responseIndex];

            return (
              <div key={prompt.id} className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-purple-700">
                  {prompt.prompt}
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-purple-300 rounded"
                  value={response?.reflection || ""}
                  onChange={(e) =>
                    handlePromptResponseChange(
                      prompt.id,
                      "reflection",
                      e.target.value
                    )
                  }
                  placeholder="Add your reflection..."
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || submitted}
            className={`px-6 py-3 rounded-lg font-semibold shadow-md transition ${
              submitted
                ? "bg-green-600 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {submitted
              ? "Submitted!"
              : loading
              ? "Submitting..."
              : editMode
              ? "Update Reflection"
              : "Submit Reflection"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HLPReflectionForm;
