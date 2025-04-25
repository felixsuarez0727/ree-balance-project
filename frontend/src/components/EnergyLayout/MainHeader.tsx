import { Menu, Moon, Sun, X, Zap } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface MainHeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const MainHeader = ({ darkMode, setDarkMode }: MainHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path: string) => {
    const baseClasses =
      "flex items-center space-x-2 transition-all duration-300 relative px-2 py-1";
    const activeClasses = "text-white font-medium bg-orange-600/40 rounded-md";
    const inactiveClasses =
      "text-orange-50 hover:text-white hover:bg-orange-600/10 rounded-md";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };


  const renderLinks = () => {
    return (
      <>
        <Link to="/" className={getLinkClasses("/")}>
          <span>Global</span>
        </Link>
        <Link to="/grouped" className={getLinkClasses("/grouped")}>
          <span>Agrupado</span>
        </Link>
      </>
    );
  };

  return (
    <header className="bg-orange-500 dark:bg-orange-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap size={24} />
            <h1 className="text-xl font-bold">EnergyDash</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">{renderLinks()}</nav>

          <div className="flex gap-6">
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 py-2 hover:text-orange-200 transition-colors md:hidden"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center p-1 rounded-full hover:bg-orange-600 dark:hover:bg-orange-700"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-2">{renderLinks()}</nav>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
