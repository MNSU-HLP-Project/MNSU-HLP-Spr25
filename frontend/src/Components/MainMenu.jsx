import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const MainMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const buttonPress = () => {
    navigate('/')
  }

  return (
    <button className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    onClick={buttonPress}>
        Log Out
    </button>
  );
};

export default MainMenu;
