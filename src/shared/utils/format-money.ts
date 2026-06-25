export function formatMoney(
  value: number | string | null | undefined,
  currency?: string | null,
): string {
  const amount = Number(value);
  const normalizedAmount = Number.isFinite(amount) ? amount : 0;
  const normalizedCurrency = currency?.trim();

  if (!normalizedCurrency) {
    return `$${normalizedAmount.toFixed(2)}`;
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(normalizedAmount);
  } catch {
    return `$${normalizedAmount.toFixed(2)}`;
  }
}
