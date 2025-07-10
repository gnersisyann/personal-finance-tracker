export type HenaketStructuredListHeader = {
  title: string;
  colspan: number;
};

export type HenaketStructuredListProps = {
  headers: HenaketStructuredListHeader[];
  hideHeaders?: boolean;
};

export type HenaketStructuredListCellProps = {
  statusIndicator?: boolean;
  status?: boolean;
  hideOnMobile?: boolean;
  colspan: number;
};
