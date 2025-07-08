export type HenaketNotificationVariants =
  | "standard"
  | "success"
  | "info"
  | "warning"
  | "error";

export type HenaketNotification = {
  title: string;
  description?: string;
  icon?: string;
  hideCloseButton?: boolean;
  variant?: HenaketNotificationVariants;
};
