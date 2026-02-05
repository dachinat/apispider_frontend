/**
 * Formats backend validation errors (from our Go validator) into user-friendly messages.
 */
export const formatBackendError = (
  errMessage: string | null | undefined,
): string | null | undefined => {
  if (!errMessage || typeof errMessage !== "string") return errMessage;

  // Handle Go validator style: Key: 'Struct.Field' Error:Field validation for 'Field' failed on the 'tag' tag
  const validationMatch = errMessage.match(
    /Field validation for '([^']+)' failed on the '([^']+)' tag/,
  );
  if (validationMatch) {
    const [, field, tag] = validationMatch;
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

    switch (tag) {
      case "email":
        return `Invalid email address`;
      case "required":
        return `${fieldName} is required`;
      case "min":
        return `${fieldName} is too short`;
      case "max":
        return `${fieldName} is too long`;
      default:
        return `Invalid ${field.toLowerCase()}`;
    }
  }

  return errMessage;
};
