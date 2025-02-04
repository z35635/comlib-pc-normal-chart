import React, { useRef, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Heatmap as MockData } from '../mock';
import Heatmap from './heatmap';

export default function ({ data, inputs, env }) {
  const chartRef: any = useRef();
  const [dataSource, setDataSource] = useState(
    env.edit ? MockData[data.subType].slice(0, 20) : []
  );
  const [subDataSource, setSubDataSource] = useState(
    env.edit ? MockData[data.subType].slice(20, 23) : []
  );
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState('');
  useEffect(() => {
    inputs.setBgImg((url: string) => {
      data.config.annotations[0].src = url;
      data.config = { ...data.config };
    });
    inputs.data(({ dataSource, xAxis, yAxis }) => {
      if (!Array.isArray(dataSource)) return;
      // const { pick = () => true } = data.config;
      if (xAxis) {
        Object.assign(data.config.xAxis, xAxis);
      }
      if (yAxis) {
        Object.assign(data.config.yAxis, yAxis);
      }
      if (xAxis || yAxis) {
        data.config = { ...data.config };
      }
      setDataSource(dataSource);
    });
    inputs.extraData0(({ dataSource, xAxis, yAxis }) => {
      if (!Array.isArray(dataSource)) return;
      // const { pick = () => true } = data.subConfig[0];
      if (xAxis) {
        Object.assign(data.subConfig[0].xAxis, xAxis);
      }
      if (yAxis) {
        Object.assign(data.subConfig[0].yAxis, yAxis);
      }
      setSubDataSource(dataSource);
    });
    inputs.setMainConfig((config) => {
      data.config = {
        ...data.config,
        ...config,
        label: {
          ...data.config.label,
          ...config.label,
        },
      };

      if (config.useSubHeatMap !== void 0) {
        data.useSubHeatMap = config.useSubHeatMap;
      }
    });
    inputs.setSubConfig((config) => {
      data.subConfig[0] = {
        ...data.subConfig[0],
        ...config,
        label: {
          ...data.subConfig[0].label,
          ...config.label,
        },
      };
      data.subConfig = [...data.subConfig]
    });
    inputs.loading(ds => {
      if (typeof ds === 'string') setTip(ds);
      setLoading(!!ds);
    });
  }, []);

  return (
    <Spin
      spinning={loading}
      tip={tip}
    >
      <Heatmap
        env={env}
        inputs={inputs}
        dataSource={dataSource}
        subDataSource={subDataSource}
        mainConfig={data.config}
        subConfig={data.subConfig}
        useSubHeatMap={data.useSubHeatMap}
      />
    </Spin>
  );
}
