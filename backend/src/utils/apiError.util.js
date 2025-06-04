class apiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates that this is an operational error
    // Error.captureStackTrace(this, this
  }
}
export { apiError };
export default apiError;