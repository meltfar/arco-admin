import type { ReactNode } from 'react';
import React from 'react';
import { Switch, Divider, InputNumber } from '@arco-design/web-react';
import useLocale from '../../utils/useLocale';
import styles from './style/block.module.less';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateSettings } from '@/store/setting';

export interface BlockProps {
  title?: ReactNode;
  options?: { name: string; value: string; type?: 'switch' | 'number' }[];
  children?: ReactNode;
}

export default function Block(props: BlockProps) {
  const { title, options, children } = props;
  const locale = useLocale();
  const settings = useAppSelector((state) => state.setting.settings);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.block}>
      <h5 className={styles.title}>{title}</h5>
      {options &&
        options.map((option) => {
          const type = option.type || 'switch';

          return (
            <div className={styles['switch-wrapper']} key={option.value}>
              <span>{locale[option.name]}</span>
              {type === 'switch' && (
                <Switch
                  size="small"
                  checked={!!settings[option.value]}
                  onChange={(checked) => {
                    const newSetting = {
                      ...settings,
                      [option.value]: checked,
                    };
                    dispatch(updateSettings({ settings: newSetting }));
                    // set color week
                    if (checked && option.value === 'colorWeek') {
                      document.body.style.filter = 'invert(80%)';
                    }
                    if (!checked && option.value === 'colorWeek') {
                      document.body.style.filter = 'none';
                    }
                  }}
                />
              )}
              {type === 'number' && (
                <InputNumber
                  style={{ width: 80 }}
                  size="small"
                  value={settings.menuWidth}
                  onChange={(value) => {
                    const newSetting = {
                      ...settings,
                      [option.value]: value,
                    };
                    dispatch(updateSettings({ settings: newSetting }));
                  }}
                />
              )}
            </div>
          );
        })}
      {children}
      <Divider />
    </div>
  );
}
