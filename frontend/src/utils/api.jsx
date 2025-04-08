
import API from './axios';
/**
 * Generates an Organization and returns back invitation link for supervisors
 * @param {{org_name: string, admin_email: string}} org_data
 * @returns {Response}
 */
export const generateOrganization = async (org_data) => {
    console.log(org_data)
    const response = await API.post('/user_auth/generate-org/', {
        org_data: org_data
    });
    return(generateInvite(''))
}

/**
 * Generates an invite given the token and class_name if a supervisor is generating
 * @param {string} class_name=''
 * @returns {any}
 */
export const generateInvite = async (class_name='') => {
    const name = class_name
    const response = await API.post('/user_auth/generate-invite/', {
        class_name: name
    });
    // Decide on the role and update the link correctly
    if (response.data.invitation.role == 'Supervisor') {
        return(`${window.location.origin}/register?role=sup&code=${response.data.invitation.code}`);
    } else if (response.data.invitation.role == 'Admin') {
        return(`${window.location.origin}/register?role=admin&code=${response.data.invitation.code}`);
    } else {
        return(`${window.location.origin}/register?role=stu&code=${response.data.invitation.code}`);
    }
};

/**
 * Generates class for a supervisor
 * @param {any} form_data
 * @returns true if succesful
 */
export const generateClass = async (form_data) => {
    const response = await API.post('/user_auth/generate-class/',
        {
            form_data: form_data
        }
    )
    return (true)
}


export const getClasses = async () => {
    const response = await API.get('/user_auth/get-classes/')
    return (response.data)
}

export const getStudentsForClass = async (class_obj) => {
  const response = await axios.post('http://localhost:8000/user_auth/students-in-class/', {
    class_obj: class_obj,
  });
  return response.data;
};
