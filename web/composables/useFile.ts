import { filesize } from "filesize";

export function useFile() {
  const { $settings } = useNuxtApp();

  const humanizeFileSize = (sizeInBytes: number | string) => {
    return filesize(sizeInBytes, {
      symbols: {},
    });
  };

  function getFileExtension(fileName: string): string {
    const match = fileName.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : "";
  }

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
