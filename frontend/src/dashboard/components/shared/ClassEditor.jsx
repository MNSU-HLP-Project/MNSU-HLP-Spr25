import API from "../../../utils/axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ClassEditor = () => {
    const [className, setClassName] = useState('')
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const class_name = searchParams.get('class');
        setClassName(class_name)
    }, [searchParams]);

    const NewPrompt = ({ text }) => (
        // Set up prompt
        <div>
          <p className="text-2xl font-bold text-gray-800">{text}</p>
        </div>
      );
        
    const [classDetails, setClassDetails] = useState({prompt_override: false})
    const [showEdit, setShowEdit] = useState(false)
    const [prompts, setPrompts] = useState([]);
    const [promptText, setPromptText] = useState('')

    const getClassDetails = async () => {
        // This get-org-details returns org_details and prompts, based on the user sending the request
        const response = await API.get(`/user_auth/get-class-details?class_name=${className}`)
        console.log(response)
        // // Set variables to the response data
        setClassDetails(response.data)
        const onlyPrompts = response.data.prompt_list.map(item => item.prompt);
        console.log(onlyPrompts)
        setPrompts(onlyPrompts);
    };
    
    const updateClass = async () => {
        // Updates org, errors are handled through axios
        console.log(classDetails)
        console.log(prompts)
        const response = await API.post('/user_auth/edit-class/',
        {
            class_name: classDetails.name,
            prompts: prompts,
            prompt_override: classDetails.prompt_override
        }
        )
        console.log(response)
    }

    useEffect(() => {
        // Run on start up
        getClassDetails()   
    },[className])
    
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
        <div className="flex items-center justify-center min-h-[100dvh] bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {classDetails.name}
          </h2>
         {!showEdit && (<button
            className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setShowEdit(!showEdit)}
          >
            Edit Class
          </button>)
    }
            {showEdit && (<>
            <div>
              <input
                  name="prompt_text"
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
              }}>
                Add Prompt
                </button>
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
                <label>
                    <input
                    type="checkbox"
                    checked={classDetails.prompt_override}
                    onChange={() => setClassDetails({
                        ...classDetails,
                        prompt_override: !classDetails.prompt_override
                    })}
                    />
                    <span>Check this to include your own prompts</span>
                </label>
            </div>
            <button
            className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {updateClass();
              setShowEdit(!showEdit)
            }}
          >
            Submit
          </button>
            </>)}
        </div>
        </div>)
}

export default ClassEditor