import { Form, Input, InputTag, Switch } from '@arco-design/web-react';
import React from 'react';

const emailReg =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const EmailOptionComponent: React.FC = () => {
  return (
    <>
      <Form.Item label="邮件标题" field={'title'} required>
        <Input />
      </Form.Item>
      <Form.Item field={'to'} label="邮箱地址">
        <InputTag
          allowClear
          placeholder="回车确认，可以输入多个"
          validate={(value) => {
            return emailReg.test(value);
          }}
        />
      </Form.Item>
      <Form.Item label="系统名" field={'system'}>
        <Input />
      </Form.Item>
      <Form.Item label="用户组" field={'ops'}>
        <Input />
      </Form.Item>
      <Form.Item label="包含管理员" field={'containsManager'}>
        <Switch />
      </Form.Item>
      {/* <Form.Item hidden field={'isHtml'} defaultValue={'true'} /> */}
      <Form.Item label="邮件内容" field={'content'}>
        <Input.TextArea autoSize={{ minRows: 8 }} />
      </Form.Item>
    </>
  );
};
