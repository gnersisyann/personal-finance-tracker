import type { ValidationRule } from "~/composables/useValidation";

// Предустановленные правила валидации
export const validationRules = {
  required:
    (message = "Поле обязательно для заполнения") =>
    (value: string) =>
      value.trim().length > 0 || message,

  minLength: (min: number, message?: string) => (value: string) =>
    value.length >= min || message || `Минимум ${min} символов`,

  maxLength: (max: number, message?: string) => (value: string) =>
    value.length <= max || message || `Максимум ${max} символов`,

  email:
    (message = "Введите корректный email") =>
    (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || message,

  phone:
    (message = "Введите корректный номер телефона") =>
    (value: string) =>
      /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, "")) || message,

  number:
    (message = "Введите числовое значение") =>
    (value: string) =>
      (!isNaN(Number(value)) && value.trim() !== "") || message,

  pattern: (regex: RegExp, message: string) => (value: string) =>
    regex.test(value) || message,
};
