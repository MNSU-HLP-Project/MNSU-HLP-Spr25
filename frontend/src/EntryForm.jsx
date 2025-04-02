import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const EntryForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  // Get HLP data from location state
  const { hlpId, hlpTitle, hlpGroup, lookFors } = location.state || {};

  // Initialize form data with HLP information
  const [formData, setFormData] = useState({
    hlp: hlpId || "",
    lookfor_number: "",
    date: new Date().toISOString().split('T')[0], // Set default date to today
    score: "NA", // Default score
    comments: "",
  });

  // State for selected lookFor
  const [selectedLookFor, setSelectedLookFor] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle lookFor selection
  const handleLookForChange = (e) => {
    const lookForId = e.target.value;
    setSelectedLookFor(lookForId);
    setFormData({ ...formData, lookfor_number: lookForId });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for submission
    const submissionData = {
      ...formData,
      // Add token for authentication if needed
      token: token
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/create-entry/", submissionData);
      console.log("Entry created:", response.data);
      alert("Entry submitted successfully!");

      // Reset form or navigate back
      navigate("/hlpcategories/");
    } catch (error) {
      console.error("Error submitting entry:", error);
      alert("Failed to submit entry.");
    }
  };

  // Navigate back to HLP selection
  const handleBackClick = () => navigate("/hlpselection/", { state: { name: hlpGroup } });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <FaArrowLeft
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleBackClick}
        />
        <h1 className="text-3xl md:text-4xl text-center font-bold text-gray-800 border-b-2 border-gray-300 p-2">
          Submit Entry
        </h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </div>

      {/* HLP Information */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6 shadow-md">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">HLP {hlpId}: {hlpTitle}</h2>
        <p className="text-gray-700">Category: {hlpGroup}</p>
      </div>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        {/* Look-for Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select a Look-for:</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={handleLookForChange}
            value={selectedLookFor}
            required
          >
            <option value="">Select a Look-for</option>
            {lookFors && Object.entries(lookFors).map(([id, text]) => (
              <option key={id} value={id}>
                {id}: {text}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Look-for Display */}
        {selectedLookFor && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-gray-800">{lookFors[selectedLookFor]}</p>
          </div>
        )}

        {/* Date Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Score Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Score:</label>
          <select
            name="score"
            value={formData.score}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="NA">Not Applicable</option>
            <option value="1">1 - Developing</option>
            <option value="2">2 - Proficient</option>
          </select>
        </div>

        {/* Comments */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Comments:</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            placeholder="Enter your reflections on this practice..."
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Submit Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;
