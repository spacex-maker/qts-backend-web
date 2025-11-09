import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Spin, Space, Tag, Statistic, Row, Col, Card } from 'antd';
import {
  GlobalOutlined,
  IdcardOutlined,
  LineChartOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import api from 'src/axiosInstance';

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-size: 16px;
    color: #000000;
    font-weight: 500;
  }

  .ant-descriptions-item-label {
    font-size: 14px;
    color: #666666;
    background-color: #fafafa;
    padding: 12px 16px !important;
    font-weight: 500;
  }

  .ant-descriptions-item-content {
    padding: 12px 16px !important;
  }

  .ant-descriptions-bordered .ant-descriptions-item-label {
    width: 180px;
  }

  .description-icon {
    margin-right: 8px;
    color: #1890ff;
    font-size: 14px;
  }

  .statistic-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    padding: 16px;
    color: white;
    
    .ant-statistic-title {
      color: rgba(255, 255, 255, 0.85);
    }
    
    .ant-statistic-content {
      color: white;
    }
  }

  .positive-rate {
    color: #52c41a;
    font-weight: 600;
  }

  .negative-rate {
    color: #ff4d4f;
    font-weight: 600;
  }
`;

const QtsFundingRateDetailModal = ({ isVisible, onCancel, rateId }) => {
  const [loading, setLoading] = useState(false);
  const [rateData, setRateData] = useState(null);

  useEffect(() => {
    if (isVisible && rateId) {
      fetchRateDetail();
    }
  }, [isVisible, rateId]);

  const fetchRateDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/manage/qts/funding-rate/${rateId}`);
      setRateData(response);
    } catch (error) {
      console.error('Failed to fetch funding rate detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const exchangeColors = {
    'Binance': '#F3BA2F',
    'OKX': '#000000',
    'Bybit': '#F7A600',
    'Bitget': '#00D4FF',
    'Gate.io': '#2354E6',
    'Deribit': '#0E8AF0',
    'Huobi': '#2E7BF7',
    'Phemex': '#1A1E3D'
  };

  const formatPrice = (price) => {
    if (!price) return '—';
    return `$${price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 8 
    })}`;
  };

  const renderFundingRate = (rate, percent) => {
    const isPositive = rate > 0;
    const isNegative = rate < 0;
    
    return (
      <span className={isPositive ? 'positive-rate' : isNegative ? 'negative-rate' : ''}>
        {isPositive && <RiseOutlined style={{ marginRight: 4 }} />}
        {isNegative && <FallOutlined style={{ marginRight: 4 }} />}
        {percent || '—'}
      </span>
    );
  };

  return (
    <StyledModal
      title={<Space><LineChartOutlined />资金费率详情</Space>}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
    >
      <Spin spinning={loading}>
        {rateData && (
          <>
            {/* 关键指标卡片 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card className="statistic-card">
                  <Statistic
                    title="当前资金费率"
                    value={rateData.fundingRatePercent || '—'}
                    prefix={rateData.fundingRate > 0 ? <RiseOutlined /> : rateData.fundingRate < 0 ? <FallOutlined /> : null}
                    valueStyle={{ color: 'white', fontSize: '20px' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '8px', padding: '16px', color: 'white' }}>
                  <Statistic
                    title="标记价格"
                    value={formatPrice(rateData.markPrice)}
                    valueStyle={{ color: 'white', fontSize: '18px' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '8px', padding: '16px', color: 'white' }}>
                  <Statistic
                    title="持仓量"
                    value={rateData.openInterest?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '—'}
                    valueStyle={{ color: 'white', fontSize: '18px' }}
                  />
                </Card>
              </Col>
            </Row>

            <Descriptions column={1} bordered>
              <Descriptions.Item
                label={<Space><IdcardOutlined className="description-icon" />ID</Space>}
              >
                {rateData.id}
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><GlobalOutlined className="description-icon" />交易所</Space>}
              >
                <Tag 
                  color={exchangeColors[rateData.exchange] || 'default'}
                  icon={<GlobalOutlined />}
                  style={{ fontSize: '14px', padding: '4px 12px', fontWeight: 500 }}
                >
                  {rateData.exchange}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><LineChartOutlined className="description-icon" />交易对信息</Space>}
              >
                <Space>
                  <code style={{ backgroundColor: '#f5f5f5', padding: '4px 12px', borderRadius: '4px', fontSize: '14px', fontWeight: 500 }}>
                    {rateData.symbol}
                  </code>
                  <Tag color="blue">{rateData.pair}</Tag>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><PercentageOutlined className="description-icon" />当前资金费率</Space>}
              >
                {renderFundingRate(rateData.fundingRate, rateData.fundingRatePercent)}
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><PercentageOutlined className="description-icon" />预测资金费率</Space>}
              >
                {renderFundingRate(rateData.fundingRatePredicted, rateData.fundingRatePredictedPercent)}
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><DollarOutlined className="description-icon" />标记价格</Space>}
              >
                {formatPrice(rateData.markPrice)}
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><DollarOutlined className="description-icon" />指数价格</Space>}
              >
                {formatPrice(rateData.indexPrice)}
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><PercentageOutlined className="description-icon" />利率</Space>}
              >
                {(rateData.interestRate * 100).toFixed(4)}%
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><LineChartOutlined className="description-icon" />持仓量</Space>}
              >
                {rateData.openInterest?.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) || '—'}
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><FieldTimeOutlined className="description-icon" />资金费间隔</Space>}
              >
                <Tag color="blue">{rateData.fundingInterval} 小时</Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><CalendarOutlined className="description-icon" />资金费时间</Space>}
              >
                {rateData.fundingTime || '无'}
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><CalendarOutlined className="description-icon" />下次结算时间</Space>}
              >
                {rateData.nextFundingTime || '无'}
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><CalendarOutlined className="description-icon" />数据获取时间</Space>}
              >
                {rateData.retrievedAt || '无'}
              </Descriptions.Item>

              <Descriptions.Item
                label={<Space><CalendarOutlined className="description-icon" />创建时间</Space>}
              >
                {rateData.createTime || '无'}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Spin>
    </StyledModal>
  );
};

export default QtsFundingRateDetailModal;

