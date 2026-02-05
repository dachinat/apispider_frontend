export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password !== undefined && password !== null && password.length >= 6;
};

export const validatePasswordMatch = (
  password: string,
  confirmation: string,
): boolean => {
  return password === confirmation;
};

export const validateRequired = (value: string): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};
