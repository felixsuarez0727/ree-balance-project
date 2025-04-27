import { formatDate, formatNumber } from "../../utils/formatUtils";
import ChartLoading from "./ChartLoading";
import ChartError from "./ChartError";

interface DetailsTableProps {
  group: {
    id: string;
    type: string;
    totalValue: number;
  };
  categories: {
    category: {
      type: string;
    };
    values: {
      value: number;
      percentage: number;
      datetime: string;
    }[];
  }[];
  loading?: boolean;
  error?: boolean;
}

const DetailsTable = ({
  categories,
  group,
  loading = false,
  error = false,
}: DetailsTableProps) => {
  if (error) {
    return <ChartError title="Detalles de grupo" />;
  }

  if (loading) {
    return <ChartLoading title="Detalles de grupo" />;
  }

  return (
    <div className="space-y-6 w-full p-4">
      <h2 className="text-lg font-semibold text-orange-700 dark:text-orange-300">
        Detalles de grupo
      </h2>

      <div
        key={group?.id}
        className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 ${
          loading ? "animate-pulse" : ""
        }`}
      >
        <h3 className="text-md font-medium mb-3 text-orange-600 dark:text-orange-400">
          {group?.type}
        </h3>

        <div className="overflow-x-auto relative h-96">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Porcentaje
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories?.map((catData, catIndex) =>
                catData.values.length > 0 ? (
                  catData.values.map((valueData, valueIndex) => (
                    <tr
                      key={`${catIndex}-${valueIndex}`}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 text-sm ${
                        loading ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-200">
                        {catData.category.type}
                      </td>
                      <td
                        className={`px-4 py-2 text-right whitespace-nowrap ${
                          valueData.value >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatNumber(valueData.value)}
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap text-gray-800 dark:text-gray-200">
                        {(valueData.percentage * 100).toFixed(2)}%
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap text-gray-800 dark:text-gray-200">
                        {formatDate(valueData.datetime)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr
                    key={catIndex}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 text-sm ${
                      loading ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2  text-md whitespace-nowrap text-gray-800 dark:text-gray-200">
                      {catData.category.type}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap text-gray-600 dark:text-gray-400">
                      0.00
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap text-gray-600 dark:text-gray-400">
                      0.00%
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap text-gray-600 dark:text-gray-400">
                      -
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailsTable;
