import {
  Form,
  Input,
  InputNumber,
  InputTag,
  Select,
  Switch,
} from '@arco-design/web-react';
import React from 'react';

const emailReg =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const EmailOptionComponent: React.FC = () => {
  return (
    <>
      <Form.Item label="邮件标题" field={'exportOptions.title'} required>
        <Input />
      </Form.Item>
      <Form.Item field={'exportOptions.to'} label="邮箱地址">
        <InputTag
          allowClear
          placeholder="回车确认，可以输入多个"
          validate={(value) => {
            return emailReg.test(value);
          }}
        />
      </Form.Item>
      <Form.Item label="系统名" field={'exportOptions.system'}>
        <Input />
      </Form.Item>
      <Form.Item label="用户组" field={'exportOptions.userGroup'}>
        <Select>
          <Select.Option key="ops" value={'ops'}>
            运维
          </Select.Option>
          <Select.Option key="developer" value={'developer'}>
            开发
          </Select.Option>
          <Select.Option key="all" value={'all'}>
            所有人
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="包含管理员" field={'exportOptions.containsManager'}>
        <Switch />
      </Form.Item>
      <Form.Item label="最小可接受条目" field={'exportOptions.minCount'}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="条件" field={'exportOptions.condition'}>
        <Input />
      </Form.Item>
      <Form.Item label="仅允许非空结果" field={'exportOptions.notAllowEmpty'}>
        <Switch />
      </Form.Item>
      {/* <Form.Item hidden field={'isHtml'} defaultValue={'true'} /> */}
      <Form.Item label="邮件内容" field={'exportOptions.content'}>
        <Input.TextArea autoSize={{ minRows: 8 }} />
      </Form.Item>
    </>
  );
};
