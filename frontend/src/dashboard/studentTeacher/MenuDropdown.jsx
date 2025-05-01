import { FaBars } from "react-icons/fa";
import MainMenuDropdown from "./StudentMainMenuDropdown";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MenuDropdown = () => { 
    const navigate = useNavigate();
    const handleBackClick = () => navigate(-1);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex justify-end">
        <div className="relative">
          <FaBars
            className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <MainMenuDropdown onClose={() => setMenuOpen(false)} />
          )}
        </div>
      </div>
      
    )
}

export default MenuDropdown