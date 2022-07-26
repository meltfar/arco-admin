export interface DataSourceConfig {
  id: number;
  name: string;
  type: 'SQL' | 'PROMETHEUS' | 'ELASTIC_SEARCH';
  config?: string;
}

export interface ExportDataSource {
  id: number;
  extLabels?: string; // json || nothing
  query: string; // SQL or ES
  intervalMinutes: string; // minutes
  name: string;
  lastQueryTime: string; // time
  dataSourceId: number; // -> DataSourceConfig.id
  dataSource?: DataSourceConfig;
  //   queryOptions: string; // reserved
  description: string;
  target?: 'exportByHttp'; // exportByHttp || nothing
  exportOptions: string; // json
}
