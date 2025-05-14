
// Utility functions to track contract status operations

// Check if tiltekt has been completed for a contract
export const hasTiltektBeenCompleted = (contractId: string): boolean => {
  const completedTiltektContracts = JSON.parse(localStorage.getItem('completedTiltektContracts') || '[]');
  return completedTiltektContracts.includes(contractId);
};

// Mark a contract as having completed tiltekt
export const markTiltektAsCompleted = (contractId: string): void => {
  const completedTiltektContracts = JSON.parse(localStorage.getItem('completedTiltektContracts') || '[]');
  if (!completedTiltektContracts.includes(contractId)) {
    completedTiltektContracts.push(contractId);
    localStorage.setItem('completedTiltektContracts', JSON.stringify(completedTiltektContracts));
  }
};

// Clear tiltekt completion status (for testing purposes)
export const clearTiltektCompletionStatus = (contractId: string): void => {
  const completedTiltektContracts = JSON.parse(localStorage.getItem('completedTiltektContracts') || '[]');
  const updatedContracts = completedTiltektContracts.filter((id: string) => id !== contractId);
  localStorage.setItem('completedTiltektContracts', JSON.stringify(updatedContracts));
};
