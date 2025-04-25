import { Settings } from "lucide-react";
import EnergyToggles from "../../components/EnergyToggles";
import RangeDatePicker from "../../components/RangeDatePicker";

function Home() {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Balance Eléctrico Global
          </h2>
          <Settings size={20} className="text-gray-500 dark:text-gray-400" />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
            <EnergyToggles />

            <div className="flex gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-md  flex items-center justify-center text-gray-500 dark:text-gray-400">
                <RangeDatePicker />
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-md  flex items-center justify-center text-gray-500 dark:text-gray-400  w-full">
                Charts
              </div>
            </div>
          </h3>
        </div>
      </div>
    </>
  );
}

export default Home;
