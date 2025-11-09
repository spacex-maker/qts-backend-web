import React from 'react';
import { Button, Tag, Tooltip } from 'antd';
import { 
  GlobalOutlined, 
  RiseOutlined, 
  FallOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const QtsFundingRateTable = ({ data, handleDetailClick }) => {
  
  // 交易所名称颜色映射
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

  // 格式化资金费率，带颜色
  const formatFundingRate = (rate, percent) => {
    const isPositive = rate > 0;
    const isNegative = rate < 0;
    
    return (
      <span style={{ 
        color: isPositive ? '#52c41a' : isNegative ? '#ff4d4f' : '#8c8c8c',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {isPositive && <RiseOutlined />}
        {isNegative && <FallOutlined />}
        {percent || '—'}
      </span>
    );
  };

  // 格式化价格
  const formatPrice = (price) => {
    if (!price) return '—';
    return `$${price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 8 
    })}`;
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          {[
            '交易所', 
            '交易对', 
            '币种',
            '资金费率', 
            '预测费率',
            '标记价格',
            '持仓量',
            '资金费时间',
            '下次结算',
            '操作'
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>
              <Tag 
                color={exchangeColors[item.exchange] || 'default'}
                icon={<GlobalOutlined />}
                style={{ fontWeight: 500 }}
              >
                {item.exchange || '—'}
              </Tag>
            </td>
            <td>
              <code style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '2px 8px', 
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 500
              }}>
                {item.symbol || '—'}
              </code>
            </td>
            <td>
              <Tag color="blue">{item.pair || '—'}</Tag>
            </td>
            <td>
              {formatFundingRate(item.fundingRate, item.fundingRatePercent)}
            </td>
            <td>
              {formatFundingRate(item.fundingRatePredicted, item.fundingRatePredictedPercent)}
            </td>
            <td>
              <Tooltip title={`指数价格: ${formatPrice(item.indexPrice)}`}>
                <span style={{ fontWeight: 500 }}>
                  {formatPrice(item.markPrice)}
                </span>
              </Tooltip>
            </td>
            <td>
              <Tooltip title="总持仓量">
                <span>
                  <LineChartOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                  {item.openInterest?.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  }) || '—'}
                </span>
              </Tooltip>
            </td>
            <td>{item.fundingTime || '—'}</td>
            <td>{item.nextFundingTime || '—'}</td>
            <td>
              <Button type="link" onClick={() => handleDetailClick(item)}>
                详情
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QtsFundingRateTable;

