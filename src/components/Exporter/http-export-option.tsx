import React, { useState } from 'react';
import { Divider, Input, Radio } from '@arco-design/web-react';
import { EmailOptionComponent } from './Options/email-option';
import { CallApiOptionComponent } from './Options/call-option';

const HttpExportOptions: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  //   type: string;
}> = (props) => {
  const [currentExporter, setCurrentExporter] = useState<
    'custom' | 'sendEmail' | 'sendSms' | 'invokeApi'
  >('custom');
  return (
    <>
      <div
        style={{
          width: '100%',
          borderRadius: '12px',
          border: '2px dashed gray',
          padding: '12px 12px',
        }}
      >
        <span
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ verticalAlign: 'center', marginRight: '10px' }}>
            一键填充：
          </span>
          <Radio.Group
            size="large"
            type="button"
            defaultValue={'custom'}
            options={[
              { value: 'custom', label: '自定义' },
              { value: 'sendEmail', label: '发送邮件' },
              { value: 'sendSms', label: '发送短信', disabled: true },
              { value: 'invokeApi', label: '调用接口' },
            ]}
            onChange={(value) => {
              setCurrentExporter(value);
            }}
          />
        </span>
        <Divider />
        {currentExporter === 'custom' && (
          <Input.TextArea
            value={props.value}
            onChange={props.onChange}
            autoSize={{ minRows: 8 }}
          />
        )}
        {currentExporter === 'sendEmail' && <EmailOptionComponent />}
        {currentExporter === 'invokeApi' && <CallApiOptionComponent />}
      </div>
    </>
  );
};

export default HttpExportOptions;
