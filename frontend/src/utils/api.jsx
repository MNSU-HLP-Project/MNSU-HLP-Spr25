import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const generateInvite = async () => {
    const token = localStorage.getItem('jwtToken');  
    const response = await axios.post('http://localhost:8000/api/generate-invite/', {
        token: token
    });
    if (response.data.role == 'Admin') {
        return(`${window.location.origin}/register?role=sup&code=${response.data.code}`);
    } else {
        return(`${window.location.origin}/register?role=stu&code=${response.data.code}`);
    }
};

export default generateInvite;