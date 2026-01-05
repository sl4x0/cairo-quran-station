/**
 * Converts Western (0-9) numerals to Arabic-Indic (٠-٩) numerals
 * 
 * This function is used throughout the app to display numbers in Arabic format,
 * maintaining cultural authenticity for Arabic-speaking users. It's particularly
 * important for prayer times, verse numbers, and listener counts.
 * 
 * @param n - The number or string to convert (can be a number like 123 or string like "456")
 * @returns String with all Western digits replaced by their Arabic-Indic equivalents
 * 
 * @example
 * toArabicNum(123)      // returns "١٢٣"
 * toArabicNum("2024")   // returns "٢٠٢٤"
 * toArabicNum(5.5)      // returns "٥.٥"
 */
export function toArabicNum(n: number | string): string {
  // Mapping of Western digits (0-9) to Arabic-Indic numerals (٠-٩)
  const arabicNumerals: Record<string, string> = {
    "0": "٠",
    "1": "١",
    "2": "٢",
    "3": "٣",
    "4": "٤",
    "5": "٥",
    "6": "٦",
    "7": "٧",
    "8": "٨",
    "9": "٩",
  }

  // Convert input to string and replace each Western digit with its Arabic equivalent
  // The regex /[0-9]/g finds all digits, and we look them up in our mapping
  return String(n).replace(/[0-9]/g, (digit) => arabicNumerals[digit] || digit)
}
