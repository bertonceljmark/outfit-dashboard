export const extractErrorMessage = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    return error.join(", ");
  }

  return "Something went wrong";
};
