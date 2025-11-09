import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Select, Button, message, Spin, Row, Col, Card, Statistic } from 'antd';
import { LineChartOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const QtsFundingRateChart = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(undefined);
  const [selectedSymbol, setSelectedSymbol] = useState(undefined);
  const [chartData, setChartData] = useState([]);
  const [dataRange, setDataRange] = useState({ minTime: null, maxTime: null });
  const [loadingDirection, setLoadingDirection] = useState(null); // 'left' | 'right' | null
  const [statistics, setStatistics] = useState({
    avg: 0,
    max: 0,
    min: 0,
    latest: 0
  });

  // 常用交易对
  const popularSymbols = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 
    'ADAUSDT', 'XRPUSDT', 'DOGEUSDT', 'DOTUSDT',
    'MATICUSDT', 'LINKUSDT', 'UNIUSDT', 'LTCUSDT'
  ];

  useEffect(() => {
    fetchEnabledExchanges();
  }, []);

  const fetchEnabledExchanges = async () => {
    try {
      const response = await api.get('/manage/qts-supported-exchanges/enabled');
      if (Array.isArray(response)) {
        setExchanges(response);
      }
    } catch (error) {
      console.error('Failed to fetch exchanges:', error);
    }
  };

  const fetchChartData = async () => {
    if (!selectedExchange || !selectedSymbol) {
      message.warning('请先选择交易所和交易对');
      return;
    }

    setLoading(true);
    setChartData([]);
    setDataRange({ minTime: null, maxTime: null });
    try {
      // 获取该交易对的历史数据，按时间排序
      const response = await api.get('/manage/qts/funding-rate/page', {
        params: {
          exchange: selectedExchange,
          symbol: selectedSymbol,
          currentPage: 1,
          pageSize: 100, // 获取最近100条数据
        },
      });

      if (response && response.data) {
        const data = response.data.sort((a, b) => 
          new Date(a.fundingTime).getTime() - new Date(b.fundingTime).getTime()
        );
        setChartData(data);
        updateDataRange(data);
        calculateStatistics(data);
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const updateDataRange = (data) => {
    if (data.length === 0) {
      setDataRange({ minTime: null, maxTime: null });
      return;
    }
    const times = data.map(item => new Date(item.fundingTime).getTime()).filter(time => !isNaN(time));
    if (times.length === 0) {
      setDataRange({ minTime: null, maxTime: null });
      return;
    }
    setDataRange({
      minTime: Math.min(...times),
      maxTime: Math.max(...times)
    });
  };

  const calculateStatistics = (data) => {
    if (data.length === 0) {
      setStatistics({ avg: 0, max: 0, min: 0, latest: 0 });
      return;
    }

    const rates = data.map(item => item.fundingRate);
    const avg = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    const max = Math.max(...rates);
    const min = Math.min(...rates);
    const latest = rates[rates.length - 1];

    setStatistics({ avg, max, min, latest });
  };

  // 加载更早的数据（向左滑动）
  const loadEarlierData = async () => {
    if (!selectedExchange || !selectedSymbol || loadingMore || !dataRange.minTime || typeof dataRange.minTime !== 'number') {
      return;
    }

    setLoadingMore(true);
    setLoadingDirection('left');
    try {
      const endTime = new Date(dataRange.minTime - 1); // 加载更早的数据
      const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000); // 加载前7天的数据

      const response = await api.get('/manage/qts/funding-rate/page', {
        params: {
          exchange: selectedExchange,
          symbol: selectedSymbol,
          currentPage: 1,
          pageSize: 100,
          startTime: startTime.toISOString().replace('T', ' ').substring(0, 19),
          endTime: endTime.toISOString().replace('T', ' ').substring(0, 19),
        },
      });

      if (response && response.data && response.data.length > 0) {
        const newData = response.data.sort((a, b) => 
          new Date(a.fundingTime).getTime() - new Date(b.fundingTime).getTime()
        );
        
        // 合并数据并去重
        const mergedData = [...newData, ...chartData];
        const uniqueData = mergedData.filter((item, index, self) =>
          index === self.findIndex(t => t.id === item.id)
        ).sort((a, b) => new Date(a.fundingTime).getTime() - new Date(b.fundingTime).getTime());

        setChartData(uniqueData);
        updateDataRange(uniqueData);
        calculateStatistics(uniqueData);
      }
    } catch (error) {
      console.error('Failed to load earlier data:', error);
    } finally {
      setLoadingMore(false);
      setLoadingDirection(null);
    }
  };

  // 加载更新的数据（向右滑动）
  const loadLaterData = async () => {
    if (!selectedExchange || !selectedSymbol || loadingMore || !dataRange.maxTime || typeof dataRange.maxTime !== 'number') {
      return;
    }

    setLoadingMore(true);
    setLoadingDirection('right');
    try {
      const startTime = new Date(dataRange.maxTime + 1); // 加载更新的数据
      const endTime = new Date();

      const response = await api.get('/manage/qts/funding-rate/page', {
        params: {
          exchange: selectedExchange,
          symbol: selectedSymbol,
          currentPage: 1,
          pageSize: 100,
          startTime: startTime.toISOString().replace('T', ' ').substring(0, 19),
          endTime: endTime.toISOString().replace('T', ' ').substring(0, 19),
        },
      });

      if (response && response.data && response.data.length > 0) {
        const newData = response.data.sort((a, b) => 
          new Date(a.fundingTime).getTime() - new Date(b.fundingTime).getTime()
        );
        
        // 合并数据并去重
        const mergedData = [...chartData, ...newData];
        const uniqueData = mergedData.filter((item, index, self) =>
          index === self.findIndex(t => t.id === item.id)
        ).sort((a, b) => new Date(a.fundingTime).getTime() - new Date(b.fundingTime).getTime());

        setChartData(uniqueData);
        updateDataRange(uniqueData);
        calculateStatistics(uniqueData);
      }
    } catch (error) {
      console.error('Failed to load later data:', error);
    } finally {
      setLoadingMore(false);
      setLoadingDirection(null);
    }
  };

  // 处理图表滑动事件
  const handleDataZoom = (params) => {
    if (!params || !params.batch || loadingMore) return;

    const zoom = params.batch[0];
    if (!zoom) return;

    // 计算当前显示的数据范围
    const dataLength = chartData.length;
    const startIndex = Math.floor((zoom.start / 100) * dataLength);
    const endIndex = Math.ceil((zoom.end / 100) * dataLength);

    // 如果滑动到开始位置（前5%），加载更早的数据
    if (zoom.start < 5 && startIndex === 0) {
      loadEarlierData();
    }
    
    // 如果滑动到结束位置（后95%），加载更新的数据
    if (zoom.end > 95 && endIndex >= dataLength - 1) {
      loadLaterData();
    }
  };

  const getChartOption = () => {
    const times = chartData.map(item => item.fundingTime);
    const rates = chartData.map(item => (item.fundingRate * 100).toFixed(4)); // 转换为百分比

    return {
      title: {
        text: `${selectedExchange} - ${selectedSymbol} 资金费率走势`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const param = params[0];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${param.axisValue}</div>
              <div style="color: ${param.data > 0 ? '#52c41a' : '#ff4d4f'};">
                资金费率: ${param.data}%
              </div>
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times,
        axisLabel: {
          rotate: 45,
          formatter: (value) => {
            // 只显示日期和小时
            return value.substring(5, 16);
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '资金费率 (%)',
        axisLabel: {
          formatter: '{value}%'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          moveOnMouseWheel: false
        },
        {
          start: 0,
          end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }
      ],
      series: [
        {
          name: '资金费率',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(24, 144, 255, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(24, 144, 255, 0.05)'
                }
              ]
            }
          },
          itemStyle: {
            color: (params) => {
              return params.data > 0 ? '#52c41a' : '#ff4d4f';
            }
          },
          data: rates,
          markLine: {
            silent: true,
            lineStyle: {
              color: '#999',
              type: 'dashed'
            },
            data: [
              {
                yAxis: 0,
                label: {
                  formatter: '零费率线'
                }
              }
            ]
          }
        }
      ]
    };
  };

  const formatRate = (rate) => {
    const percent = (rate * 100).toFixed(4);
    return `${percent}%`;
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Select
            value={selectedExchange}
            onChange={setSelectedExchange}
            placeholder="选择交易所"
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
          >
            {exchanges.map((exchange) => (
              <Select.Option key={exchange.id} value={exchange.exchangeName}>
                {exchange.exchangeName}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            value={selectedSymbol}
            onChange={setSelectedSymbol}
            placeholder="选择交易对"
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
          >
            {popularSymbols.map((symbol) => (
              <Select.Option key={symbol} value={symbol}>
                {symbol}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            icon={<LineChartOutlined />}
            onClick={fetchChartData}
            loading={loading}
            block
          >
            查询走势
          </Button>
        </Col>
      </Row>

      {chartData.length > 0 && (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="最新费率"
                  value={formatRate(statistics.latest)}
                  valueStyle={{ 
                    color: statistics.latest > 0 ? '#52c41a' : statistics.latest < 0 ? '#ff4d4f' : '#8c8c8c',
                    fontSize: '20px'
                  }}
                  prefix={statistics.latest > 0 ? <RiseOutlined /> : statistics.latest < 0 ? <FallOutlined /> : null}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均费率"
                  value={formatRate(statistics.avg)}
                  valueStyle={{ fontSize: '20px' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="最高费率"
                  value={formatRate(statistics.max)}
                  valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                  prefix={<RiseOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="最低费率"
                  value={formatRate(statistics.min)}
                  valueStyle={{ color: '#ff4d4f', fontSize: '20px' }}
                  prefix={<FallOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card>
            <Spin spinning={loading || loadingMore} tip={loadingMore ? (loadingDirection === 'left' ? '加载更早的数据...' : '加载更新的数据...') : '加载中...'}>
              <ReactECharts
                option={getChartOption()}
                style={{ height: '500px' }}
                notMerge={true}
                lazyUpdate={true}
                onEvents={{
                  dataZoom: handleDataZoom
                }}
              />
            </Spin>
          </Card>
        </>
      )}

      {!loading && chartData.length === 0 && selectedExchange && selectedSymbol && (
        <Card style={{ textAlign: 'center', padding: '48px' }}>
          <LineChartOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
          <div style={{ marginTop: '16px', color: '#8c8c8c' }}>
            暂无数据，请选择其他交易所或交易对
          </div>
        </Card>
      )}
    </div>
  );
};

export default QtsFundingRateChart;

