/** "Feb 2024" → "Feb '24" for narrow viewports. */
export function formatMonthTick(month: string): string {
  const match = /^([A-Za-z]+)\s+(\d{4})$/.exec(month);

  if (!match?.[1] || !match[2]) {
    return month;
  }

  return `${match[1]} '${match[2].slice(2)}`;
}
