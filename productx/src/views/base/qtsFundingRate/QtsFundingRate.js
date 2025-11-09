import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, message, Spin, Select, Col, Row, DatePicker, Input, Tabs } from 'antd';
import { UnorderedListOutlined, LineChartOutlined } from '@ant-design/icons';
import Pagination from "src/components/common/Pagination";
import QtsFundingRateTable from "./QtsFundingRateTable";
import QtsFundingRateDetailModal from './QtsFundingRateDetailModal';
import QtsFundingRateChart from './QtsFundingRateChart';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const QtsFundingRate = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    exchange: undefined,
    symbol: undefined,
    pair: undefined,
    startTime: undefined,
    endTime: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [exchanges, setExchanges] = useState([]);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );
      const response = await api.get('/manage/qts/funding-rate/page', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data || []);
        // @ts-ignore
        setTotalNum(response.totalNum || 0);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error('获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        startTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      }));
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        startTime: undefined,
        endTime: undefined,
      }));
    }
  };

  const handleDetailClick = (record) => {
    setSelectedRateId(record.id);
    setIsDetailModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const tabItems = [
    {
      key: 'list',
      label: (
        <span>
          <UnorderedListOutlined />
          列表视图
        </span>
      ),
      children: (
        <>
          <div className="mb-3">
            <Row gutter={16}>
              <Col>
                <Select
                  value={searchParams.exchange}
                  onChange={(value) => handleSearchChange({ target: { name: 'exchange', value }})}
                  allowClear
                  placeholder="选择交易所"
                  style={{ width: 150 }}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children || '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {exchanges.map((exchange) => (
                    <Select.Option 
                      key={exchange.id} 
                      value={exchange.exchangeName}
                    >
                      {exchange.exchangeName}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Input
                  value={searchParams.symbol}
                  onChange={handleSearchChange}
                  name="symbol"
                  placeholder="交易对符号 (如 BTCUSDT)"
                  allowClear
                  style={{ width: 180 }}
                />
              </Col>
              <Col>
                <Input
                  value={searchParams.pair}
                  onChange={handleSearchChange}
                  name="pair"
                  placeholder="币种 (如 BTC)"
                  allowClear
                  style={{ width: 150 }}
                />
              </Col>
              <Col>
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  onChange={handleDateRangeChange}
                  style={{ width: 350 }}
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : '查询'}
                </Button>
              </Col>
            </Row>
          </div>

          <div className="table-responsive">
            <Spin spinning={isLoading}>
              <QtsFundingRateTable
                data={data}
                handleDetailClick={handleDetailClick}
              />
            </Spin>
          </div>
          <Pagination
            totalPages={totalPages}
            current={currentPage}
            onPageChange={setCurrent}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </>
      )
    },
    {
      key: 'chart',
      label: (
        <span>
          <LineChartOutlined />
          图表视图
        </span>
      ),
      children: <QtsFundingRateChart />
    }
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
      
      <QtsFundingRateDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedRateId(null);
        }}
        rateId={selectedRateId}
      />
    </div>
  );
};

export default QtsFundingRate;

