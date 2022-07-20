import React from 'react';
import cs from 'classnames';
import { Button } from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import { useAppSelector } from '@/store';

function Security() {
  const t = useLocale(locale);

  const userInfo = useAppSelector((state) => {
    return state.setting.userInfo;
  });

  const data = [
    {
      title: t['userSetting.security.password'],
      value: t['userSetting.security.password.tips'],
    },
    {
      title: t['userSetting.security.question'],
      value: '',
      placeholder: t['userSetting.security.question.placeholder'],
    },
    {
      title: t['userSetting.security.phone'],
      value: '123123123'
        ? `${t['userSetting.security.phone.tips']} ${'123123123'}`
        : '',
    },
    {
      title: t['userSetting.security.email'],
      value: '',
      placeholder: t['userSetting.security.email.placeholder'],
    },
  ];

  return (
    <div className={styles['security']}>
      {data.map((item, index) => (
        <div className={styles['security-item']} key={index}>
          <span className={styles['security-item-title']}>{item.title}</span>
          <div className={styles['security-item-content']}>
            <span
              className={cs({
                [`${styles['security-item-placeholder']}`]: !item.value,
              })}
            >
              {item.value || item.placeholder}
            </span>

            <span>
              <Button type="text">
                {item.value
                  ? t['userSetting.btn.edit']
                  : t['userSetting.btn.set']}
              </Button>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Security;
