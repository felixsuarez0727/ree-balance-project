import React from 'react';
import { AlertTriangle } from "lucide-react";

const ChartError = ({ title }: { title: string }) => {
  return (
    <div className=" p-4 border border-red-100 dark:border-red-900/30 mb-6 ">
      <h2 className="text-lg font-semibold mb-4 text-red-700 dark:text-red-300">
        {title}
      </h2>
      <div className="h-80 flex flex-col items-center justify-center gap-3 bg-white text-red-600 dark:bg-gray-800 dark:text-red-300 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500 dark:text-red-400" />
          <span className="font-medium">Error al cargar los datos</span>
        </div>
      </div>
    </div>
  );
};

export default ChartError;
