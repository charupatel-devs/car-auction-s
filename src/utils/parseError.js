export const parseError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.data && error.response.data.message) {
      return error.response.data.message;
    } else {
      return "An error occurred while processing your request.";
    }
  } else if (error.request) {
    // The request was made but no response was received
    return "No response from the server. Please try again later.";
  } else {
    // Something happened in setting up the request that triggered an Error
    return "An error occurred. Please try again later.";
  }
};
