export const validationRules = {
  required:
    (message = "This field is required") =>
    (value: string) =>
      value.trim().length > 0 || message,

  minLength: (min: number, message?: string) => (value: string) =>
    value.length >= min || message || `Minimum ${min} characters`,

  maxLength: (max: number, message?: string) => (value: string) =>
    value.length <= max || message || `Maximum ${max} characters`,

  email:
    (message = "Enter a valid email") =>
    (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || message,

  phone:
    (message = "Enter a valid phone number") =>
    (value: string) =>
      /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, "")) || message,

  number:
    (message = "Enter a numeric value") =>
    (value: string) =>
      (!isNaN(Number(value)) && value.trim() !== "") || message,

  pattern: (regex: RegExp, message: string) => (value: string) =>
    regex.test(value) || message,
};
