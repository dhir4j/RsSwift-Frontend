
import pricingData from '../../Flask_Project/Data/pricing.json';

const capitalizeCountryName = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Dynamically extract country names from the pricing data
const countriesFromPricing = pricingData.map(item => capitalizeCountryName(item.country));

// Remove duplicates and sort alphabetically
export const internationalCountryList: string[] = [...new Set(countriesFromPricing)]
  .sort((a, b) => a.localeCompare(b));
