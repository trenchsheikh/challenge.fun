export function shortenAddress(address: string, visibleChars: number = 4): string {
  if (!address) return '';
  if (address.length <= visibleChars * 2) return address;
  return `${address.slice(0, visibleChars)}...${address.slice(-visibleChars)}`;
}

export function formatNumber(num: number | null | undefined, decimals = 2): string {
  if (num === null || num === undefined || Number.isNaN(num)) return '-';
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: decimals }).format(num);
}