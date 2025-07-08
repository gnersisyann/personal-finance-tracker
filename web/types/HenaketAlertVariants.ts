export type HenaketAlertVariants =
  | "success"
  | "info"
  | "warning"
  | "error"
  | "standard";

export type HenaketAlert = {
  icon?: string;
  title: string;
  content?: string;
  variant?: HenaketAlertVariants;
};
