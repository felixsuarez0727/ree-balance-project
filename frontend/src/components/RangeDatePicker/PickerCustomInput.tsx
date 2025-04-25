import React from "react";
import { Calendar, X } from "lucide-react";

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
  onClear: () => void;
}

const PickerCustomInput = React.forwardRef<HTMLDivElement, CustomInputProps>(
  ({ value, onClick, placeholder, onClear }, ref) => (
    <div
      className="flex items-center justify-between w-42 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 cursor-pointer"
      onClick={onClick}
      ref={ref}
    >
      <div className="flex items-center">
        <Calendar
          size={18}
          className="text-orange-500 dark:text-orange-400 mr-2"
        />
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          {value || placeholder}
        </span>
      </div>
      {value && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
        >
          <X size={13} className="text-gray-500 dark:text-gray-400" />
        </button>
      )}
    </div>
  )
);

export default PickerCustomInput;
