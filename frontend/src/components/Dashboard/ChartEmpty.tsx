import React from 'react';
import { Info } from "lucide-react";

const ChartEmpty = ({ title }: { title: string }) => {
  return (
    <div className=" p-4 border border-red-100 dark:border-red-900/30 mb-6 ">
      <h2 className="text-lg font-semibold mb-4 text-red-700 dark:text-red-300">
        {title}
      </h2>
      <div className="h-80 flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-800  rounded-lg">
        <div className="flex items-center gap-2">
          <Info size={20} className="text-blue-500 dark:text-blue-400" />
          <span className="font-medium text-blue-600 dark:text-blue-300">
            No hay datos disponibles
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartEmpty;
