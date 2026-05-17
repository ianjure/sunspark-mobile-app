export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Not found";
  }

  return `₱${value.toFixed(2)}`;
}