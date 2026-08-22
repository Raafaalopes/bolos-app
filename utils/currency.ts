export function parseCurrencyToCents(input: string): number {
  const normalized = input.replace(/\./g, "").replace(",", ".");
  const value = parseFloat(normalized);
  if (isNaN(value)) return 0;
  return Math.round(value * 100);
}

export function formatCentsToCurrency(cents: number): string {
  const value = cents / 100;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
