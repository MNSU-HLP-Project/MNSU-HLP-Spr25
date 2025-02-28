import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../utils/jwtHelper';

function InviteLink() {
    const [inviteLink, setInviteLink] = useState('');
    const navigate = useNavigate();

    const generateInvite = async () => {
        const token = localStorage.getItem('jwtToken');  // Assuming you're using token-based auth
        const response = await axios.post('http://localhost:8000/api/generate-invite/', {
            userid: decodeToken(token).id,
            role: decodeToken(token).role
        });
        if (decodeToken(token).role == 'Admin') {
            setInviteLink(`${window.location.origin}/register?role=sup&code=${response.data.code}`);
        } else {
            setInviteLink(`${window.location.origin}/register?role=stu&code=${response.data.code}`);
        }
    };

    return (
        <div>
            <button onClick={generateInvite}>Generate Invite Link</button>
            {inviteLink && (
    <p>
        Share this link with students: 
        <button 
            onClick={() => {
                navigator.clipboard.writeText(inviteLink); 
                alert('Copied to clipboard')
            }}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
        >
            {inviteLink}
        </button>
    </p>
)}
        <button
          className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => navigate('/mainmenu/')}
        >
          Back
        </button>
        </div>
    );
}

export default InviteLink;
