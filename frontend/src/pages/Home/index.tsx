import { Settings } from "lucide-react";
import EnergyToggles from "../../components/EnergyToggles";
import RangeDatePicker from "../../components/RangeDatePicker";
import { useState } from "react";
import GET_GROUPED_DATA from "../../queries/filteredGroups";
import { useQuery } from "@apollo/client";
import TotalsCardComponent from "../../components/Dashboard/TotalCardComponent";
import TemporalChart from "../../components/Dashboard/TemporalChart";
import StackedAreaChart from "../../components/Dashboard/StackedAreaChart";
import DistributionChart from "../../components/Dashboard/DistributionChart";

function Home() {
  const [activeGroups, setActiveGroups] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data, loading, error } = useQuery(GET_GROUPED_DATA, {
    variables: {
      groupIds: Object.keys(activeGroups).filter((key) => activeGroups[key]),
      from: startDate,
      to: endDate,
    },
  });

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
            <EnergyToggles
              activeGroups={activeGroups}
              setActiveGroups={setActiveGroups}
            />

            <div className="flex gap-4">
              <div className="">
                <RangeDatePicker
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400  w-full">
                <TemporalChart
                  error={!!error}
                  loading={loading}
                  data={data}
                ></TemporalChart>

                <StackedAreaChart
                  error={!!error}
                  loading={loading}
                  data={data}
                ></StackedAreaChart>

                <DistributionChart
                  error={!!error}
                  loading={loading}
                  data={data}
                ></DistributionChart>

                <TotalsCardComponent
                  keyValue={"group"}
                  error={!!error}
                  loading={loading}
                  data={data?.valuesByGroup}
                />
              </div>
            </div>
          </h3>
        </div>
      </div>
    </>
  );
}

export default Home;
