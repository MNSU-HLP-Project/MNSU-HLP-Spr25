import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { FaArrowLeft, FaFilter, FaEye, FaCheck, FaRedo } from "react-icons/fa";

import API from "../utils/axios";

import HLP_LookFors from "../assets/HLP_Lookfors";


import { useParams } from "react-router-dom";

const SupervisorReview = () => {

  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const { classId, studentId } = useParams();



  uuseEffect(() => {
    if (classId && studentId) {
      fetchEntries();
    }
  }, [classId, studentId]);
  
  
  useEffect(() => {
    if (students.length > 0) {
      fetchEntries();
    }
  }, [students]);
  

  
  const fetchStudents = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await API.get(`/user_auth/my-students`);
      console.log("Students fetched:", response.data);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students for this class.");
    } finally {
      setLoading(false);
    }
  };

  
  const fetchEntries = async () => {
    setLoading(true);
    setError("");
  
    try {
      const allEntries = [];
  
      for (const student of students) {
        const res = await API.get(`/entries/entries/by-class/${classId}/${student.id}/`);
        if (Array.isArray(res.data)) {
          allEntries.push(...res.data);
        }
      }
  
      const sortedEntries = allEntries.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
  
      setEntries(sortedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      setError("Failed to fetch entries for this class.");
    } finally {
      setLoading(false);
    }
  };
  






}

export default SupervisorReview;

