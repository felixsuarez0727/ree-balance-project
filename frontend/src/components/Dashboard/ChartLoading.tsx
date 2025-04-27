import React from 'react';
import { RefreshCw } from "lucide-react";

const ChartLoading = ({ title }: { title: string }) => {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-orange-700 dark:text-orange-300">
        {title}
      </h2>
      <div className="h-80 flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <RefreshCw
          size={24}
          className="text-orange-500 dark:text-orange-400 animate-spin"
        />
        <span className="text-sm text-orange-700 dark:text-orange-300">
          Cargando datos...
        </span>
      </div>
    </div>
  );
};

export default ChartLoading;
