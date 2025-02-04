import React, { useEffect, useState } from 'react';
import * as Charts from '@ant-design/charts';

import {
  Data,
  MOCK_DATA,
  defaultFormatterFn,
  defaultLineStyleFn,
  inputIdMap,
  chartTypes,
  defaultConfigValue
} from './constants';
import { runJs } from './util';
import { useMemo } from 'react';

export default function ({ data, env, inputs }: RuntimeParams<Data>) {
  const { edit } = env;
  const [chartData, setChartData] = useState([])
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    if (edit) {
      let mockData = MOCK_DATA[data.type] || []
      if (data.type === chartTypes.LIQUID) {
        setPercent(mockData)
      } else {
        mockData = mockData.map((item) => {
          if (Array.isArray(data.config.yField)) {
            
            if (data.type === chartTypes.DUAL_AXES) {
              return [...item]
            } else {
              return {
                ...item,
                [data.config.yField[0]]: item[data.config.yField[0]],
                [data.config.yField[1]]: item[data.config.yField[1]],
                [data.config.xField]: item.label
              }
            }
          }

          return {
            ...item,
            [data.config.yField]: item[data.config.yField],
            [data.config.xField]: item[data.config.xField]
          }
        })
        setChartData(mockData)
      }
      // console.log(data.type, chartData)
    }
  }, [data.type]);

  useEffect(() => {
    inputs[inputIdMap.DATA]((val: any) => {
      if (data.type === chartTypes.LIQUID) {
        setPercent(val)
      } else {
        setChartData(val)
      }
    })

    inputs[inputIdMap.CONFIG]((val: any) => {
      data.type = val.chartType || data.type
      delete val.chartType
      data.config = { ...val }
    })

    Object.keys(inputIdMap).map(key => {
      const inputId = inputIdMap[key]
      const keyPath = inputId.split('.')
      if (keyPath.length > 1) { // 只考虑两级
        inputs[inputId] && inputs[inputId](val => {
          data.config[keyPath[0]][keyPath[1]] = val
          data.config = { ...data.config }
        })
      } else {
        if (inputId !== inputIdMap.DATA && inputId !== inputIdMap.CONFIG) {
          inputs[inputId] && inputs[inputId](val => {
            if (inputId === inputIdMap.LABEL || inputId === inputIdMap.LEGEND || inputId === inputIdMap.TOOLTIP) {
              data.config[inputId] = val ? defaultConfigValue[inputId] : false
            } else {
              data.config[inputId] = val
            }
            
            data.config = { ...data.config }
            // console.log(inputId, val, data.config)
          })
        }
      }
      
    })
  }, [])

  const getTooltip = () => {
    if (data.tooltipFormatterFn.visible) {
      return {
        ...data.config.tooltip,
        formatter: runJs(decodeURIComponent(data.tooltipFormatterFn.content || defaultFormatterFn))
      }
    } else {
      return data.config.tooltip
    }
  }

  const getLineStyle = () => {
    if (data.lineStyleFn.visible) {
      return runJs(decodeURIComponent(data.lineStyleFn.content || defaultLineStyleFn))
    } else {
      return null
    }
  }

  const getGeometryOptions = () => {
    if (data.type === chartTypes.DUAL_AXES) {
      return data.config.geometryOptions || [{},{}]
    }
  }
  
  const config = {
    data: chartData,
    percent,
    ...data.config,
    tooltip: getTooltip(),
    lineStyle: getLineStyle(),
    geometryOptions: getGeometryOptions()
  }

  if (!config.tooltip) {
    delete config.tooltip
  }

  // 如果不去掉，会导致图表切换报错
  if (data.type === chartTypes.LIQUID) {
    delete config.data
    delete config.label
  } else {
    delete config.percent
  }
  
  // console.log(data.type, config)

  const Chart = useMemo(() => Charts[data.type], [data.type, data.config, chartData]);

  return config.data?.length > 0 || config.percent > 0 ? (
    <Chart {...config} />
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center' }}>暂无数据</div>
  );
}
