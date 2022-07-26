import { Form, Input, Select } from '@arco-design/web-react';
import React from 'react';

export const CallApiOptionComponent: React.FC = () => {
  return (
    <>
      <Form.Item label="URL" field={'extOptions.url'} required>
        <Input />
      </Form.Item>
      <Form.Item label="内容格式" field={'extOptions.contentType'}>
        <Input placeholder="application/json" />
      </Form.Item>
      <Form.Item label="请求方法" field={'extOptions.method'} required>
        <Select defaultValue={'post'}>
          <Select.Option key="post" value="post">
            POST
          </Select.Option>
          <Select.Option key="get" value="get">
            GET
          </Select.Option>
          <Select.Option key="head" value="head">
            HEAD
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="请求体" field={'extOptions.exportDataTemplate'}>
        <Input.TextArea autoSize={{ minRows: 8 }} />
      </Form.Item>
    </>
  );
};
