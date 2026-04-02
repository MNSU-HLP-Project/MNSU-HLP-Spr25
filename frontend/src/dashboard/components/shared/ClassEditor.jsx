import API from "../../../utils/axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ClassEditor = () => {
  const [className, setClassName] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);

  useEffect(() => {
    const class_name = searchParams.get("class");
    setClassName(class_name);
  }, [searchParams]);

  const NewPrompt = ({ text }) => (
    // Set up prompt
    <div>
      <p className="text-2xl font-bold text-gray-800">{text}</p>
    </div>
  );

  const [classDetails, setClassDetails] = useState({ prompt_override: false });
  const [showEdit, setShowEdit] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [promptText, setPromptText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getClassDetails = async () => {
    // This get-org-details returns org_details and prompts, based on the user sending the request
    const response = await API.get(
      `/user_auth/get-class-details?class_name=${className}`
    );
    // // Set variables to the response data
    setClassDetails(response.data);
    const onlyPrompts = response.data.prompt_list.map((item) => item.prompt);
    setPrompts(onlyPrompts);
  };

  const updateClass = async () => {
    // Updates org, errors are handled through axios
    const response = await API.post("/user_auth/edit-class/", {
      class_name: classDetails.name,
      prompts: prompts,
      prompt_override: classDetails.prompt_override,
    });
  };

  useEffect(() => {
    // Run on start up
    getClassDetails();
  }, [className]);

  const addComponent = (text) => {
    // Add to prompts when adding a component
    setPrompts([...prompts, text]);
  };

  const removeComponent = (index) => {
    // Remove components when pressing button
    const updatedComponents = [...prompts];
    updatedComponents.splice(index, 1);
    setPrompts(updatedComponents);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 flex flex-col">
      <div className="relative pt-6 pb-2 flex items-center justify-center">
        {/* Back Button */}
        <div className="absolute left-4 top-6">
          <button
            onClick={handleBackClick}
            className="text-2xl cursor-pointer text-gray-700 hover:text-gray-900 transition"
          >
            <FaArrowLeft />
          </button>
        </div>

        {/* Centered Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-wide drop-shadow-lg">
          MyHLPTracker
        </h1>
      </div>

      {/* Centered form box */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">✨ Add Prompt</h3> */}

        <div className="w-full max-w-md bg-gradient-to-b sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl rounded-2xl shadow-xl p-6 ring-1 ring-gray-300 space-y-6">
          <h2 className="text-2xl font-bold text-center text-indigo-800">
            {classDetails.name}
          </h2>

          {/* Removed the edit page that opens up when edit is clicked, repetition seemes unnecessary */}
          {/* {!showEdit && (
              <button
                className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                onClick={() => setShowEdit(true)}
              >
                Edit Class
              </button>
            )} */}

          {/* {showEdit && ( */}
          <>
            {/* Prompt Entry Box */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow p-4 space-y-4">
              <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                Add Prompt to {classDetails.name}
              </h3>

              <div className="flex flex-col md:flex-row gap-2">
                <input
                  name="prompt_text"
                  type="text"
                  className="flex-1 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
                  onChange={(e) => setPromptText(e.target.value)}
                  value={promptText}
                  placeholder="Enter a prompt"
                />
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  onClick={() => {
                    if (promptText.trim()) {
                      addComponent(promptText);
                      setPromptText("");
                    }
                  }}
                >
                  Add a new prompt
                </button>
              </div>

              {/* Prompt List */}
              {prompts.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {prompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-md px-4 py-2 flex justify-between gap-4 items-start"
                    >
                      <p className="text-gray-800 text-sm sm:text-base  md:text-lg lg:text-xl  break-words flex-1">
                        {prompt}
                      </p>
                      <button
                        onClick={() => removeComponent(index)}
                        className="text-red-500 hover:text-red-700 text-sm  md:text-lg lg:text-xl whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkbox */}
              <label className="block text-sm md:text-lg lg:text-xl  text-gray-700 mt-2 space-x-2">
                <input
                  type="checkbox"
                  checked={classDetails.prompt_override}
                  onChange={() =>
                    setClassDetails({
                      ...classDetails,
                      prompt_override: !classDetails.prompt_override,
                    })
                  }
                />
                <span>Check this to include your own prompts</span>
              </label>
            </div>

            {/* save Button */}
            {successMessage && (
              <div className="text-green-600 font-semibold text-center">
                {successMessage}
              </div>
            )}

            <button
              className="w-full mt-4 p-3 bg-blue-500 text-white text:sm md:text-lg lg:text-xl rounded-lg hover:bg-blue-600 transition"
              onClick={async () => {
                await updateClass();
                setShowEdit(false);
                setSuccessMessage("Changes saved successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
              }}
            >
              Save Changes
            </button>
          </>
        </div>
      </div>
    </div>
  );
};

export default ClassEditor;
