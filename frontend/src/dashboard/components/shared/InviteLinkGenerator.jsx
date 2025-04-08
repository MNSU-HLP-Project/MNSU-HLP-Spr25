// components/shared/InviteLinkGenerator.jsx
import React, { useState, useEffect } from "react";
import { generateInvite, getClasses } from "../../../utils/api";

const InviteLinkGenerator = ({ userRole = "Admin", refreshSignal }) => {
  const [inviteLink, setInviteLink] = useState(null);
  const [classList, setClassList] = useState([]);
  const [class_data, setClassData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Get class list if anything is updated
    getClassList();
  }, [refreshSignal]); // re-run whenever refreshSignal changes
  

  const getClassList = async () => {
    // Get classes, runs on refresh signal changing
    const classes = await getClasses();
    setClassList(classes);
  };

  const handleChange = (form) => {
    // Change class data based on what is entered
    const { name, value } = form.target;
    setClassData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const genInvite = async () => {
    // If name is null don't let it continue
    if (class_data.name === "") {
      setErrors({ class: "Must select a class" });
    } else {
      // Clear errors
      setErrors({});
      try {
        // Get the invite link
        const link = await generateInvite(class_data.name);
        setInviteLink(link);
      } catch (error) {
        console.error("Error generating invite link:", error);
      }
    }
  };

  // Determine invite message based on user role
  const inviteMessage =
    userRole === "Admin"
      ? "Send this to a supervisor:" 
      : userRole === "Superuser" ? "Send this to the admin"
      : "Share this link with students:";

  return (
    <div className="mt-1 w-full p-3 bg-gray-100 rounded-lg shadow-lg">
      {userRole === "Supervisor" && classList && (
        <div className="mt-1">
          <label className="text-gray-700 font-medium">Choose a Class:</label>
          <select
            name="name"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          >
            <option value="">Select a class</option>
            {classList.map((object) => (
              <option key={object.id} value={object.name}>
                {object.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {errors.class && (
        <p className="text-red-500 text-sm mt-1">{errors.class}</p>
      )}

      <button
        className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={genInvite}
      >
        Generate Invite Link
      </button>

      {inviteLink && (
        <div className="mt-3 text-center">
          <p className="text-gray-700 text-sm font-semibold">{inviteMessage}</p>
          <div className="flex justify-center items-center mt-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="border rounded-l-lg px-2 py-1 w-3/4 text-gray-800"
            />
            <button
              className="bg-green-500 text-white px-3 py-1 rounded-r-lg hover:bg-green-600"
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
                alert("Copied to clipboard");
                setInviteLink('')
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteLinkGenerator;
