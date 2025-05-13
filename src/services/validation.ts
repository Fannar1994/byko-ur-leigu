
/**
 * Validates if the provided kennitala is in the correct format.
 * Basic validation - checks if it is 10 digits.
 */
export function validateKennitala(kennitala: string): boolean {
  // Basic validation - should be 10 digits
  if (kennitala.length !== 10 || !/^\d+$/.test(kennitala)) {
    return false;
  }
  
  // More sophisticated validation could be added here
  return true;
}
