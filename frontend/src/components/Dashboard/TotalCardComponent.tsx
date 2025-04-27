/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatNumber } from "../../utils/formatUtils";
import { Info } from "lucide-react";
import ChartError from "./ChartError";
import ChartLoading from "./ChartLoading";

interface TotalsCardComponentProps {
  data: any[];
  keyValue: string;
  loading?: boolean;
  error?: boolean;
}

const TotalsCardComponent = ({
  data,
  keyValue,
  loading = false,
  error = false,
}: TotalsCardComponentProps) => {

  if (error) {
    return <ChartError title="Valor total por grupo" />;
  }

  if (loading) {
    return <ChartLoading title="Valor total por grupo" />;
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <div className="rounded-lg m-4 space-y-6">
        <h2 className="text-lg font-semibold text-orange-700 dark:text-orange-300">
          Valor total por grupo
        </h2>
        <div className="bg-blue-50 dark:bg-gray-800 min-h-64 rounded-lg p-4 shadow-lg border border-blue-100 dark:border-gray-700 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Info size={20} className="text-blue-500 dark:text-blue-400" />
            <span className="font-medium text-blue-600 dark:text-blue-300">Debe seleccionar al menos un filtro</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg m-4">
      <h2 className="text-lg font-semibold mb-4 text-orange-700 dark:text-orange-300">
        Valor total por grupo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
        {data?.map((groupData, index) => {
          const object = groupData[keyValue];

          return (
            <div
              key={index}
              className="p-3 rounded-md flex justify-between items-center hover:bg-red-50 dark:hover:bg-gray-700"
            >
              <span>{object.type}</span>
              <span
                className={`font-bold ${
                  object.totalValue >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatNumber(object.totalValue)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TotalsCardComponent;