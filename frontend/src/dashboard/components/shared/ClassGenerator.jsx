// components/shared/ClassGenerator.jsx
import React, { useEffect, useState } from "react";
import { generateClass, getClasses, removeClass } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ClassGenerator = ({ onClassCreated }) => {
  const [class_data, setClassData] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentClasses, setCurrentClasses] = useState([]);
  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);
  const handleLogout = () => navigate("/");

  const getCurrClasses = async () => {
    const classes = await getClasses();
    const class_list = [];
    for (const c_class of classes) {
      class_list.push(c_class.name);
    }
    setCurrentClasses(class_list);
  };

  useEffect(() => {
    getCurrClasses();
  }, []);

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
        setCurrentClasses([...currentClasses, class_data["class_name"]]);
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

  const NewClass = ({ text }) => (
    // Set up class
    <div>
      <p className="text-2xl font-bold text-gray-800">{text}</p>
    </div>
  );

  const removeClassFromList = (index) => {
    // Remove components when pressing button
    const updatedComponents = [...currentClasses];
    const deleted = updatedComponents.splice(index, 1);
    const response = removeClass(deleted[0]);
    console.log(response);
    setCurrentClasses(updatedComponents);
  };

  return (
    // <div className="min-h-[100dvh] bg-gradient-to-b from-blue-200 via-white to-blue-100 p-6">
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-blue-200 via-white to-blue-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBackClick}
          className="text-2xl cursor-pointer mr-4"
        >
          <FaArrowLeft className="mr-2" />
        </button>
        <h1 className="text-3xl font-bold text-center mt-4  text-gray-800">
          My Classes
        </h1>
      </div>

      <div className="mt-1 w-full mx-auto bg-gradient-to-b p-4 bg-gray-100 rounded-xl shadow-lg">
        {currentClasses &&
          currentClasses.map((c_class, index) => (
            <div
              key={index}
              // className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mt-2"
              className="flex items-center justify-between bg-gray-100 p-2 rounded-xl border border-gray-200 mt-2"
            >
              <NewClass text={c_class} />
              <button
                onClick={() => navigate(`/edit-class?class=${c_class}`)}
                className="ml-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-red-600"
              >
                Edit
              </button>
              <button
                onClick={() => removeClassFromList(index)}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
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
          className=" block w-1/2  md:w-1/2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2 mx-auto"
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
      <div className="p-2 mt-auto flex justify-center">
        <button
          className="w-32 md:w-36 p-3 md:p-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-300 font-semibold text-lg md:text-xl"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ClassGenerator;
