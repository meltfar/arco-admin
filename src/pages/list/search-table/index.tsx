import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { PaginationProps } from '@arco-design/web-react';
import {
  Table,
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Message,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import type { AxiosError } from 'axios';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import SearchForm from './form';
import locale from './locale';
import styles from './style/index.module.less';
import type { ColumnProps } from '@arco-design/web-react/es/Table';
import type { ExportDataSource } from '@/services/export_data';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { useRouter } from 'next/router';

const { Title } = Typography;

const getForceCluster = (col: string) => {
  if (!col) {
    return '';
  }
  let tag = '';
  try {
    tag = (JSON.parse(col) as { forceCluster: string }).forceCluster;
  } catch (e) {}
  return tag;
};

const SearchTable: React.FC = () => {
  const t = useLocale(locale);

  const router = useRouter();

  // const tableCallback = async (record, type) => {
  //   console.log(record, type);
  // };
  const [data, setData] = useState<ExportDataSource[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [formParams, setFormParams] = useState({});
  const [pagination, setPatination] = useState<Partial<PaginationProps>>({
    // sizeCanChange: true,
    // showTotal: true,
    pageSize: 10,
    current: 1,
    // pageSizeChangeResetCurrent: true,
  });

  const loadDataList = useCallback(
    (signal?: AbortSignal) => {
      const { current, pageSize } = pagination;
      setLoading(true);
      axios
        .post('/aiops-api/exportDataSource/list', {
          data: {
            offset: (current - 1) * pageSize,
            max: pageSize,
            ...formParams,
          },
          signal: signal ?? undefined,
        })
        .then((res) => {
          setData(res.data.list);
          setTotal(res.data.total);
        })
        .catch((err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            Message.error({
              content: JSON.stringify((err as AxiosError).response.data),
            });
          } else {
            console.error(err.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [formParams, pagination]
  );

  const columns: ColumnProps<ExportDataSource>[] = useMemo(
    () => [
      { key: 'id', dataIndex: 'id', title: 'ID', align: 'center', width: 70 },
      { key: 'name', dataIndex: 'name', title: '名字', align: 'center' },
      {
        title: '请求',
        key: 'query',
        dataIndex: 'query',
        align: 'center',
        render: (col, ent) => {
          const isSql = col.substring(0, 6).toUpperCase() === 'SELECT';
          const clusterName = getForceCluster(ent.extLabels);

          const popoverContent = (
            <>
              {!isSql && clusterName && (
                <div>
                  强制集群： <Tag>{clusterName}</Tag>
                </div>
              )}
              <span>
                <SyntaxHighlighter language={isSql ? 'sql' : 'json'}>
                  {col}
                </SyntaxHighlighter>
              </span>
            </>
          );
          return (
            <Button
              type="text"
              onClick={() => {
                Modal.info({
                  content: popoverContent,
                  title: isSql ? 'SQL' : 'ELASTICSEARCH',
                });
              }}
            >
              查看{isSql ? 'SQL' : 'ES'}请求
            </Button>
          );
        },
      },
      {
        key: 'intervalMinute',
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
          const popoverContent = (
            <span>
              <SyntaxHighlighter language={'json'}>{col}</SyntaxHighlighter>
            </span>
          );
          return (
            <Button
              type="text"
              onClick={() => {
                Modal.info({ content: popoverContent, title: '导出配置' });
              }}
            >
              查看导出配置
            </Button>
          );
        },
      },
      {
        key: 'action',
        title: '操作',
        width: 160,
        render: (_, entity) => {
          return (
            <>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Button
                  key={`edit-${entity.id}`}
                  onClick={() => {
                    router.push(`/list/insert?mode=edit&id=${entity.id}`);
                  }}
                >
                  编辑
                </Button>
                <Button
                  key={`remove-${entity.id}`}
                  status="danger"
                  onClick={() => {
                    Modal.warning({
                      content: '确定要删除此条配置吗？',
                      okText: '确定',
                      cancelText: '取消',
                      onOk: async () => {
                        setLoading(true);
                        try {
                          const resp = await axios.get(
                            `/aiops-api/exportDataSource/del?id=${entity.id}`
                          );
                          Message.success(JSON.stringify(resp.data));

                          loadDataList();
                        } catch (e: unknown) {
                          if (axios.isAxiosError(e)) {
                            Message.error(JSON.stringify(e.response?.data));
                          } else {
                            console.error(e);
                          }
                        } finally {
                          setLoading(false);
                        }
                      },
                    });
                  }}
                >
                  删除
                </Button>
              </div>
            </>
          );
        },
      },
    ],
    [loadDataList]
  );

  useEffect(() => {
    const ac = new AbortController();
    loadDataList(ac.signal);
    return () => ac.abort();
  }, [loadDataList]);

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
