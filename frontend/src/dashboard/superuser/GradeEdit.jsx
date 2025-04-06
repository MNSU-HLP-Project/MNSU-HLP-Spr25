import { useState, useEffect } from "react";
import API from "../../utils/axios";
function GradeEdit({onClose}) {
    const [gradelevels, setGradeLevels] = useState([])
    const [gradeText, setGradeText] = useState('')
    const NewGrade = ({ text }) => (
      <div>
        <p className="text-2xl font-bold text-gray-800">{text}</p>
      </div>
    );
    const addComponent = (text) => {
      setGradeLevels([...gradelevels, text]);
    };
  
    const removeComponent = (index) => {
      const updatedComponents = [...gradelevels];
      updatedComponents.splice(index, 1);
      setGradeLevels(updatedComponents);
    };

    const updateGrades = async () => {
      try {
        const response = await API.post('/user_auth/update_grades/', {
          grades: gradelevels,
        });
        console.log(response);
        if (onClose) onClose(); // <-- Hide the component on success
      } catch (error) {
        console.error("Error submitting grades", error);
      }
    };


    useEffect(() => {
        const fetchGrades = async () => {
        try {
            const response = await API.get("/user_auth/getgrades/");
            // Sort the grades, handling both numbers and strings
            const sortedGrades = [...response.data].sort((a, b) => {
            // Convert numeric gradelevel strings to numbers, otherwise leave as string
            const gradeA = isNaN(a.gradelevel) ? a.gradelevel : Number(a.gradelevel);
            const gradeB = isNaN(b.gradelevel) ? b.gradelevel : Number(b.gradelevel);
    
            // If both gradelevels are numbers, compare numerically
            if (typeof gradeA === 'string' && typeof gradeB === 'string') {
                return gradeA < gradeB ? -1 : 1;
            }
    
            // If one is a string and the other is a number, treat the string as smaller
            if (typeof gradeA === 'string') return -1; // String comes first
            if (typeof gradeB === 'string') return 1;  // String comes first
    
            // If both are numbers, sort numerically
            return gradeA - gradeB;
            });
            const grade_list = sortedGrades.map(grade => grade.gradelevel);
            setGradeLevels(grade_list);
            console.log(grade_list);
        } catch (error) {
            console.error("Error getting grades", error);
        }
        };

        fetchGrades();
    }, []);

    return (
        <div>
        <input
            name="org_name"
            type="text"
            placeholder=''
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setGradeText(e.target.value)}
            value={gradeText}
          />
        <button 
            className="w-1/2 mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
           onClick={()=> {
            addComponent(gradeText);
            console.log(gradelevels)
            setGradeText('')
          }}>Add Prompt</button>
        
          {gradelevels.map((grade, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-200 p-2 rounded-lg mt-2">
              <NewGrade text={grade} />
              <button 
                onClick={() => removeComponent(index)}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
        className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => {updateGrades()
        }}
      >
        Submit
      </button>
    </div>
        
    )
}

export default GradeEdit