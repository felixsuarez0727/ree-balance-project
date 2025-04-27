export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (timestamp: string) => {
    if (!timestamp) return null;
    
    const date = new Date(timestamp);
    
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  
