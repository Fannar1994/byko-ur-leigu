
/**
 * Utility functions for managing item counts
 */

// Store item counts in memory
const itemCountsMemory: Record<string, number> = {};

/**
 * Set count for an item
 */
export function setItemCount(itemId: string, count: number): void {
  itemCountsMemory[itemId] = count;
}

/**
 * Get count for an item
 */
export function getItemCount(itemId: string): number {
  return itemCountsMemory[itemId] || 0;
}

/**
 * Get all item counts
 */
export function getAllItemCounts(): Record<string, number> {
  return { ...itemCountsMemory };
}

/**
 * Clear count for an item
 */
export function clearItemCount(itemId: string): void {
  delete itemCountsMemory[itemId];
}

/**
 * Clear all counts
 */
export function clearAllItemCounts(): void {
  Object.keys(itemCountsMemory).forEach(key => {
    delete itemCountsMemory[key];
  });
}
