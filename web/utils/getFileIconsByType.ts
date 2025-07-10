export function getFileIconsByType(fileType: string): string {
  const type = fileType.toLowerCase();

  if (type === "pdf" || type === "application/pdf") {
    return "file-pdf";
  }

  if (
    type === "doc" ||
    type === "docx" ||
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "file-word";
  }

  if (
    type === "xls" ||
    type === "xlsx" ||
    type === "application/vnd.ms-excel" ||
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "file-excel";
  }

  if (
    type === "ppt" ||
    type === "pptx" ||
    type === "application/vnd.ms-powerpoint" ||
    type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return "file-powerpoint";
  }

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

  if (
    type === "mp3" ||
    type === "wav" ||
    type === "flac" ||
    type === "ogg" ||
    type.startsWith("audio/")
  ) {
    return "file-audio";
  }

  if (
    type === "zip" ||
    type === "rar" ||
    type === "7z" ||
    type === "tar" ||
    type === "gz"
  ) {
    return "file-archive";
  }

  if (
    type === "txt" ||
    type === "rtf" ||
    type === "md" ||
    type.startsWith("text/")
  ) {
    return "file-text";
  }

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

  return "file-default";
}
