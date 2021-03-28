export const getApiBase = () =>
  process.env['NODE_ENV'] === 'development' && window.location.port === '3000' ? 'https://localhost:3001' : ''
