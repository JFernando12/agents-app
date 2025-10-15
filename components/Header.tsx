import { CpaVisionIcon, SearchIcon } from "./icons";

const Header: React.FC = () => {
  return (
    <header className="bg-[#232A37] text-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center">
            <CpaVisionIcon className="h-12 w-12 mr-4" />
            <h1 className="text-4xl font-bold uppercase text-white">
              CPA Vision IA
            </h1>
          </div>
          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-4 pr-10 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
            <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-blue-700 transition-colors">
              RE
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
