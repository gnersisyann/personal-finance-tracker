export type HenaketDataTableHeader = {
  title: string;
  valueTemplate: string;
  sortable?: boolean;
};

export type HenaketDataTableProps = {
  headers: HenaketDataTableHeader[];
  items: any[];
  disabled?: boolean;
  stickyHeader?: boolean;
};
