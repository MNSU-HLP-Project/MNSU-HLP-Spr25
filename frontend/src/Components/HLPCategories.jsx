import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function HLPCategories() {
  const categories = [
    { name: 'Collaboration', color: 'bg-red-600', textColor: 'text-white' },
    { name: 'Data-Driven Planning', color: 'bg-purple-600', textColor: 'text-white' },
    { name: 'Instruction in Behavior and Academics', color: 'bg-blue-600', textColor: 'text-white' },
    { name: 'Intensify and Intervene as Needed', color: 'bg-orange-500', textColor: 'text-white' }
  ];
  const navigate = useNavigate();

  const handleBackClick = () => {
    console.log('Back button clicked');
    navigate('/mainmenu/')
};
  const handleMenuClick = () => alert('Menu button clicked');
  const handleCategoryClick = (name) => console.log(`${name} clicked`);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex justify-between items-center mb-6">
        <FaArrowLeft className="text-xl cursor-pointer hover:scale-105 transition-transform" onClick={handleBackClick} />
        <h1 className="text-2xl font-bold">HLP Categories</h1>
        <FaBars className="text-xl cursor-pointer hover:scale-105 transition-transform" onClick={handleMenuClick} />
      </div>

      <p className="text-center mb-6">Choose a category</p>

      <div className="grid grid-cols-2 gap-4 h-[70vh] md:grid-cols-2 md:gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex items-center justify-center rounded-lg p-6 ${category.color} ${category.textColor} text-center shadow-lg cursor-pointer hover:scale-105 transition-transform h-full text-base md:text-2xl font-bold`}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
}
