import axios from "axios";
import { useEffect, useState } from "react";
import API from "../utils/axios";

const EditOrg = () => {
  // Edit Organization Module
  const NewPrompt = ({ text }) => (
    // Set up prompt
    <div>
      <p className="text-2xl font-bold text-gray-800">{text}</p>
    </div>
  );

  const [orgDetails, setOrgDetails] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [promptText, setPromptText] = useState("");

  const getOrg = async () => {
    // This get-org-details returns org_details and prompts, based on the user sending the request
    const response = await API.get("/user_auth/get-org-details/");
    // Set variables to the response data
    setOrgDetails(response.data.org_details);
    setPrompts(response.data.prompts);
  };

  const updateOrg = async () => {
    // Updates org, errors are handled through axios
    const response = await API.post("/user_auth/edit_org/", {
      org_details: orgDetails,
      prompts: prompts,
    });
  };

  useEffect(() => {
    // Run on start up
    getOrg();
  }, []);

  const handleChange = (form) => {
    // Function for updating org details when updating
    const { name, value } = form.target;
    setOrgDetails((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

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
      <div className="pt-6 pb-2 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-wide drop-shadow-lg">
          TeachTrack
        </h1>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl bg-gradient-to-b rounded-2xl shadow-xl p-6 ring-1 ring-gray-300 space-y-6">
          {/* Org Name Display */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-indigo-800">
              {orgDetails.name}
            </h2>
          </div>

          {/* Edit Toggle Button */}
          {!showEdit && (
            <button
              className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={() => setShowEdit(true)}
            >
              Edit Organization
            </button>
          )}

          {/* Edit Mode */}
          {showEdit && (
            <>
              {/* Org Name Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 md:text-xl lg:text-2xl">
                  Organization Name
                </label>
                <input
                  name="org_name"
                  type="text"
                  placeholder={orgDetails.name}
                  className="w-full p-3 text-md md:text-lg lg:text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                  onChange={handleChange}
                />
              </div>

              {/* Prompt Input Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow p-4 space-y-4">
                <h3 className="text-lg md:text-xl font-semibold text-indigo-700 flex items-center gap-2">
                  Add Prompt
                </h3>

                {/* Input + Button: responsive row/column */}
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2.5 text:sm md:text-xl lg:text-2xl border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400"
                    onChange={(e) => setPromptText(e.target.value)}
                    value={promptText}
                    placeholder="Enter a new prompt"
                  />
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white text:sm md:text-lg lg:text-xl rounded-md hover:bg-indigo-700 transition"
                    onClick={() => {
                      if (promptText.trim() !== "") {
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
              </div>

              {/* Save Button */}
              <button
                className="w-full mt-4 p-3 bg-blue-500 text-white text:sm md:text-lg lg:text-xl rounded-lg hover:bg-blue-600 transition"
                onClick={() => {
                  updateOrg();
                  setShowEdit(false);
                }}
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default EditOrg;
