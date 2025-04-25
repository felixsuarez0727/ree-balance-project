import { Zap } from "lucide-react";

const MainFooter = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-between items-center">
          <div className="flex items-center mb-3 md:mb-0">
            <Zap size={18} className="text-orange-400 mr-2" />
            <span>EnergyDash © 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
