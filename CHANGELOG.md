## [Unreleased]

### Security

- Replaced localStorage token storage with HTTP-only cookies
- Added CSRF protection for authenticated requests
- Implemented automatic token refresh mechanism
- Enhanced protected routes with proper authentication verification
- Fixed CORS issues with credentialed requests in development

### Changed

- Updated authentication store to work with cookie-based authentication
- Refactored API service to include credentials with requests
- Modified LoginForm component to use new authentication system
- Updated Header component to use authentication state
- Enhanced App initialization to setup CSRF protection
- Updated protected and public routes to use proper authentication checks
- Made API service environment-aware to handle development vs production differences
- Improved logout functionality with better error handling and graceful fallbacks

### Fixed

- Resolved logout errors by implementing robust error handling
- Fixed potential state inconsistencies after failed logout attempts
- Added development mode fallbacks for auth operations

### Added

- Created new authentication service (`authService.js`)
- Added security documentation (`SECURITY.md`)
- Added this changelog to track project changes
- Created centralized application configuration (`appConfig.js`)
- Added environment detection and feature flags
- Implemented graceful fallbacks for CSRF in development
