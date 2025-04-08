// components/shared/OrganizationGenerator.jsx
import React, { useState } from "react";
import { generateOrganization } from "../../../utils/api";

const OrganizationGenerator = () => {
  const [inviteLink, setInviteLink] = useState(null);
  const [org_data, setOrgData] = useState({
    org_name: "",
    admin_email: "",
  });
  const [errors, setErrors] = useState({});

  // Handle form update of the org
  const handleOrgChange = (form) => {
    const { name, value } = form.target;
    setOrgData((prevOrgData) => ({
      ...prevOrgData,
      [name]: value,
    }));
  };

  // Generate the orginization
  const genOrg = async () => {
    try {
      if (org_data.org_name !== "" && org_data.admin_email !== "") {
        // If there is data set link to the correct link
        setErrors({});
        const link = await generateOrganization(org_data);
        setInviteLink(link);
      } else {
        setErrors({ org: "Fill out all fields" });
      }
    } catch (error) {
      console.error("Error generating organization", error);
    }
  };

  return (
    <div className="mt-1 w-full p-4 bg-gray-100 rounded-lg shadow-lg">
      <input
        name="org_name"
        type="text"
        placeholder="Organization Name"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        onChange={handleOrgChange}
      />
      <input
        name="admin_email"
        type="email"
        placeholder="Admin Email"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        onChange={handleOrgChange}
      />
      {errors.org && <p className="text-red-500 text-sm mt-1">{errors.org}</p>}
      <button
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2"
        onClick={genOrg}
      >
        Generate Organization
      </button>
      {inviteLink && (
        <div className="mt-3 text-center">
          <p className="text-gray-700 text-sm font-semibold">
            Send this to the admin:
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
  );
};

export default OrganizationGenerator;
