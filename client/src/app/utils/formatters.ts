export function formatPrice(price: string, exchangeCode: string) {
  if (!price) return '0원';
  const numericPrice = price.replace(/[^\d.-]/g, '');
  if (exchangeCode !== 'KRX') {
    return `${parseFloat(numericPrice).toLocaleString()}$`;
  }
  return `${parseInt(numericPrice).toLocaleString()}원`;
}

export function formatChange(change: string) {
  if (!change) return '0';
  if (change.startsWith('+') || change.startsWith('-')) return change;
  const numericChange = parseFloat(change);
  return numericChange >= 0 ? `+${change}` : change;
}

export function formatPositiveChange(change: string) {
  if (change.startsWith('-')) return false;
  return true;
}

export function formatPercentage(percentage: string) {
  if (!percentage) return '0%';
  const cleanPercentage = percentage.replace(/%/g, '');
  if (cleanPercentage.startsWith('+') || cleanPercentage.startsWith('-')) {
    return `${cleanPercentage}%`;
  }
  const numericPercentage = parseFloat(cleanPercentage);
  return numericPercentage >= 0
    ? `+${cleanPercentage}%`
    : `${cleanPercentage}%`;
}
