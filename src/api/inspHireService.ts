
// src/api/inspHireService.ts
// This file re-exports everything from the individual service files
// to maintain backward compatibility

// Core API utilities
export {
  defaultHeaders,
  getSessionId,
  fetchWithErrorHandling
} from './core/apiClient';

// Auth services
export {
  testApiConnection,
  loginToInspHire,
  validateSession
} from './services/authService';

// Contract services
export {
  fetchContracts,
  fetchContractAttachments
} from './services/contractsService';

// Item services
export {
  fetchContractItems,
  updateItemStatus,
  offHireItem,
  fetchItemComments,
  addItemComment
} from './services/itemsService';

// Customer services
export {
  fetchCustomerByKennitala
} from './services/customersService';
