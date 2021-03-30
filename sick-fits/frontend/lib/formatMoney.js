/**
 * @file formatMoney helper function.
 *
 * Custom logic for formatting prices.
 */

export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  };

  // If amount is a whole number, don't show .00.
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = new Intl.NumberFormat('en-US', options);

  // We divide by 100 because we're getting the amount in cents.
  return formatter.format(amount / 100);
}
