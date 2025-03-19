"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css"; // Import the external stylesheet

export default function AdminPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/entries/");
      setEntries(response.data.entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/delete-entry/${id}/`);
        console.log("Delete Response:", response);
        alert("Entry deleted successfully!");
        fetchEntries(); // Refresh the list after deletion
    } catch (error) {
        console.error("Error deleting entry:", error.response); // Log the error response
        alert(`Failed to delete entry. ${error.response?.data?.message || "Please check the console."}`);
    }
};



  return (
    <div className="container">
      <h1 className="title">StudentTeacher entries submitted</h1>
      <table className="table">
        <thead>
          <tr>
            <th>StudentTeacher Name</th>
            <th>HLP Number</th>
            <th>Lookfor Number</th>
            <th>Date</th>
            <th>Score</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(entries) &&
        entries.map((entry, index) => (
          <tr key={entry.id}>
            <td>StudentTeacherUser{index+1}</td>
            <td>{entry.hlp}</td>
            <td>{entry.lookfor_number}</td>
            <td>{entry.date}</td>
            <td>{entry.score}</td>
            <td>{entry.comments}</td>
            <td>
              <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
