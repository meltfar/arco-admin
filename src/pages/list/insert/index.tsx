import HttpExportOptions from '@/components/Exporter/http-export-option';
import { DataSourceConfig } from '@/services/export_data';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  Typography,
} from '@arco-design/web-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './style/index.module.less';

const getTagColor: (tagName: DataSourceConfig['type']) => string = (
  tagName
) => {
  switch (tagName) {
    case 'SQL':
      return 'magenta';
    case 'ELASTIC_SEARCH':
      return 'purple';
    case 'PROMETHEUS':
      return 'arcoblue';
    default:
      return undefined;
  }
};

const InsertForm: React.FC = () => {
  const [dataSourceList, setDataSourceList] = useState<DataSourceConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [currentSource, setCurrentSource] = useState<DataSourceConfig>();
  const [currentTarget, setCurrentTarget] = useState<'exportByHttp' | 'none'>(
    'none'
  );

  useEffect(() => {
    setLoading(true);
    const ac = new AbortController();
    axios
      .post(
        '/aiops-api/dataSource/search.json',
        { pageNo: 1, search: '', max: 999999, offset: 0 },
        { signal: ac.signal }
      )
      .then((resp) => {
        setDataSourceList(resp.data.list);
      })
      .catch((reason) => {
        console.log(reason);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => ac.abort();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <Card style={{ borderRadius: '12px' }}>
          <Typography.Title>新增采集</Typography.Title>
          <div className={styles.wrapper}>
            <Form
              form={form}
              onSubmit={(values) => {
                console.log('commit: ', values);
              }}
            >
              <Form.Item label="选择采集源" field={'dataSourceId'} required>
                <Select
                  loading={loading}
                  onChange={(value) => {
                    setCurrentSource(
                      dataSourceList.find((v) => v.id === value)
                    );
                  }}
                  value={currentSource?.id}
                  disabled={
                    !loading && (!dataSourceList || dataSourceList.length <= 0)
                  }
                >
                  {dataSourceList?.map((v) => (
                    <Select.Option key={v.id} value={v.id}>
                      <span>
                        {v.name} &nbsp;&nbsp;
                        <Tag color={getTagColor(v.type)}>{v.type}</Tag>
                      </span>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {currentSource?.type === 'ELASTIC_SEARCH' && (
                <Form.Item label="强制集群" field={'forceCluster'}>
                  <Input allowClear />
                </Form.Item>
              )}

              <Form.Item label="查询内容" field="query" required>
                <Input.TextArea autoSize={{ minRows: 8 }} />
              </Form.Item>

              <Form.Item label="间隔时间" field="intervalMinutes" required>
                <InputNumber placeholder="单位： 分钟" />
              </Form.Item>

              <Form.Item label="名称" field="name" required>
                <Input />
              </Form.Item>

              <Form.Item label="描述" field="description" required>
                <Input />
              </Form.Item>

              <Form.Item label="导出目标" field="target">
                <Select
                  value={currentTarget}
                  onChange={(value) => setCurrentTarget(value)}
                  defaultValue={'none'}
                >
                  <Select.Option key="none" value="none">
                    通过ES(默认)
                  </Select.Option>
                  <Select.Option key="http" value="exportByHttp">
                    通过调用HTTP
                  </Select.Option>
                </Select>
              </Form.Item>

              {currentTarget === 'exportByHttp' && (
                <Form.Item label="导出配置" field="exportOptions">
                  <HttpExportOptions />
                </Form.Item>
              )}

              <Form.Item>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button size="large" type="primary" htmlType="submit">
                    提交
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
};

export default InsertForm;
