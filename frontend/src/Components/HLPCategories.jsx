import { FaArrowLeft, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HLPCategories() {
  const categories = [
    { name: "Collaboration", color: "bg-red-600", textColor: "text-white" },
    {
      name: "Data-Driven Planning",
      color: "bg-purple-600",
      textColor: "text-white",
    },
    {
      name: "Instruction in Behavior and Academics",
      color: "bg-blue-600",
      textColor: "text-white",
    },
    {
      name: "Intensify and Intervene as Needed",
      color: "bg-orange-500",
      textColor: "text-white",
    },
  ];
  const navigate = useNavigate();

  const handleBackClick = () => navigate("/mainmenu/");
  const handleMenuClick = () => alert("Menu button clicked");
  const handleCategoryClick = (name) => navigate("/collaboration/");
  const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6">
      <div className="flex justify-between items-center mt-6 md:mt-10 mb-6 md:mb-10">
        <FaArrowLeft
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleBackClick}
        />
        <h1 className="text-3xl md:text-4xl font-bold border-b-2 border-gray-300 pb-2">
          HLP Categories
        </h1>
        <FaBars
          className="text-2xl md:text-3xl cursor-pointer hover:scale-110 transition-transform"
          onClick={handleMenuClick}
        />
      </div>

      <p className="text-center text-2xl md:text-xl font-bold text-gray-700 mb-20 md:mb-25">
        Choose a category
      </p>

      <div className="grid grid-cols-2 gap-5 md:gap-6 h-[40vh] md:grid-cols-2 md:gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex items-center justify-center rounded-xl p-8 md:p-10 ${category.color} ${category.textColor} text-center shadow-xl cursor-pointer hover:scale-105 hover:rotate-1 transition-transform h-full text-lg md:text-2xl font-bold drop-shadow-lg`}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </div>
        ))}
      </div>
      <button
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-32 md:w-36 p-3 md:p-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 flex items-center justify-center transition duration-300 font-semibold text-lg md:text-xl"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
}
