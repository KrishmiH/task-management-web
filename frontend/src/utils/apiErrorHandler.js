// src/utils/apiErrorHandler.js
export function getErrorMessage(error) {
  if (!error) return "Unknown error";
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return String(error);
}
