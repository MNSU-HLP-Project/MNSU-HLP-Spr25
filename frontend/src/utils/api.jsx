import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const generateOrganization = async (org_data) => {
    const token = localStorage.getItem('jwtToken'); 
    console.log(org_data)
    const response = await axios.post('http://localhost:8000/user_auth/generate-org/', {
        token: token,
        org_data: org_data
    });
    return(generateInvite(''))
}

export const generateInvite = async (class_name='') => {
    const token = localStorage.getItem('jwtToken');  

    const name = class_name
    console.log(name)
    const response = await axios.post('http://localhost:8000/user_auth/generate-invite/', {
        token: token,
        class_name: name
    });
    console.log(response)
    if (response.data.invitation.role == 'Supervisor') {
        return(`${window.location.origin}/register?role=sup&code=${response.data.invitation.code}`);
    } else if (response.data.invitation.role == 'Admin') {
        return(`${window.location.origin}/register?role=admin&code=${response.data.invitation.code}`);
    } else {
        return(`${window.location.origin}/register?role=stu&code=${response.data.invitation.code}`);
    }
};

export const generateClass = async (form_data) => {
    const token = localStorage.getItem('jwtToken')
    console.log (form_data)
    const response = await axios.post('http://localhost:8000/user_auth/generate-class/',
        {
            token: token,
            form_data: form_data
        }
    )
    console.log(response)
    return (true)
}


export const getClasses = async () => {
    const token = localStorage.getItem('jwtToken')
    const response = await axios.post('http://localhost:8000/user_auth/get-classes/',
        {
            token: token
        }
    )
    console.log(response)
    return (response.data)
}

export const getStudentsForClass = async (class_obj) => {
  const token = localStorage.getItem('jwtToken');
  const response = await axios.post('http://localhost:8000/user_auth/students-in-class/', {
    token,
    class_obj: class_obj,
  });
  return response.data;
};
