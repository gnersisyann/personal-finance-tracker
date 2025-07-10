export type HenaketFileAttachment = {
  title: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: string | number;
  hideFileSize?: boolean;
  hideFileIcon?: boolean;
  downloadable?: boolean;
};

export type HenaketFileAttachmentCardProps = {
  attachment: HenaketFileAttachment;
  compact?: boolean;
};
