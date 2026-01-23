
// Mock for apiService to avoid import.meta.env issues in Jest
export const apiService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  uploadFile: jest.fn(),
  buildQueryString: jest.fn(),
  setToken: jest.fn(),
  setRefreshToken: jest.fn(),
  removeTokens: jest.fn(),
};

export const setAuthTokens = jest.fn();
export const removeAuthTokens = jest.fn();
export const isAuthenticated = jest.fn();

export default apiService;
