// components/shared/ClassGenerator.jsx
import React, { useState } from "react";
import { generateClass } from "../../../utils/api";

const ClassGenerator = ({ onClassCreated }) => {
  const [class_data, setClassData] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (form) => {
    const { name, value } = form.target;
    setClassData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const genClass = async () => {
    try {
      if (class_data["class_name"]) {
        setErrors({});
        setServerError("");

        await generateClass(class_data);
        onClassCreated?.();
        setSuccessMessage(
          "Class created. You can now invite students to that class."
        );
        setClassData({}); // Clear form after successful submission
      } else {
        setErrors({ class_name: "Need a class name" });
      }
    } catch (error) {
      if (error.response?.data?.error === "Class already exists") {
        setServerError("A class with that name already exists.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="mt-1 w-full p-4 bg-gray-100 rounded-lg shadow-lg">
      <input
        name="class_name"
        type="text"
        placeholder="Class Name"
        value={class_data.class_name || ""}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
      />
      {errors.class_name && (
        <p className="text-red-500 text-sm mt-1">{errors.class_name}</p>
      )}
      <button
        className="w-full md:w-3/6 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2 mx-auto"
        onClick={genClass}
      >
        Generate Class
      </button>
      {serverError && (
        <p className="text-red-500 text-sm mt-2">{serverError}</p>
      )}
      {successMessage && (
        <p className="text-green-600 text-md mt-2">{successMessage}</p>
      )}
    </div>
  );
};

export default ClassGenerator;
