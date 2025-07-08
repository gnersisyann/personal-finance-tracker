export type HenaketButtonVariants =
  | "primary"
  | "secondary"
  | "outlined"
  | "start"
  | "yesem"
  | "toTop"
  | "floating"
  | "icon";

export type HenaketButtonSizes = "regular" | "large";

export type HenaketButton = {
  variant?: HenaketButtonVariants;
  size?: HenaketButtonSizes;
  disabled?: boolean;
  link?: any;
};
