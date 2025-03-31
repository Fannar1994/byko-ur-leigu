
// Format a date string to a more readable format with Icelandic month names
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    // Use Icelandic locale for dates
    const formatter = new Intl.DateTimeFormat('is-IS', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    // Get the formatted date and ensure correct Icelandic month abbreviations
    let formattedDate = formatter.format(date);
    
    // Manual correction for certain month abbreviations if needed
    formattedDate = formattedDate
      .replace('jún.', 'jún')
      .replace('júl.', 'júl')
      .replace('ágú.', 'ágú')
      .replace('sep.', 'sep')
      .replace('okt.', 'okt')
      .replace('nóv.', 'nóv')
      .replace('des.', 'des')
      .replace('jan.', 'jan')
      .replace('feb.', 'feb')
      .replace('mar.', 'mar')
      .replace('apr.', 'apr')
      .replace('maí.', 'maí');
    
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// Format a number as ISK currency
export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat('is-IS', {
      style: 'currency',
      currency: 'ISK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'code'
    }).format(amount).replace(',', '.');
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount} ISK`;
  }
}
