export const formatCurrency = (amount: string | number): string => {
    // Convert to string if it's a number
    const amountStr = typeof amount === 'number' ? amount.toString() : amount;
    const numericAmount = parseFloat(amountStr.replace(/,/g, ''));
    if (isNaN(numericAmount)) return amountStr;
  
    if (numericAmount >= 1e7) return `${(numericAmount / 1e7).toFixed(2)} Cr`;
    if (numericAmount >= 1e5) return `${(numericAmount / 1e5).toFixed(2)} L`;
    if (numericAmount >= 1e3) return `${(numericAmount / 1e3).toFixed(2)} K`;
    return numericAmount.toFixed(2);
  };