// filepath: c:\Users\garnik.nersisyan\Desktop\NEW\henaket-web-guide\composables\useFile.ts
import { filesize } from "filesize";

export function useFile() {
  const { $settings } = useNuxtApp();
  const { translateField } = useTranslation();
  // const { globalSettings } = $settings;

  const humanizeFileSize = (sizeInBytes: number | string) => {
    return filesize(sizeInBytes, {
      symbols: {
        // B: translateField(globalSettings.file_size_units_translations, 'byte'),
        // kB: translateField(globalSettings.file_size_units_translations, 'kilobyte'),
        // MB: translateField(globalSettings.file_size_units_translations, 'megabyte'),
        // GB: translateField(globalSettings.file_size_units_translations, 'gigabyte'),
        // TB: translateField(globalSettings.file_size_units_translations, 'terabyte'),
        // PB: translateField(globalSettings.file_size_units_translations, 'petabyte'),
      },
    });
  };

  /**
   * Получает расширение файла из URL или имени
   * @param fileName - имя файла или URL
   * @returns расширение файла в нижнем регистре
   */
  function getFileExtension(fileName: string): string {
    const match = fileName.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : "";
  }

  /**
   * Проверяет, является ли файл изображением
   * @param fileName - имя файла или URL
   * @returns true если файл - изображение
   */
  function isImageFile(fileName: string): boolean {
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "bmp",
      "ico",
    ];
    const extension = getFileExtension(fileName);
    return imageExtensions.includes(extension);
  }

  /**
   * Проверяет, является ли файл документом
   * @param fileName - имя файла или URL
   * @returns true если файл - документ
   */
  function isDocumentFile(fileName: string): boolean {
    const documentExtensions = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
      "rtf",
    ];
    const extension = getFileExtension(fileName);
    return documentExtensions.includes(extension);
  }

  /**
   * Загружает файл программно
   * @param url - URL файла
   * @param fileName - имя для сохранения
   */
  function downloadFile(url: string, fileName?: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || url.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    humanizeFileSize,
    getFileExtension,
    isImageFile,
    isDocumentFile,
    downloadFile,
  };
}
