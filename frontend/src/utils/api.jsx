import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const generateInvite = async (class_name) => {
    const token = localStorage.getItem('jwtToken');  

    const name = class_name || ''
    console.log(name)
    const response = await axios.post('http://localhost:8000/api/generate-invite/', {
        token: token,
        class_name: name
    });
    console.log(response)
    if (response.data.invitation.role == 'Supervisor') {
        return(`${window.location.origin}/register?role=sup&code=${response.data.invitation.code}`);
    } else {
        return(`${window.location.origin}/register?role=stu&code=${response.data.invitation.code}`);
    }
};

export const generateClass = async (form_data) => {
    const token = localStorage.getItem('jwtToken')
    console.log (form_data)
    const response = await axios.post('http://localhost:8000/api/generate-class/',
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
    const response = await axios.post('http://localhost:8000/api/get-classes/',
        {
            token: token
        }
    )
    console.log(response)
    return (response.data)
}