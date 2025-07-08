export type HenaketPaginationProps = {
  perPage: number;
  total: number;
  disabled?: boolean;
  siblings?: number;
  previousButton: {
    text: string;
    icon?: string;
  };
  nextButton: {
    text: string;
    icon?: string;
  };
};

export type HenaketPaginationDotsProps = {
  total: number;
  disabled?: boolean;
  ariaLabelDot?: (index: number) => string;
};

export type HenaketPaginationMobileProps = {
  perPage: number;
  total: number;
  text: string;
  disabled?: boolean;
  firstPageButton: {
    text: string;
    icon?: string;
  };
  previousButton: {
    text: string;
    icon?: string;
  };
  nextButton: {
    text: string;
    icon?: string;
  };
  lastPageButton: {
    text: string;
    icon?: string;
  };
};
