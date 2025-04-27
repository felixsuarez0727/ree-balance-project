/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatNumber } from "../../utils/formatUtils";
import { CHART_COLORS } from "../../utils/constants";
import ChartLoading from "./ChartLoading";
import ChartError from "./ChartError";
import ChartEmpty from "./ChartEmpty";

interface DistributionChartProps {
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

const DistributionChart = ({
  data,
  loading = false,
  error = false,
}: DistributionChartProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [pieData, setPieData] = useState<Array<any>>([]);

  useEffect(() => {
    if (!data?.valuesByGroup || !selectedGroup) {
      setPieData([]);
      return;
    }

    const groupData = data.valuesByGroup.find(
      (g) => g.group.type === selectedGroup
    );

    if (!groupData) {
      setPieData([]);
      return;
    }

    const significantCategories = groupData.categories
      .filter((cat) => Math.abs(cat.category.totalValue) > 0.1)
      .map((cat) => ({
        name: cat.category.type,
        value: Math.abs(cat.category.totalValue),
        originalValue: cat.category.totalValue,
        percentage: cat.category.totalPercentage,
      }));

    significantCategories.sort((a, b) => b.value - a.value);

    setPieData(significantCategories);
  }, [data, selectedGroup]);

  useEffect(() => {
    if (data?.valuesByGroup && !selectedGroup) {
      if (data.valuesByGroup.length === 1) {
        setSelectedGroup(data.valuesByGroup[0].group.type);
      } else if (data.valuesByGroup.length > 1) {
        setSelectedGroup(data.valuesByGroup[0].group.type);
      }
    }
  }, [data, selectedGroup]);

  if (error) {
    return <ChartError title="Distribución por categorías" />;
  }

  if (loading) {
    return <ChartLoading title="Distribución por categorías"></ChartLoading>;
  }

  if (!data || !data.valuesByGroup || data.valuesByGroup.length === 0) {
    return <ChartEmpty title="Distribución por categorías" />;
  }

  return (
    <div className="p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-orange-700 dark:text-orange-300 ">
        Distribución por categorías
      </h2>

      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
          Seleccionar grupo:
        </h3>

        <div className="flex flex-wrap gap-2">
          {data.valuesByGroup.map((groupData) => (
            <button
              key={groupData.group.id}
              onClick={() => setSelectedGroup(groupData.group.type)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedGroup === groupData.group.type
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {groupData.group.type}
            </button>
          ))}
        </div>

        {pieData.length > 0 ? (
          <div className="h-80 text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    name,
                  }) => {
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 1.4;
                    const x =
                      cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y =
                      cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                    if (percent < 0.05) return null;

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#888888"
                        className="dark:fill-gray-300"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize="12"
                      >
                        {name} ({(percent * 100).toFixed(1)}%)
                      </text>
                    );
                  }}
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      className={entry.originalValue < 0 ? "opacity-70" : ""}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(_, name, props: any) => {
                    const entry = props.payload;
                    return [
                      `${formatNumber(entry.originalValue)} (${(
                        entry.percentage * 100
                      ).toFixed(2)}%)`,
                      name,
                    ];
                  }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    color: "#1f2937",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No hay categorías con valores significativos para mostrar
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionChart;
