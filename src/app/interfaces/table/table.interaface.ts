export interface RowActionI<T> {
  key: string;
  row: T;
}

export interface TableActionI {
  key: string;
  icon?: string;
  tooltipText?: string;
  class?: string;
}

export interface TableColumnI<T = unknown> {
  key: string;
  label: string;
  type?: string;
}
