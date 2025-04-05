import { useState } from "react";
import axios from "axios";
import API from "./utils/axios";

const EntryForm = () => {
  const [formData, setFormData] = useState({
    hlp_number: "",
    date: "",
    score: "",
    comments: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/create-entry/", formData);
      console.log("Entry created:", response.data);
      alert("Entry submitted successfully!");
      setFormData({ hlp_number: "", date: "", score: "", comments: "" });
    } catch (error) {
      console.error("Error submitting entry:", error);
      alert("Failed to submit entry.");
    }
  };

  return (
    <div>
      <h2>Submit an Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>HLP Number:</label>
          <input type="text" name="hlp_number" value={formData.hlp_number} onChange={handleChange} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Score:</label>
          <input type="number" name="score" value={formData.score} onChange={handleChange} required />
        </div>
        <div>
          <label>Comments:</label>
          <textarea name="comments" value={formData.comments} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EntryForm;
