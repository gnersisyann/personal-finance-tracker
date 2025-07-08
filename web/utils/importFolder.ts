// filepath: c:\Users\garnik.nersisyan\Desktop\NEW\henaket-web-guide\utils\importFolder.ts
/**
 * Утилита для импорта файлов из папки с помощью Vite glob
 * @param modules - результат import.meta.glob()
 * @returns объект с именами файлов как ключи и их содержимое как значения
 */
export function importFolder(
  modules: Record<string, any>
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const path in modules) {
    // Извлекаем имя файла без расширения из пути
    const fileName =
      path
        .split("/")
        .pop()
        ?.replace(/\.[^/.]+$/, "") || "";

    // Получаем содержимое модуля
    const module = modules[path];

    // Для изображений получаем default export (URL)
    if (module.default) {
      result[fileName] = module.default;
    } else {
      result[fileName] = module;
    }
  }

  return result;
}
