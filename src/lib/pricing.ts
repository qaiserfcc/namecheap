import { Decimal } from '@prisma/client/runtime/library';

export interface PriceComparison {
  officialPrice: number;
  discountedPrice: number;
  savings: number;
  savingsPercentage: number;
}

/**
 * Calculate price comparison details (server-side only)
 * @param officialPrice - The original/MSRP price
 * @param discountedPrice - The current selling price
 * @returns Price comparison object with savings
 */
export function calculatePriceComparison(
  officialPrice: Decimal | number,
  discountedPrice: Decimal | number
): PriceComparison {
  const official = typeof officialPrice === 'number' 
    ? officialPrice 
    : parseFloat(officialPrice.toString());
  
  const discounted = typeof discountedPrice === 'number'
    ? discountedPrice
    : parseFloat(discountedPrice.toString());

  const savings = official - discounted;
  const savingsPercentage = official > 0 ? (savings / official) * 100 : 0;

  return {
    officialPrice: official,
    discountedPrice: discounted,
    savings: Math.max(0, savings),
    savingsPercentage: Math.max(0, Math.round(savingsPercentage * 100) / 100),
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number | Decimal): string {
  const value = typeof amount === 'number' ? amount : parseFloat(amount.toString());
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(value);
}
