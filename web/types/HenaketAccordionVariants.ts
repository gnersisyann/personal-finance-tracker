import type { HenaketButtonVariants } from "./HenaketButtonVariants";

export type HenaketLink = {
  title: string;
  href: string;
  target?: "_blank" | "_self";
};

export type HenaketAccordionProps = {
  title: string;
  content?: string;
  anchor?: string;
  actionVariant?: HenaketButtonVariants;
  actionButtonLink?: HenaketLink;
  actionButtonIcon?: string;
};
