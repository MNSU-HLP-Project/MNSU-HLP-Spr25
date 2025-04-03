import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {generateInvite, generateClass, getClasses, generateOrganization} from "../utils/api"

const MainMenu = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("role")

  const [showInviteSection, setShowInviteSection] = useState(false);
  const [inviteLink, setInviteLink] = useState(null);
  const [showClassSection, setShowClassSection] = useState(false)
  const [showOrgSection, setShowOrgSection] = useState(false)
  const [class_data, setClassData] = useState({})
  const [errors, setErrors] = useState({});
  const [classList, setClassList] = useState([]);
  const [org_data, setOrgData] = useState({
    org_name: '',
    admin_email: ''
  })



  const handleChange = (form) => {
    const { name, value } = form.target;
    setClassData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleOrgChange = (form) => {
    const { name, value } = form.target;
    setOrgData((prevOrgData) => ({
      ...prevOrgData,
      [name]: value
    }))
  }

  useEffect(() => {getClass()},[class_data])

  const getClass = async () => {
    const classes = await getClasses();
    setClassList(classes)
    console.log(classes)
  }

  const genInvite = async () => {
    if (class_data.name == '') {
      setErrors({class: 'Must select a class'})
    }
   else {
    setErrors({})
    try {
      const link = await generateInvite(class_data.name); // Wait for the promise to resolve
      setInviteLink(link);
    } catch (error) {
      console.error("Error generating invite link:", error);
    }
  }
  };

  const genClass = async () => {
    try {
      if (class_data['class_name']) {
        setErrors({})
        await generateClass(class_data);
        setClassData({})
      } else {
        setErrors({ class_name: 'Need a class name' })
      }
    } catch (error) {
      console.error("Error generating class")
    }
  }
  
  const genOrg = async () => {
    try {
      if (org_data['org_name'] != '' && org_data['admin_email'] != '') {
        const link = await generateOrganization(org_data)
        setInviteLink(link);
      }
      else {
        setErrors({ org: 'Fill out all fields'})
      }
    } catch (error) {
      console.error("Error generating orginization")
    }
  }

  // Determine invite message based on user role
  const inviteMessage =
    role === "Admin"
      ? "Send this to a supervisor:"
      : "Share this link with students:";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-100 p-6 pb-16 items-center relative">

      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mt-12 md:mt-20 tracking-wide drop-shadow-lg">
        TeachTrack
      </h1>

      <div className="flex flex-col items-center mt-8 md:mt-16 space-y-6 w-full max-w-xs md:max-w-md">
        {role === "Student Teacher" && (
          <>
            <button
              className="w-full p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => navigate("/hlpcategories/")}
            >
              📚 HLP Categories
            </button>
            <button
              className="w-full p-4 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => alert("Resource button clicked")}
            >
              Resources
            </button>
          </>
        )}
        {["Admin"].includes(role) && (
          <>
            <button
              className="w-3/4 p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => alert("View Reflection button clicked")}
            >
              View Reflections
            </button>

            {/* Invite Link Section */}
            <button
              className="w-3/4 p-3 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => setShowInviteSection(!showInviteSection)}
            >
              🔗 Invite Link
            </button>

            {showInviteSection && (
              <div className="mt-1 w-3/4 p-3 bg-gray-100 rounded-lg shadow-lg">
                <button
                  className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={genInvite}
                >
                  Generate Invite Link
                </button>

                {inviteLink && (
                  <div className="mt-3 text-center">
                    <p className="text-gray-700 text-sm font-semibold">
                      {inviteMessage}
                    </p>
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
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            
            )}
          </>
        )}
        {["Superuser"].includes(role) && (
          <>
            <button
              className="w-3/4 p-3 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => setShowOrgSection(!showOrgSection)}
            >
              Create Organization
            </button>

            
            {showOrgSection && (
              <div className="mt-1 w-3/4 p-4 bg-gray-100 rounded-lg shadow-lg">
                <input
                  name="org_name"
                  type="org_name"
                  placeholder="Organization Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={handleOrgChange}
                />
                <input
                  name="admin_email"
                  type="admin_email"
                  placeholder="Admin Email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={handleOrgChange}
                />
                {errors.org && (
                  <p className="text-red-500 text-sm mt-1">{errors.org}</p>
                )}
                <button
                  className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={genOrg}
                >
                  Generate Organization
                </button>
                {inviteLink && (
                  <div className="mt-3 text-center">
                    <p className="text-gray-700 text-sm font-semibold">
                      {inviteMessage}
                    </p>
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
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {["Supervisor"].includes(role) && (
          <>
            <button
              className="w-3/4 p-4 md:p-5 border-2 border-blue-700 text-white bg-blue-700 rounded-lg hover:bg-blue-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => alert("View Reflection button clicked")}
            >
              View Reflections
            </button>

            {/* Invite Link Section */}
            <button
              className="w-3/4 p-3 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => setShowInviteSection(!showInviteSection)}
            >
              🔗 Invite Link
            </button>

            {showInviteSection && (
              <div className="mt-1 w-3/4 p-3 bg-gray-100 rounded-lg shadow-lg">
                {classList && (
                  <div className="mt-1">
                    <label className="text-gray-700 font-medium">Choose a Class:</label>
                    <select
                      name="name"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      onChange={handleChange}
                    >
                      <option value="">Select a class</option> {/* Default empty option */}
                      {classList.map((object) => (
                        <option key={object.id} value={object.name}>
                          {object.name}
                        </option>
                      ))}
                    </select>
                  </div>)}
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
                    <p className="text-gray-700 text-sm font-semibold">
                      {inviteMessage}
                    </p>
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
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              className="w-3/4 p-4 md:p-5 border-2 border-green-700 text-white bg-green-700 rounded-lg hover:bg-green-800 flex items-center justify-center shadow-lg transition duration-300 transform hover:scale-105 font-semibold text-xl md:text-2xl"
              onClick={() => setShowClassSection(!showClassSection)}
            >
              Create Class
            </button>
            {showClassSection && (
              <div className="mt-1 w-3/4 p-4 bg-gray-100 rounded-lg shadow-lg">
                <input
                  name="class_name"
                  type="class_name"
                  placeholder="Class Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                />
                {errors.class_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.class_name}</p>
                )}
                <button
                  className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={genClass}
                >
                  Generate Class
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Logout Button */}
  <div className="mt-8">  {/* Increase spacing */}
  <button 
    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-32 md:w-36 p-3 md:p-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 flex items-center justify-center transition duration-300 font-semibold text-lg md:text-xl z-50"
    onClick={() => navigate("/")}>
    Log Out
  </button>
</div>

    </div>
  );
};

export default MainMenu;
