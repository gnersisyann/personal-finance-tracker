// filepath: c:\Users\garnik.nersisyan\Desktop\NEW\henaket-web-guide\utils\getFileIconsByType.ts
/**
 * Определяет имя иконки файла по типу/расширению
 * @param fileType - тип файла или расширение
 * @returns имя файла иконки
 */
export function getFileIconsByType(fileType: string): string {
  const type = fileType.toLowerCase();

  // PDF файлы
  if (type === "pdf" || type === "application/pdf") {
    return "file-pdf";
  }

  // Word документы
  if (
    type === "doc" ||
    type === "docx" ||
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "file-word";
  }

  // Excel таблицы
  if (
    type === "xls" ||
    type === "xlsx" ||
    type === "application/vnd.ms-excel" ||
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "file-excel";
  }

  // PowerPoint презентации
  if (
    type === "ppt" ||
    type === "pptx" ||
    type === "application/vnd.ms-powerpoint" ||
    type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return "file-powerpoint";
  }

  // Изображения
  if (
    type === "jpg" ||
    type === "jpeg" ||
    type === "png" ||
    type === "gif" ||
    type === "webp" ||
    type === "svg" ||
    type.startsWith("image/")
  ) {
    return "file-image";
  }

  // Видео
  if (
    type === "mp4" ||
    type === "avi" ||
    type === "mov" ||
    type === "wmv" ||
    type === "webm" ||
    type.startsWith("video/")
  ) {
    return "file-video";
  }

  // Аудио
  if (
    type === "mp3" ||
    type === "wav" ||
    type === "flac" ||
    type === "ogg" ||
    type.startsWith("audio/")
  ) {
    return "file-audio";
  }

  // Архивы
  if (
    type === "zip" ||
    type === "rar" ||
    type === "7z" ||
    type === "tar" ||
    type === "gz"
  ) {
    return "file-archive";
  }

  // Текстовые файлы
  if (
    type === "txt" ||
    type === "rtf" ||
    type === "md" ||
    type.startsWith("text/")
  ) {
    return "file-text";
  }

  // Код
  if (
    type === "js" ||
    type === "ts" ||
    type === "vue" ||
    type === "html" ||
    type === "css" ||
    type === "json" ||
    type === "xml"
  ) {
    return "file-code";
  }

  // По умолчанию
  return "file-default";
}
