import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Spin, Space, Tag } from 'antd';
import {
  GlobalOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  CompassOutlined,
  FileTextOutlined,
  CalendarOutlined,
  SyncOutlined
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

  .exchange-tag {
    font-size: 14px;
    padding: 4px 12px;
    font-weight: 500;
  }

  .settlement-times {
    font-family: 'Courier New', monospace;
    background-color: #f5f5f5;
    padding: 8px 12px;
    border-radius: 4px;
    display: inline-block;
    font-size: 13px;
  }
`;

const QtsFundingConfigDetailModal = ({ isVisible, onCancel, configId }) => {
  const [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    if (isVisible && configId) {
      fetchConfigDetail();
    }
  }, [isVisible, configId]);

  const fetchConfigDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/manage/qts/exchange-funding-config/${configId}`);
      setConfigData(response);
    } catch (error) {
      console.error('Failed to fetch funding config detail:', error);
    } finally {
      setLoading(false);
    }
  };

  // 交易所名称颜色映射
  const exchangeColors = {
    'binance': '#F3BA2F',
    'okx': '#000000',
    'bybit': '#F7A600',
    'bitget': '#00D4FF',
    'gateio': '#2354E6',
    'deribit': '#0E8AF0',
    'huobi': '#2E7BF7',
    'phemex': '#1A1E3D'
  };

  const exchangeNames = {
    'binance': 'Binance (币安)',
    'okx': 'OKX',
    'bybit': 'Bybit',
    'bitget': 'Bitget',
    'gateio': 'Gate.io',
    'deribit': 'Deribit',
    'huobi': 'Huobi (火币)',
    'phemex': 'Phemex'
  };

  return (
    <StyledModal
      title={<Space><GlobalOutlined />资金费率同步配置详情</Space>}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={650}
      centered
    >
      <Spin spinning={loading}>
        {configData && (
          <Descriptions column={1} bordered>
            <Descriptions.Item
              label={<Space><IdcardOutlined className="description-icon" />配置ID</Space>}
            >
              {configData.id}
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><GlobalOutlined className="description-icon" />交易所</Space>}
            >
              <Tag 
                color={exchangeColors[configData.exchange] || 'default'}
                className="exchange-tag"
                icon={<GlobalOutlined />}
              >
                {exchangeNames[configData.exchange] || configData.exchange?.toUpperCase()}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><ClockCircleOutlined className="description-icon" />同步间隔</Space>}
            >
              <Space>
                <Tag color="blue" icon={<ClockCircleOutlined />}>
                  {configData.fundingInterval} 小时
                </Tag>
                <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                  (每{configData.fundingInterval}小时同步一次数据)
                </span>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><FieldTimeOutlined className="description-icon" />结算时间</Space>}
            >
              <div className="settlement-times">
                {configData.settlementTimes}
              </div>
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><CompassOutlined className="description-icon" />时区</Space>}
            >
              <Tag color="cyan" icon={<CompassOutlined />}>
                {configData.timezone}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><SyncOutlined className="description-icon" />同步状态</Space>}
            >
              {configData.isSync ? (
                <Tag color="success" icon={<SyncOutlined spin />}>
                  启用同步
                </Tag>
              ) : (
                <Tag color="default">
                  禁用同步
                </Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><FileTextOutlined className="description-icon" />备注</Space>}
            >
              {configData.remark || '无'}
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><CalendarOutlined className="description-icon" />创建时间</Space>}
            >
              {configData.createTime || '无'}
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><CalendarOutlined className="description-icon" />更新时间</Space>}
            >
              {configData.updateTime || '无'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Spin>
    </StyledModal>
  );
};

export default QtsFundingConfigDetailModal;

