import axios from "axios";
import { useEffect, useState } from "react";


const EditOrg = () => {
  const NewPrompt = ({ text }) => (
    <div>
      <p className="text-2xl font-bold text-gray-800">{text}</p>
    </div>
  );
    const [orgDetails, setOrgDetails] = useState({})
    const [showEdit, setShowEdit] = useState(false)
    const [prompts, setPrompts] = useState([]);
    const [promptText, setPromptText] = useState('')

    const getOrg = async () => {
        const token = localStorage.getItem('jwtToken')
        const response = await axios.post('http://localhost:8000/user_auth/get-org-details/',
        {
            token: token
        })
        console.log(response.data)
        setOrgDetails(response.data.org_details)

        setPrompts(response.data.prompts)
    };

    const updateOrg = async () => {
      const token = localStorage.getItem('jwtToken')
      const response = await axios.post('http://localhost:8000/user_auth/edit_org/',
        {
          token:token,
          org_details: orgDetails,
          prompts: prompts
        }
      )
      console.log(response)

    }

    useEffect(() => {
        getOrg()
        
    },[])

  const handleChange = (form) => {
      const { name, value } = form.target;
      setOrgDetails((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };

  const addComponent = (text) => {
    setPrompts([...prompts, text]);
  };

  const removeComponent = (index) => {
    const updatedComponents = [...prompts];
    updatedComponents.splice(index, 1);
    setPrompts(updatedComponents);
  };


    

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {orgDetails.name}
      </h2>
     {!showEdit && (<button
        className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => setShowEdit(!showEdit)}
      >
        Edit Org
      </button>)
}
        {showEdit && (<>
          <div className="mt-4 flex gap-2">
            <input
              name="org_name"
              type="text"
              placeholder={orgDetails.name}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
            
        </div>
        <div>
          <input
              name="org_name"
              type="text"
              placeholder=''
              className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPromptText(e.target.value)}
              value={promptText}
            />
          <button 
            className="w-1/2 mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
           onClick={()=> {
            addComponent(promptText);
            setPromptText('')
          }}>Add Prompt</button>
          {prompts.map((prompt, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-200 p-2 rounded-lg mt-2">
              <NewPrompt text={prompt} />
              <button 
                onClick={() => removeComponent(index)}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
        className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => {updateOrg();
          setShowEdit(!showEdit)
        }}
      >
        Submit
      </button>
        </>)}
    </div>
    </div>
  );
  }
  export default EditOrg