/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "../../utils/formatUtils";
import { CHART_COLORS } from "../../utils/constants";
import ChartLoading from "./ChartLoading";
import ChartError from "./ChartError";
import ChartEmpty from "./ChartEmpty";

interface Category {
  key: string;
  category: string;
  group: string;
  color: string;
}

interface TemporalChartProps {
  data?: {
    valuesByGroup: Array<{
      group: {
        id: string;
        type: string;
        totalPercentage: number;
        totalValue: number;
      };
      categories: Array<{
        category: {
          type: string;
          totalPercentage: number;
          totalValue: number;
        };
        values: Array<{
          value: number;
          percentage: number;
          datetime: string;
        }>;
      }>;
    }>;
  };
  loading?: boolean;
  error?: boolean;
}

const TemporalChart = ({
  data,
  loading = false,
  error = false,
}: TemporalChartProps) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);

  const filteredGroups = data?.valuesByGroup || [];

  useEffect(() => {
    if (!data?.valuesByGroup || selectedCategories.length === 0) {
      setTimeSeriesData([]);
      return;
    }

    const allDates = new Set<string>();

    data.valuesByGroup.forEach((groupData) => {
      groupData.categories.forEach((catData) => {
        if (
          selectedCategories.some(
            (sc) =>
              sc.group === groupData.group.type &&
              sc.category === catData.category.type
          )
        ) {
          catData.values.forEach((value) => {
            allDates.add(new Date(value.datetime).toISOString().split("T")[0]);
          });
        }
      });
    });

    // Crear estructura de datos para el gráfico
    const chartData = Array.from(allDates)
      .sort()
      .map((date) => {
        const dataPoint: any = { date };

        selectedCategories.forEach((selectedCat) => {
          const group = data.valuesByGroup.find(
            (g) => g.group.type === selectedCat.group
          );
          if (group) {
            const category = group.categories.find(
              (c) => c.category.type === selectedCat.category
            );
            if (category) {
              const valueForDate = category.values.find(
                (v) => new Date(v.datetime).toISOString().split("T")[0] === date
              );
              dataPoint[selectedCat.key] = valueForDate
                ? valueForDate.value
                : null;
            }
          }
        });

        return dataPoint;
      });

    setTimeSeriesData(chartData);
  }, [data, selectedCategories]);

  const toggleCategory = (categoryType: string, groupType: string) => {
    const categoryKey = `${groupType}:${categoryType}`;
    if (selectedCategories.some((cat) => cat.key === categoryKey)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat.key !== categoryKey)
      );
    } else {
      setSelectedCategories([
        ...selectedCategories,
        {
          key: categoryKey,
          category: categoryType,
          group: groupType,
          color: CHART_COLORS[selectedCategories.length % CHART_COLORS.length],
        },
      ]);
    }
  };

  if (error) {
    return <ChartError title="Evolución temporal" />;
  }

  if (loading) {
    return <ChartLoading title="Evolución temporal" />;
  }

  if (!data || !data.valuesByGroup || data.valuesByGroup.length === 0) {
    return <ChartEmpty title="Evolución temporal" />;
  }

  return (
    <div className=" rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-semibold mb-2 text-orange-700 dark:text-orange-300">
        Evolución temporal
      </h2>

      <div className="mb-4 p-4 bg-white dark:bg-gray-800">
        <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
          Seleccionar categorías:
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {filteredGroups.map((groupData) => (
            <div key={groupData.group.id} className="mb-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {groupData.group.type}
              </div>
              <div className="flex flex-wrap gap-1">
                {groupData.categories.map((catData) => (
                  <button
                    key={`${groupData.group.type}-${catData.category.type}`}
                    onClick={() =>
                      toggleCategory(
                        catData.category.type,
                        groupData.group.type
                      )
                    }
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      selectedCategories.some(
                        (c) =>
                          c.key ===
                          `${groupData.group.type}:${catData.category.type}`
                      )
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {catData.category.type}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedCategories.length > 0 && timeSeriesData.length > 0 ? (
        <div className="h-80 text-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeriesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-gray-600"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#4b5563" }}
                className="dark:text-gray-300"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis
                tick={{ fill: "#4b5563" }}
                className="dark:text-gray-300"
              />
              <Tooltip
                formatter={(value, name) => {
                  const categoryInfo = selectedCategories.find(
                    (c) => c.key === name
                  );
                  return [
                    formatNumber(value as number),
                    categoryInfo
                      ? `${categoryInfo.group} - ${categoryInfo.category}`
                      : name,
                  ];
                }}
                labelFormatter={(label) => {
                  const d = new Date(label);
                  return `${d.getDate()}/${
                    d.getMonth() + 1
                  }/${d.getFullYear()}`;
                }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  color: "#1f2937",
                }}
              />
              <Legend
                formatter={(value) => {
                  const categoryInfo = selectedCategories.find(
                    (c) => c.key === value
                  );
                  return categoryInfo
                    ? `${categoryInfo.group} - ${categoryInfo.category}`
                    : value;
                }}
              />
              {selectedCategories.map((catInfo) => (
                <Line
                  key={catInfo.key}
                  type="monotone"
                  dataKey={catInfo.key}
                  stroke={catInfo.color}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Selecciona al menos una categoría para visualizar datos
        </div>
      )}

      </div>


    </div>
  );
};

export default TemporalChart;
