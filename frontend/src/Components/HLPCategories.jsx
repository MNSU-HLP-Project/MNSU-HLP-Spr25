import { FaArrowLeft, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HLPCategories() {
  const categories = [
    { name: "Collaboration", color: "bg-red-600", textColor: "text-white" },
    { name: "Data-Driven Planning", color: "bg-purple-600", textColor: "text-white" },
    { name: "Instruction in Behavior and Academics", color: "bg-blue-600", textColor: "text-white" },
    { name: "Intensify and Intervene as Needed", color: "bg-orange-500", textColor: "text-white" },
  ];

  const navigate = useNavigate();
  const handleBackClick = () => navigate("/mainmenu/");
  const handleMenuClick = () => alert("Menu button clicked");
  const handleCategoryClick = (name) => navigate("/collaboration/");
  const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-gray-100 to-white p-6">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center mt-4 mb-4">
          <FaArrowLeft className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform" onClick={handleBackClick} />
          <h1 className="text-3xl md:text-4xl font-bold border-b-2 border-gray-300 pb-1">HLP Categories</h1>
          <FaBars className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform" onClick={handleMenuClick} />
        </div>

        <p className="text-center text-lg md:text-xl font-bold text-gray-700 mb-4">
          Choose a category
        </p>
      </div>

      {/* Categories Grid */}
      <div className="flex-grow grid p-3 md:p-4 grid-cols-2 gap-4 md:gap-6 grid-rows-2">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex items-center justify-center rounded-xl p-6 md:p-8 ${category.color} ${category.textColor} text-center shadow-xl cursor-pointer hover:scale-105 hover:rotate-1 transition-transform h-full text-base sm:text-lg md:text-xl lg:text-2xl font-bold drop-shadow-lg`}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="pb-6 mt-auto flex justify-center">
        <button
          className="w-32 md:w-36 p-3 md:p-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-300 font-semibold text-lg md:text-xl"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
