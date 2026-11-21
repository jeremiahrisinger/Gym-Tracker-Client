export interface TableColumn {
  key: string;
  label: string;
  help?: string;
  useMatIcon?: boolean,
  asList?: boolean,
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  transform?: (value: any) => string | string[];
}
