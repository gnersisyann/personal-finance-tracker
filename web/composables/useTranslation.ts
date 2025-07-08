import type { Translation } from "~/types";

export type TranslatedObject<T> = { translations: Translation<T>[] };

export type UseTranslationReturn = {
  translateField: <T, K extends keyof T>(
    data: TranslatedObject<T> | Translation<T>[],
    field: K
  ) => T[K] | "";
};

export function useTranslation(): UseTranslationReturn {
  const { $config } = useNuxtApp();

  // Fallback языки если нет конфигурации
  const defaultLocale = "en";
  const fallbackLanguage = $config?.public?.fallbackLanguage || defaultLocale;

  // Простая функция получения текущего языка
  const getCurrentLocale = (): string => {
    // Можно использовать различные источники:

    // 1. Из localStorage (если сохраняется пользователем)
    if (process.client) {
      const savedLocale = localStorage.getItem("locale");
      if (savedLocale) return savedLocale;
    }

    // 2. Из браузера
    if (process.client && navigator.language) {
      const browserLang = navigator.language.split("-")[0];
      return browserLang;
    }

    // 3. Из конфига или по умолчанию
    return fallbackLanguage;
  };

  const translateField = <T, K extends keyof T>(
    data: TranslatedObject<T> | Translation<T>[],
    field: K
  ): T[K] | "" => {
    const translations = Array.isArray(data) ? data : data?.translations;

    if (!translations || !translations.length) return "";

    const currentLocale = getCurrentLocale();

    // Поиск по текущему языку
    const translation = translations.find((translation) =>
      typeof translation.languages_code === "string"
        ? translation.languages_code === currentLocale
        : translation.languages_code.code === currentLocale
    );

    if (translation && translation[field]) return translation[field]!;

    // Поиск по fallback языку
    const fallbackTranslation = translations.find((translation) =>
      typeof translation.languages_code === "string"
        ? translation.languages_code === fallbackLanguage
        : translation.languages_code.code === fallbackLanguage
    );

    if (fallbackTranslation && fallbackTranslation[field])
      return fallbackTranslation[field]!;

    // Берем первый доступный перевод
    const firstTranslation = translations[0];

    if (firstTranslation && firstTranslation[field])
      return firstTranslation[field]!;

    return "";
  };

  return {
    translateField,
  };
}
