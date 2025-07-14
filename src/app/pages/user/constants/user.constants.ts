export const USER_CONSTANTS = {
  // API endpoints
  API_ENDPOINTS: {
    USERS: '/api/users',
    USER_PROFILE: '/api/users/profile',
    USER_SETTINGS: '/api/users/settings'
  },

  // Validation messages
  VALIDATION_MESSAGES: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
    PASSWORD_MISMATCH: 'Passwords do not match'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },

  // User limits
  LIMITS: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_PROFILE_IMAGE_SIZE: 2 * 1024 * 1024 // 2MB
  }
}; 