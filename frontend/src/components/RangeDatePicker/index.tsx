import { useState } from "react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import PickerCustomInput from "./PickerCustomInput";

const RangeDatePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const getSummaryText = () => {
    if (!startDate && !endDate) {
      return "Todos los registros hasta hoy";
    } else if (startDate && !endDate) {
      return `Desde el ${format(startDate, "dd MMM yyyy", {
        locale: es,
      })} hasta Hoy`;
    } else if (!startDate && endDate) {
      return `Todos los registros hasta el ${format(endDate, "dd MMM yyyy", {
        locale: es,
      })}`;
    } else {
      return `Desde el ${format(startDate!, "dd MMM yyyy", {
        locale: es,
      })} hasta el ${format(endDate!, "dd MMM yyyy", { locale: es })}`;
    }
  };

  return (
    <div className="mb-6 mx-auto w-48">
      <div className="rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Rango de fechas
          </h3>
        </div>

        <div className="space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Inicial
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              locale={es}
              dateFormat="dd/MM/yyyy"
              placeholderText="No seleccionado"
              customInput={
                <PickerCustomInput
                  placeholder="No seleccionado"
                  onClear={() => setStartDate(null)}
                />
              }
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Final
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || undefined}
              locale={es}
              dateFormat="dd/MM/yyyy"
              placeholderText="No seleccionado"
              customInput={
                <PickerCustomInput
                  placeholder="No seleccionado"
                  onClear={() => setEndDate(null)}
                />
              }
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-orange-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Se mostrarán
          </p>
          <p className="mt-2 text-sm font-semibold text-orange-700 dark:text-orange-400 dark:bg-gray-800 text-center p-2">
            {getSummaryText()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RangeDatePicker;
