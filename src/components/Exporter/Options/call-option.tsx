import { Form, Input, Select } from '@arco-design/web-react';
import React from 'react';

export const CallApiOptionComponent: React.FC = () => {
  return (
    <>
      <Form.Item label="URL" field={'exportOptions.url'} required>
        <Input />
      </Form.Item>
      <Form.Item label="内容格式" field={'exportOptions.contentType'}>
        <Input placeholder="application/json" />
      </Form.Item>
      <Form.Item label="请求方法" field={'exportOptions.method'} required>
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
          <Select.Option key="put" value="put">
            PUT
          </Select.Option>
          <Select.Option key="delete" value="delete">
            DELETE
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="请求体" field={'exportOptions.exportDataTemplate'}>
        <Input.TextArea autoSize={{ minRows: 8 }} />
      </Form.Item>
    </>
  );
};
