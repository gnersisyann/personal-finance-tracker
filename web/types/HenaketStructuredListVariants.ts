export type HenaketStructuredListHeader = {
  title: string;
  colspan: number;
};

export type HenaketStructuredListProps = {
  headers: HenaketStructuredListHeader[];
  hideHeaders?: boolean;
};

export type HenaketStructuredListRowProps = {
  // Свойства для Row будут переданы через слоты и attrs
};

export type HenaketStructuredListCellProps = {
  statusIndicator?: boolean;
  status?: boolean;
  hideOnMobile?: boolean;
  colspan: number;
};
