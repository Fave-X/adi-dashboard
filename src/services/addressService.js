const filterByPeriod = (data, period) => {
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  if (period === "24H") return sorted.slice(-1);
  if (period === "7D")  return sorted.slice(-7);
  if (period === "30D") return sorted.slice(-30);
  return sorted;
};