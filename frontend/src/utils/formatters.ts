/**
 * Converts cents to dollars and formats the price
 * @param cents - Price in cents
 * @returns Formatted price in dollars with 2 decimal places
 */
export const formatPrice = (cents: number): string => {
    const dollars = Number(cents).toFixed(2);
    return `$${dollars}`;
}; 