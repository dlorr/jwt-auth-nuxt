/**
 * Centralizes API error handling for form pages.
 * Extracts a clean string from whatever the Axios interceptor throws.
 */
export function useFormError() {
  const errorMessage = ref("");
  const successMessage = ref("");

  function setError(err: unknown) {
    errorMessage.value =
      err instanceof Error
        ? err.message
        : "Something went wrong. Please try again.";
  }

  function setSuccess(msg: string) {
    successMessage.value = msg;
    errorMessage.value = "";
  }

  function clearMessages() {
    errorMessage.value = "";
    successMessage.value = "";
  }

  return {
    errorMessage,
    successMessage,
    setError,
    setSuccess,
    clearMessages,
  };
}
