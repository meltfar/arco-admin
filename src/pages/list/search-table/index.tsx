import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Popover,
  Tag,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { ExportDataSource } from '@/services/export_data';
import SyntaxHighlighter from 'react-syntax-highlighter';

const { Title } = Typography;

const SearchTable: React.FC = () => {
  const t = useLocale(locale);

  // const tableCallback = async (record, type) => {
  //   console.log(record, type);
  // };

  // const columns = useMemo(() => getColumns(t, tableCallback), [t]);
  const columns: ColumnProps<ExportDataSource>[] = useMemo(
    () => [
      { key: 'id', dataIndex: 'id', title: 'ID', align: 'center', width: 70 },
      { key: 'name', dataIndex: 'name', title: '名字', align: 'center' },
      {
        title: '请求',
        key: 'query',
        dataIndex: 'query',
        align: 'center',
        render: (col) => (
          <Popover
            trigger={'click'}
            style={{ minWidth: '40vw' }}
            title={
              col.substring(0, 6).toUpperCase() === 'SELECT'
                ? 'SQL'
                : 'ELASTICSEARCH'
            }
            content={
              <span>
                <SyntaxHighlighter
                  language={col.startsWith('SELECT') ? 'sql' : 'json'}
                >
                  {col}
                </SyntaxHighlighter>
              </span>
            }
          >
            <Button type="text">查看请求</Button>
          </Popover>
        ),
      },
      // {
      //   key: 'extLabels',
      //   title: 'ES集群标签',
      //   dataIndex: 'extLabels',
      //   align: 'center',
      //   render(col) {
      //     if (!col) {
      //       return '';
      //     }
      //     let tag = '';
      //     try {
      //       tag = (JSON.parse(col) as { forceCluster: string }).forceCluster;
      //     } catch (e) {}
      //     return (
      //       <>
      //         <Tag>{tag}</Tag>
      //       </>
      //     );
      //   },
      // },
      {
        key: 'intervalMinutes',
        title: '间隔时间(分钟)',
        dataIndex: 'intervalMinute',
      },
      {
        key: 'lastQueryTime',
        title: '最后请求时间',
        dataIndex: 'lastQueryTime',
        render: (col) => {
          if (typeof col === 'number') {
            return <span>{}</span>;
          } else {
            return <span>{col}</span>;
          }
        },
      },
      {
        key: 'description',
        title: '描述',
        dataIndex: 'description',
        align: 'center',
      },
      {
        key: 'target',
        title: '导出目标',
        dataIndex: 'target',
        align: 'center',
        render: (col: ExportDataSource['target']) => (
          <Tag color={col === 'exportByHttp' ? 'pinkpurple' : undefined}>
            {col === 'exportByHttp' ? '调用接口' : '其他'}
          </Tag>
        ),
      },
      {
        key: 'exportOptions',
        title: '导出配置',
        dataIndex: 'exportOptions',
        align: 'center',
        render: (col: string) => {
          if (!col || col === '{}') {
            return '';
          }
          return (
            <Popover
              trigger={'click'}
              title={''}
              style={{ minWidth: '45vw' }}
              content={
                <span>
                  <SyntaxHighlighter language={'json'}>{col}</SyntaxHighlighter>
                </span>
              }
            >
              <Button type="text">查看导出配置</Button>
            </Popover>
          );
        },
      },
    ],
    []
  );

  const [data, setData] = useState<ExportDataSource[]>([]);
  const [pagination, setPatination] = useState<Partial<PaginationProps>>({
    // sizeCanChange: true,
    // showTotal: true,
    pageSize: 10,
    current: 1,
    // pageSizeChangeResetCurrent: true,
  });
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [formParams, setFormParams] = useState({});

  useEffect(() => {
    const ac = new AbortController();
    const { current, pageSize } = pagination;
    setLoading(true);
    axios
      .get('/api/list', {
        params: {
          page: current,
          pageSize,
          ...formParams,
        },
        signal: ac.signal,
      })
      .then((res) => {
        setData(res.data.list);
        setTotal(res.data.total);
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
    return () => ac.abort();
  }, [formParams, pagination]);

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  return (
    <Card>
      <Title heading={6}>{t['menu.list.searchTable']}</Title>
      <SearchForm onSearch={handleSearch} />
      <PermissionWrapper
        requiredPermissions={[
          { resource: 'menu.list.searchTable', actions: ['write'] },
        ]}
      >
        <div className={styles['button-group']}>
          <Space>
            <Button type="primary" icon={<IconPlus />}>
              {t['searchTable.operations.add']}
            </Button>
            <Button>{t['searchTable.operations.upload']}</Button>
          </Space>
          <Space>
            <Button icon={<IconDownload />}>
              {t['searchTable.operation.download']}
            </Button>
          </Space>
        </div>
      </PermissionWrapper>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={{
          sizeCanChange: true,
          showTotal: true,
          pageSizeChangeResetCurrent: true,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
        }}
        columns={columns}
        data={data}
      />
    </Card>
  );
};

export default SearchTable;
