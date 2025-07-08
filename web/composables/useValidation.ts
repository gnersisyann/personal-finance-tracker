export type ValidationResult = string | boolean;

export type ValidationRule =
  | ValidationResult
  | PromiseLike<ValidationResult>
  | ((value: any) => ValidationResult)
  | ((value: any) => PromiseLike<ValidationResult>)
  | ((value: any) => Promise<ValidationResult>);

export type ValidationProps = {
  modelValue: string;
  rules?: readonly ValidationRule[];
};

export function useValidation(
  input: Ref<string>,
  rules: ValidationRule[],
  errorMessage: Ref<string | boolean>
) {
  async function validate() {
    if (!rules.length) return true;

    for (const rule of rules) {
      const handler = typeof rule === "function" ? rule : () => rule;
      const result = await handler(input.value);

      if (result === true) continue;

      if (result !== false && typeof result !== "string") continue;

      errorMessage.value = result;
      return false;
    }

    errorMessage.value = false;
    return true;
  }

  return {
    validate,
  };
}
