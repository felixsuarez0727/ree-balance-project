import { useEffect, Dispatch, SetStateAction } from "react";
import {
  Activity,
  AlertTriangle,
  Bolt,
  RefreshCw,
  Sun,
  Zap,
} from "lucide-react";
import { useQuery } from "@apollo/client";
import ALL_ENERGY_GROUPS from "../queries/allEnergyGroups";

type EnergyGroup = {
  id: string;
  type: string;
};

interface EnergyTogglesProps {
  exclusiveMode?: boolean;
  activeGroups: Record<string, boolean>;
  setActiveGroups: Dispatch<SetStateAction<Record<string, boolean>>>;
}

const EnergyToggles = ({
  activeGroups,
  setActiveGroups,
  exclusiveMode = false,
}: EnergyTogglesProps) => {
  const { loading, error, data, refetch } = useQuery(ALL_ENERGY_GROUPS, {
    errorPolicy: "all",
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.energyGroups && data.energyGroups.length > 0) {
      if (exclusiveMode) {
        const initialActive = data.energyGroups.reduce(
          (acc: Record<string, boolean>, group: EnergyGroup, index: number) => {
            acc[group.id] = index === 0;
            return acc;
          },
          {}
        );
        setActiveGroups(initialActive);
      } else {
        const initialActive = data.energyGroups.reduce(
          (acc: Record<string, boolean>, group: EnergyGroup) => {
            acc[group.id] = true;
            return acc;
          },
          {}
        );
        setActiveGroups(initialActive);
      }
    }
  }, [data, exclusiveMode, setActiveGroups]);

  const handleToggle = (id: string) => {
    if (exclusiveMode) {
      const allInactive = Object.keys(activeGroups).reduce(
        (acc: Record<string, boolean>, groupId: string) => {
          acc[groupId] = groupId === id;
          return acc;
        },
        {}
      );
      setActiveGroups(allInactive);
    } else {
      setActiveGroups((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const getIconForGroup = (id: string) => {
    switch (id) {
      case "Renovable":
        return Sun;
      case "No-Renovable":
        return Zap;
      case "Almacenamiento":
        return Bolt;
      case "Demanda en b.c.":
        return Activity;
      default:
        return Sun;
    }
  };

  if (loading) {
    return (
      <div className="mb-3 flex items-center justify-center gap-3 px-4 py-3 rounded-full bg-orange-50 dark:bg-gray-800/80 border border-orange-100 dark:border-gray-700 shadow-sm w-50 mx-auto">
        <RefreshCw
          size={16}
          className="text-orange-500 dark:text-orange-400 animate-spin"
        />
        <span className="text-xs text-orange-700 dark:text-orange-300 font-medium whitespace-nowrap">
          Cargando grupos...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-3 flex flex-row items-center justify-center gap-3 px-4 py-2 rounded-full bg-red-50 dark:bg-gray-800/80 border border-red-100 dark:border-red-900/30 shadow-sm w-50 mx-auto">
        <AlertTriangle
          size={16}
          className="text-red-500 dark:text-red-400 shrink-0"
        />
        <span className="text-red-600 dark:text-red-300 font-medium text-xs">
          Error
        </span>
        <button
          onClick={() => refetch()}
          className="px-3 py-1  text-red-600 dark:text-red-300 font-medium hover:underline text-xs rounded-full transition-colors duration-200 flex items-center gap-1  cursor-pointer"
        >
          <RefreshCw size={12} />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-4">
      {data.energyGroups.map((group: EnergyGroup) => {
        const Icon = getIconForGroup(group.id);
        const isActive = activeGroups[group.id];

        return (
          <button
            key={group.id}
            onClick={() => handleToggle(group.id)}
            className={`flex flex-row items-center justify-center gap-1 px-3 py-2 rounded-full transition-all duration-200 w-40 cursor-pointer text-center ${
              isActive
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <Icon size={20} className={isActive ? "animate-pulse" : ""} />
            <span className="text-sm font-medium">{group.type}</span>
          </button>
        );
      })}
    </div>
  );
};

export default EnergyToggles;
